const jwt = require('jsonwebtoken');

// Middleware om te controleren of er een geldige JWT is
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: "Geen token opgegeven." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token is ongeldig." });
        }
        req.user = user; // Sla de user payload (bv. {id: 1, role: 'admin'}) op in het request
        next();
    });
}

// Middleware om te controleren of de ingelogde gebruiker een admin is
// Deze moet ALTIJD NA authenticateToken worden gebruikt
function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Toegang geweigerd. Adminrechten vereist." });
    }
    next();
}

module.exports = {
    authenticateToken,
    isAdmin
};
