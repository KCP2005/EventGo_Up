const express = require('express');
const router = express.Router();

// Mock data
const events = [
  {
    id: '1',
    title: 'Blockchain Conference 2023',
    description: 'A conference about the latest in blockchain technology',
    date: '2023-12-15T09:00:00Z',
    location: 'San Francisco, CA',
    price: 299,
    image: 'https://picsum.photos/800/500',
    organizer: 'Blockchain Foundation',
    tickets: {
      total: 500,
      available: 350
    }
  },
  {
    id: '2',
    title: 'NFT Art Exhibition',
    description: 'Explore the world of digital art and NFTs',
    date: '2023-11-20T10:00:00Z',
    location: 'New York, NY',
    price: 49.99,
    image: 'https://picsum.photos/800/500',
    organizer: 'Digital Art Collective',
    tickets: {
      total: 200,
      available: 75
    }
  }
];

// Get all events
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: events.length,
    data: events
  });
});

// Get single event
router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }
  
  res.json({
    success: true,
    data: event
  });
});

// Create event
router.post('/', (req, res) => {
  const newEvent = {
    id: (events.length + 1).toString(),
    ...req.body,
    tickets: {
      total: req.body.tickets?.total || 100,
      available: req.body.tickets?.total || 100
    }
  };
  
  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: newEvent
  });
});

// Update event
router.put('/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }
  
  const updatedEvent = {
    ...event,
    ...req.body
  };
  
  res.json({
    success: true,
    message: 'Event updated successfully',
    data: updatedEvent
  });
});

// Delete event
router.delete('/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Event deleted successfully'
  });
});

module.exports = router; 