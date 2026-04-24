const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars before importing controllers that might use them
dotenv.config();

const workoutRoutes = require('./routes/workoutRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const trainingPlanRoutes = require('./routes/trainingPlanRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dual-mount routes: Vercel might strip or keep the '/api' prefix depending on internal routing
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/workouts', workoutRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/training-plans', trainingPlanRoutes);

app.use('/api', apiRouter);
app.use('/', apiRouter); // Catch stripped prefixes

// Healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Catch-all 404 JSON (Prevents HTML <!DOCTYPE html> parsing errors in React)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found inside Express', 
    path: req.originalUrl || req.url 
  });
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
