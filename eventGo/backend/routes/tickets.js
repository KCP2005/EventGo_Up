const express = require('express');
const router = express.Router();

// Mock data
const tickets = [
  {
    id: '1',
    eventId: '1',
    userId: '123456',
    purchaseDate: '2023-10-01T14:30:00Z',
    price: 299,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-1',
    tokenId: '0x7a23b68a',
    isVerified: false,
    seat: 'General Admission'
  },
  {
    id: '2',
    eventId: '2',
    userId: '123456',
    purchaseDate: '2023-09-15T11:20:00Z',
    price: 49.99,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-2',
    tokenId: '0x3bc45d2e',
    isVerified: false,
    seat: 'VIP'
  }
];

// Purchase a ticket
router.post('/purchase', (req, res) => {
  const { eventId, seat } = req.body;
  
  const newTicket = {
    id: (tickets.length + 1).toString(),
    eventId,
    userId: '123456', // Mock user ID
    purchaseDate: new Date().toISOString(),
    price: 99.99,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-${tickets.length + 1}`,
    tokenId: `0x${Math.floor(Math.random() * 16777215).toString(16)}`,
    isVerified: false,
    seat: seat || 'General Admission'
  };
  
  tickets.push(newTicket);
  
  res.status(201).json({
    success: true,
    message: 'Ticket purchased successfully',
    data: newTicket
  });
});

// Get user's tickets
router.get('/my-tickets', (req, res) => {
  res.json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});

// Get ticket by ID
router.get('/:id', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }
  
  res.json({
    success: true,
    data: ticket
  });
});

// Verify a ticket
router.put('/:id/verify', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }
  
  ticket.isVerified = true;
  
  res.json({
    success: true,
    message: 'Ticket verified successfully',
    data: ticket
  });
});

// Transfer ticket to another user
router.put('/:id/transfer', (req, res) => {
  const { recipientEmail } = req.body;
  const ticket = tickets.find(t => t.id === req.params.id);
  
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }
  
  if (ticket.isVerified) {
    return res.status(400).json({
      success: false,
      message: 'Verified tickets cannot be transferred'
    });
  }
  
  // Mock transfer logic
  ticket.userId = 'new-user-id';
  
  res.json({
    success: true,
    message: `Ticket transferred to ${recipientEmail} successfully`,
    data: ticket
  });
});

module.exports = router; 