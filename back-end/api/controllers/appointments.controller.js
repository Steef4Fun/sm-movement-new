const prisma = require('../../config/prisma');

exports.getAppointments = async (req, res) => {
    try {
        let whereClause = {};

        // Klant vraagt om zijn EIGEN afspraken
        if (req.user.role !== 'admin') {
            whereClause.user_id = req.user.id;
        } 
        // Admin vraagt om afspraken van een SPECIFIEKE gebruiker
        else if (req.user.role === 'admin' && req.query.userId) {
            whereClause.user_id = req.query.userId;
        }
        // Admin vraagt om ALLE afspraken (geen extra where clause nodig)

        const appointments = await prisma.appointment.findMany({
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
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Serverfout bij ophalen van afspraken." });
    }
};

exports.createAppointment = async (req, res) => {
    const { customer_email, service_type, requested_date, notes } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email: customer_email },
        });
        if (!user) return res.status(404).json({ message: "Klant niet gevonden." });

        const newAppointment = await prisma.appointment.create({
            data: {
                user_id: user.id,
                service_type,
                requested_date,
                notes,
            },
        });
        res.status(201).json(newAppointment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Serverfout bij aanmaken van afspraak." });
    }
};

exports.updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { service_type, requested_date, notes, status } = req.body;
    try {
        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: { service_type, requested_date, notes, status },
        });
        res.json(updatedAppointment);
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') { // Prisma's record not found code
            return res.status(404).json({ message: "Afspraak niet gevonden." });
        }
        res.status(500).json({ message: "Serverfout bij bijwerken van afspraak." });
    }
};

exports.deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.appointment.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Afspraak niet gevonden." });
        }
        res.status(500).json({ message: "Serverfout bij verwijderen van afspraak." });
    }
};