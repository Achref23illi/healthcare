// Save as testMongo.js in your server directory
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

testConnection();