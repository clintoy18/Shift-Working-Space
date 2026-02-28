import mongoose from 'mongoose';

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

let mongoConnected = false;

beforeAll(async () => {
  // Connect to test MongoDB
  const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/shift-test';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    mongoConnected = true;
  } catch (error) {
    console.warn('⚠️  MongoDB not available - running unit tests only');
    mongoConnected = false;
  }
}, 15000); // Increase timeout for connection attempts

afterAll(async () => {
  if (mongoConnected) {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Failed to disconnect from test database:', error);
    }
  }
});

afterEach(async () => {
  // Clear all collections after each test
  if (mongoConnected) {
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    } catch (error) {
      // Ignore errors if not connected
    }
  }
});
