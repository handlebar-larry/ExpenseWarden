const mongoose = require('mongoose');

// Transaction sub-schema
const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  info: {
    type: String,
    trim: true
  }
});

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  expenses: [transactionSchema],
  incomes: [transactionSchema]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
