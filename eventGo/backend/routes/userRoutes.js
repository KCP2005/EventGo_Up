const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user by wallet address
router.get('/wallet/:address', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.address });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user with wallet address
router.post('/', async (req, res) => {
  try {
    const { username, walletAddress, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { walletAddress }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this username or wallet address already exists' 
      });
    }

    const user = new User({
      username,
      walletAddress,
      role: role || 'user'
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user role
router.patch('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 