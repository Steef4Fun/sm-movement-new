const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registratie
exports.register = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ message: "Alle velden zijn verplicht." });
    }

    try {
        // Hash het wachtwoord
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Voeg gebruiker toe aan database
        const newUser = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                first_name,
                last_name,
            },
        });

        res.status(201).json({ message: "Registratie succesvol." });

    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') { // Prisma's unique constraint violation code
            return res.status(409).json({ message: "E-mailadres is al in gebruik." });
        }
        res.status(500).json({ message: "Serverfout bij registratie." });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "E-mail en wachtwoord zijn verplicht." });
    }

    try {
        // Vind gebruiker
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: "Ongeldige inloggegevens." });
        }

        // Vergelijk wachtwoord
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Ongeldige inloggegevens." });
        }

        // Maak JWT
        const payload = {
            id: user.id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfout bij inloggen." });
    }
};