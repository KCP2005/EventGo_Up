const express = require('express');
const router = express.Router();

// Mock auth response for testing
router.post('/register', (req, res) => {
  res.json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: '123456',
        name: 'Test User',
        email: req.body.email,
        role: 'user'
      }
    }
  });
});

router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    token: 'mock-jwt-token',
    data: {
      user: {
        id: '123456',
        name: 'Test User',
        email: req.body.email,
        role: 'user'
      }
    }
  });
});

router.get('/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: '123456',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }
    }
  });
});

router.put('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: '123456',
        name: req.body.name || 'Updated User',
        email: req.body.email || 'test@example.com',
        role: 'user'
      }
    }
  });
});

module.exports = router; 