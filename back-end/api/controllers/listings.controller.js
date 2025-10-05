const prisma = require('../../config/prisma');

exports.getAllListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            orderBy: { created_at: 'desc' },
        });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id: req.params.id },
        });
        if (!listing) return res.status(404).json({ message: "Item niet gevonden." });
        res.json(listing);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createListing = async (req, res) => {
    const { type, name, price, description } = req.body;
    try {
        const newListing = await prisma.listing.create({
            data: { type, name, price, description },
        });
        res.status(201).json(newListing);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateListing = async (req, res) => {
    const { type, name, price, description, status } = req.body;
    try {
        const updatedListing = await prisma.listing.update({
            where: { id: req.params.id },
            data: { type, name, price, description, status },
        });
        res.json(updatedListing);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteListing = async (req, res) => {
    try {
        await prisma.listing.delete({
            where: { id: req.params.id },
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};