const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connectat correctament');
  } catch (error) {
    console.error('Error connectant MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;