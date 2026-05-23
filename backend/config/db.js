const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDB = false;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn(`[WARNING] MongoDB service is offline. Falling back to Local JSON File Storage database mock!`);
    global.useMockDB = true;
  }
};

module.exports = connectDB;
