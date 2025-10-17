// MongoDB Connection Test Script
// This script tests the MongoDB Atlas connection

const { MongoClient } = require('mongodb');

// MongoDB Atlas connection string with SSL options
const uri = 'mongodb+srv://mushfiqurmoonbd_db_user:OE8mOBbxeISyYQUi@cluster0.hr3dx7z.mongodb.net/cryptoquiz?retryWrites=true&w=majority&appName=Cluster0&ssl=true&authSource=admin';

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = client.db('cryptoquiz');
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test user collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log('👥 Total users in database:', userCount);
    
    // Test quiz collection
    const quizCollection = db.collection('quizzes');
    const quizCount = await quizCollection.countDocuments();
    console.log('❓ Total quizzes in database:', quizCount);
    
    // Test tournaments collection
    const tournamentsCollection = db.collection('tournaments');
    const tournamentCount = await tournamentsCollection.countDocuments();
    console.log('🏆 Total tournaments in database:', tournamentCount);
    
    // Test transactions collection
    const transactionsCollection = db.collection('transactions');
    const transactionCount = await transactionsCollection.countDocuments();
    console.log('💰 Total transactions in database:', transactionCount);
    
    console.log('🎉 MongoDB Atlas connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB Atlas:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('🔌 Connection closed');
  }
}

// Run the test
testConnection();
