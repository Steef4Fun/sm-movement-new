require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basis route voor testen
app.get('/', (req, res) => {
    res.send('SM-Movement Back-end is live!');
});

// --- API Routes ---
const authRoutes = require('./api/routes/auth.routes');
const usersRoutes = require('./api/routes/users.routes');
const listingsRoutes = require('./api/routes/listings.routes');
const appointmentsRoutes = require('./api/routes/appointments.routes');
const quotesRoutes = require('./api/routes/quotes.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/quotes', quotesRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server draait op poort ${PORT}`);
});
