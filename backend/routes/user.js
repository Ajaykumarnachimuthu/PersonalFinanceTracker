const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Update global limit
router.put('/limit', [
  auth,
  body('globalLimit').isFloat({ min: 0 }).withMessage('Global limit must be a positive number')
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
    
    const { globalLimit } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { globalLimit },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;