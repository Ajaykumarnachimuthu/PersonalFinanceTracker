const express = require('express');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Add expense
router.post('/', [
  auth,
  body('item').trim().isLength({ min: 1 }).withMessage('Item name is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('categoryId').isMongoId().withMessage('Valid category ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: errors.array()[0].msg
      });
    }
    
    const { item, amount, categoryId } = req.body;
    
    // Verify category belongs to user
    const category = await Category.findOne({ _id: categoryId, user: req.user.id });
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found'
      });
    }
    
    const expense = await Expense.create({
      item,
      amount,
      category: categoryId
    });
    
    res.status(201).json({
      status: 'success',
      expense
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    // Verify expense belongs to user through category
    const expense = await Expense.findById(req.params.id)
      .populate('category');
    
    if (!expense || expense.category.user.toString() !== req.user.id) {
      return res.status(404).json({
        status: 'fail',
        message: 'Expense not found'
      });
    }
    
    await Expense.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;