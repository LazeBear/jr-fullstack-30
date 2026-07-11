const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost/movies');
  } catch (e) {
    process.exit(1);
  }
};

module.exports = connectDB;
