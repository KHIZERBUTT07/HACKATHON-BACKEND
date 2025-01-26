const mongoose = require('mongoose');
require('dotenv').config();

async function cleanupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the users collection
    const collection = mongoose.connection.collection('users');

    // Drop all indexes
    await collection.dropIndexes();
    console.log('Dropped all indexes');

    // Create only the indexes we want
    await collection.createIndex({ cnic: 1 }, { unique: true });
    console.log('Created new CNIC index');

    // Remove email and password fields from all documents
    await collection.updateMany(
      {},
      { 
        $unset: { 
          email: "",
          password: "" 
        } 
      }
    );
    console.log('Removed email and password fields from all documents');

    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

cleanupDatabase(); 