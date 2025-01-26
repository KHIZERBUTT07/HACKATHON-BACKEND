const mongoose = require('mongoose');
require('dotenv').config();

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Drop the entire users collection
    await mongoose.connection.dropCollection('users');
    console.log('Dropped users collection');

    // Create a new collection with proper schema
    const User = require('../models/User');
    await User.createCollection();
    console.log('Created new users collection');

    // Create proper indexes
    await User.syncIndexes();
    console.log('Created proper indexes');

  } catch (error) {
    console.error('Error during reset:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetDatabase(); 