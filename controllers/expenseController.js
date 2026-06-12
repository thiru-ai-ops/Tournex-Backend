const Expense = require('../models/Expense');

/**
 * @desc    Get user expenses
 * @route   GET /api/expenses
 * @access  Private
 */
const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: expenses.length,
      expenses: expenses.map(e => ({
        id: e._id,
        description: e.description,
        amount: e.amount,
        paidBy: e.paidBy,
        splitWith: e.splitWith,
        category: e.category,
        date: e.date
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new expense
 * @route   POST /api/expenses
 * @access  Private
 */
const createExpense = async (req, res, next) => {
  try {
    const { description, amount, paidBy, splitWith, category, date } = req.body;

    if (!description || amount === undefined || !paidBy || !category || !date) {
      return res.status(400).json({ success: false, error: 'Please provide all required expense fields' });
    }

    if (amount < 0) {
      return res.status(400).json({ success: false, error: 'Expense amount cannot be negative' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      description,
      amount: Number(amount),
      paidBy,
      splitWith: splitWith || [],
      category,
      date
    });

    res.status(201).json({
      success: true,
      expense: {
        id: expense._id,
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy,
        splitWith: expense.splitWith,
        category: expense.category,
        date: expense.date
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    // Verify ownership
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this expense' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Expense removed successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all user expenses
 * @route   DELETE /api/expenses/all/clear
 * @access  Private
 */
const clearExpenses = async (req, res, next) => {
  try {
    await Expense.deleteMany({ user: req.user._id });
    res.json({ success: true, message: 'All user expenses cleared successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
  clearExpenses
};
