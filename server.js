require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes');

// Trigger Firebase initialization
require('./config/firebase');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check / Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the TourNex Firebase API Gateway.',
    status: 'ONLINE',
    version: '2.0.0'
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully 🚀" });
});

app.post("/api/expenses/add", (req, res) => {
  const { uid, expense } = req.body;

  console.log("Expense received:", uid, expense);

  res.json({ success: true });
});

// API Routes mount
app.use('/api', apiRoutes);

// 404 Route handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
