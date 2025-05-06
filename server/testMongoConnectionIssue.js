// Test script to diagnose MongoDB connection issues
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Resolve hostnames from the connection string
async function resolveHosts() {
  const hosts = [
    'health.0loxt1y.mongodb.net',
    'health-shard-00-00.0loxt1y.mongodb.net',
    'health-shard-00-01.0loxt1y.mongodb.net',
    'health-shard-00-02.0loxt1y.mongodb.net'
  ];

  console.log('Attempting DNS resolution for MongoDB hosts:');
  
  for (const host of hosts) {
    try {
      console.log(`\nResolving ${host}...`);
      // Use promisify to convert callback-based dns.lookup to promise-based
      const addresses = await new Promise((resolve, reject) => {
        dns.lookup(host, { all: true }, (err, addresses) => {
          if (err) reject(err);
          else resolve(addresses);
        });
      });
      
      console.log(`✓ Resolved ${host} to:`, addresses.map(a => a.address));
    } catch (error) {
      console.error(`✗ Failed to resolve ${host}: ${error.message}`);
    }
  }
}

// Test all available connection strings
async function testConnection(uri, name) {
  if (!uri) {
    console.error(`✗ ${name} connection failed: Connection URI is undefined`);
    return false;
  }
  
  try {
    console.log(`\nTesting ${name} connection...`);
    // Hide password in logs but check if the URI contains authentication info first
    const maskedUri = uri.includes('@') ? uri.replace(/:[^:\/]+@/, ':***@') : uri;
    console.log(`URI: ${maskedUri}`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Shorter timeout for testing
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log(`✓ ${name} connection successful!`);
    return true;
  } catch (error) {
    console.error(`✗ ${name} connection failed: ${error.message}`);
    return false;
  } finally {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch (e) {
      // Ignore disconnect errors
    }
  }
}

// Main function
async function diagnose() {
  console.log('MongoDB Connection Diagnostic Tool\n');
  
  try {
    // Step 1: Check DNS resolution
    await resolveHosts();
    
    // Step 2: Test connections
    const connections = [
      { uri: process.env.MONGO_URI, name: 'Primary (SRV)' },
      { uri: process.env.MONGO_URI_DIRECT, name: 'Direct' },
      { uri: process.env.MONGO_URI_LOCAL, name: 'Local' }
    ];
    
    let anySuccess = false;
    for (const conn of connections) {
      const success = await testConnection(conn.uri, conn.name);
      if (success) anySuccess = true;
    }
    
    // Recommendations
    console.log('\n--- Recommendations ---');
    if (anySuccess) {
      console.log('✓ At least one connection method worked. Use the successful connection string in your application.');
    } else {
      console.log('✗ All connection attempts failed. Please check:');
      console.log('  1. Your MongoDB Atlas cluster is running and accessible');
      console.log('  2. Your network allows connections to MongoDB (port 27017)');
      console.log('  3. Your IP address is whitelisted in MongoDB Atlas');
      console.log('  4. Your username and password are correct');
      console.log('  5. Try using a local MongoDB instance for development');
    }
  } catch (error) {
    console.error('Diagnostic failed:', error);
  }
  
  process.exit(0);
}

diagnose();
