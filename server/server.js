// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Initialize Passport
app.use(passport.initialize());
require('./config/passport')(passport);

// Connect to MongoDB with prioritizing Atlas connection
const connectWithRetry = async () => {
  // Connection options with better timeout handling
  const options = {
    serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    retryWrites: true
  };

  try {
    // First try MongoDB Atlas connection
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('Connected to MongoDB Atlas successfully');
    startServer();
  } catch (atlasErr) {
    console.error('MongoDB Atlas Connection Error:', atlasErr.message);
    console.log('MongoDB Atlas connection failed. Trying direct connection...');
    
    // If Atlas connection fails, try direct connection
    try {
      console.log('Trying direct connection to MongoDB Atlas...');
      await mongoose.connect(process.env.MONGO_URI_DIRECT, options);
      console.log('Connected to MongoDB Atlas using direct connection');
      startServer();
    } catch (directErr) {
      console.error('Direct connection error:', directErr.message);
      
      // Try local connection as a last resort
      try {
        console.log('Trying local MongoDB connection as fallback...');
        await mongoose.connect(process.env.MONGO_URI_LOCAL, options);
        console.log('Connected to local MongoDB successfully');
        startServer();
      } catch (localErr) {
        console.error('All MongoDB connection attempts failed');
        console.error('Local MongoDB Connection Error:', localErr.message);
        console.log('Please check your internet connection or MongoDB configuration');
        process.exit(1);
      }
    }
  }
};

// Start the Express server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Call the connection function
connectWithRetry();

// You can add this to your server.js temporarily to check if alerts exist
app.get('/api/debug/alerts', async (req, res) => {
  try {
    const Alert = require('./models/Alert');
    const alerts = await Alert.find({});
    res.json({ count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add diagnostic route to check MongoDB connection status
app.get('/api/status', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      4: 'invalid credentials'
    };
    
    // Ping database to check actual connectivity
    const pingResult = await mongoose.connection.db.admin().ping();
    
    res.json({ 
      status: 'success',
      database: {
        state: states[dbState],
        connectionOK: dbState === 1,
        ping: pingResult.ok === 1 ? 'successful' : 'failed'
      },
      server: {
        uptime: Math.floor(process.uptime()),
        memoryUsage: process.memoryUsage()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Error checking server status', 
      error: error.message 
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/patients', require('./routes/patientsRoutes')); 
app.use('/api/vitals', require('./routes/vitalRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Healthcare Monitoring API is running...');
});

// Add a route to handle /api base path
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Healthcare Monitoring API is running',
    status: 'online',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});