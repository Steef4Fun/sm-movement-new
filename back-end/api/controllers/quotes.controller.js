const prisma = require('../../config/prisma');

exports.getQuotes = async (req, res) => {
    try {
        let whereClause = {};

        if (req.user.role !== 'admin') {
            whereClause.user_id = req.user.id;
        } else if (req.user.role === 'admin' && req.query.userId) {
            whereClause.user_id = req.query.userId;
        }

        const quotes = await prisma.quote.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        email: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
        res.json(quotes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Serverfout bij ophalen van offertes." });
    }
};

exports.createQuote = async (req, res) => {
    const { customer_email, subject, amount, description } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email: customer_email },
        });
        if (!user) {
            return res.status(404).json({ message: "Klant met dit e-mailadres niet gevonden." });
        }

        const newQuote = await prisma.quote.create({
            data: {
                user_id: user.id,
                subject,
                amount,
                description,
            },
        });
        res.status(201).json(newQuote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Serverfout bij aanmaken van offerte." });
    }
};

exports.updateQuote = async (req, res) => {
    const { id } = req.params;
    const { subject, amount, status, description } = req.body;
    try {
        const updatedQuote = await prisma.quote.update({
            where: { id },
            data: { subject, amount, status, description },
        });
        res.json(updatedQuote);
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Offerte niet gevonden." });
        }
        res.status(500).json({ message: "Serverfout bij bijwerken van offerte." });
    }
};

exports.updateQuoteStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (status !== 'geaccepteerd' && status !== 'geweigerd') {
        return res.status(400).json({ message: "Ongeldige status. Kies 'geaccepteerd' of 'geweigerd'." });
    }

    try {
        const quote = await prisma.quote.findFirst({
            where: { id, user_id: userId },
        });

        if (!quote) {
            return res.status(404).json({ message: "Offerte niet gevonden of u heeft geen toegang." });
        }

        const updatedQuote = await prisma.quote.update({
            where: { id },
            data: { status },
        });
        
        res.json(updatedQuote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Serverfout bij bijwerken van status." });
    }
};

exports.deleteQuote = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.quote.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Offerte niet gevonden." });
        }
        res.status(500).json({ message: "Serverfout bij verwijderen van offerte." });
    }
};