const prisma = require('../../config/prisma');

exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
            },
        });
        if (!user) return res.status(404).json({ message: "Gebruiker niet gevonden." });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { first_name, last_name } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { first_name, last_name },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
            },
        });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Admin Functies ---

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { id: 'asc' },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
            },
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body; // role should be 'klant' or 'admin'
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
        res.json({ message: "Rol bijgewerkt." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "Gebruiker niet gevonden." });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Serverfout bij ophalen van gebruiker." });
    }
};