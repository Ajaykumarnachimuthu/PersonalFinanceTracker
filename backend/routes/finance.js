const express = require('express');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Get financial summary
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total income
    const incomeResult = await Income.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
    
    // Get total expenses by category
    const expenseResult = await Expense.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      { $match: { 'categoryInfo.user': new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;
    
    // Get global limit from user
    const user = await User.findById(userId);
    const globalLimit = user.globalLimit || 0;
    const globalPct = globalLimit > 0 ? Math.min(100, (totalExpense / globalLimit) * 100) : 0;
    
    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      globalLimit,
      globalPct
    });
  } catch (error) {
    console.error('Error in finance summary:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Add income
router.post('/income', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const income = await Income.create({
      amount,
      user: req.user.id
    });
    
    res.status(201).json({
      status: 'success',
      income
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Reset all data
router.post('/reset', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all categories for this user
    const categories = await Category.find({ user: userId });
    const categoryIds = categories.map(cat => cat._id);
    
    // Delete all related data
    await Promise.all([
      Income.deleteMany({ user: userId }),
      Expense.deleteMany({ category: { $in: categoryIds } }),
      Category.deleteMany({ user: userId })
    ]);
    
    // Reset global limit
    await User.findByIdAndUpdate(userId, { globalLimit: 0 });
    
    res.status(200).json({
      status: 'success',
      message: 'All data has been reset'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;