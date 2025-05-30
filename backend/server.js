require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const userRoutes = require('./routes/userRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const progressRoutes = require('./routes/progressRoutes');
const noteRoutes = require('./routes/noteRoutes');
const followRoutes = require('./routes/followRoutes');


const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/follows', followRoutes);

// Sync database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced.');
}).catch((err) => {
  console.error('Database sync failed:', err.message);
});

// Example route
app.get('/', (req, res) => {
  res.send('Chess Learning API is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});