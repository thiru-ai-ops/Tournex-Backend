const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Expense description is required'],
    trim: true,
    maxlength: [256, 'Expense description cannot exceed 256 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Expense amount cannot be negative']
  },
  paidBy: {
    type: String,
    required: [true, 'Paid by member name is required'],
    trim: true
  },
  splitWith: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    enum: ['Stay', 'Food', 'Activity', 'Transit', 'Shopping', 'Other'],
    required: [true, 'Expense category is required']
  },
  date: {
    type: String,
    required: [true, 'Expense date is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
