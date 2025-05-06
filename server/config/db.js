const mongoose = require('mongoose');

const connectDB = async () => {
  // Default to local if no environment variables are set
  const mongoUriLocal = process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/healthcare';
  
  try {
    // Connect to local MongoDB first as it's most reliable for development
    console.log('Attempting to connect to local MongoDB...');
    const conn = await mongoose.connect(mongoUriLocal, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log(`MongoDB Connected: ${conn.connection.host} (local)`);
    return conn;
  } catch (localError) {
    console.error(`Local MongoDB Connection Error: ${localError.message}`);
    console.log('Consider installing MongoDB locally for development:');
    console.log('1. Download from https://www.mongodb.com/try/download/community');
    console.log('2. Install and run the MongoDB service');
    console.log('3. Or use MongoDB Atlas with proper network configuration');
    
    // Exit the process as we can't proceed without a database
    process.exit(1);
  }
};

module.exports = connectDB;