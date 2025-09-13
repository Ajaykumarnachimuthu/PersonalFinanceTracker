const express = require('express');
const Category = require('../models/Category');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all categories for user
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    
    // Calculate totals for each category
    const categoriesWithTotals = await Promise.all(
      categories.map(async (category) => {
        const expenses = await Expense.find({ category: category._id });
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const pct = category.limit > 0 ? Math.min(100, (total / category.limit) * 100) : 0;
        
        return {
          ...category.toObject(),
          total,
          pct,
          expenses
        };
      })
    );
    
    res.status(200).json(categoriesWithTotals);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Create new category
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 1 }).withMessage('Category name is required')
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
    
    const { name } = req.body;
    
    // Generate color based on name
    const palette = [
      "#a855f7","#b5179e","#f72585","#d946ef","#c026d3",
      "#9333ea","#a21caf","#cc33ff","#bb29e0","#e056fd"
    ];
    const idx = Math.abs(hashCode(name)) % palette.length;
    const color = palette[idx];
    
    const category = await Category.create({
      name,
      color,
      user: req.user.id
    });
    
    res.status(201).json({
      status: 'success',
      category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Category with this name already exists'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Update category limit
router.put('/:id/limit', [
  auth,
  body('limit').isFloat({ min: 0 }).withMessage('Limit must be a positive number')
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
    
    const { limit } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { limit },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      category
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    // Delete category and all its expenses
    const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found'
      });
    }
    
    await Promise.all([
      Expense.deleteMany({ category: category._id }),
      Category.deleteOne({ _id: category._id })
    ]);
    
    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Helper function for string hashing
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

module.exports = router;