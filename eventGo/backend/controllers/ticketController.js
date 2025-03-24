const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Purchase a ticket
// @route   POST /api/tickets/purchase
// @access  Private
exports.purchaseTicket = async (req, res) => {
  try {
    const { eventId, ticketType } = req.body;
    
    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Find the selected ticket type
    const selectedTicketType = event.ticketTypes.find(
      (ticket) => ticket.name === ticketType
    );
    
    if (!selectedTicketType) {
      return res.status(404).json({
        success: false,
        error: 'Ticket type not found'
      });
    }
    
    // Check if tickets are available
    if (selectedTicketType.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'No tickets available for this type'
      });
    }
    
    // Create a new ticket
    const ticket = await Ticket.create({
      event: eventId,
      ticketType,
      owner: req.user._id,
      price: selectedTicketType.price,
      contractAddress: selectedTicketType.contractAddress || null
    });
    
    // Generate QR code for the ticket (handled by pre-save middleware)
    
    // Decrement available tickets
    selectedTicketType.availableQuantity -= 1;
    await event.save();
    
    // Return ticket info with QR code
    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all tickets for current user
// @route   GET /api/tickets/my-tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ owner: req.user._id })
      .populate({
        path: 'event',
        select: 'title date location bannerImage'
      });
    
    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: 'event',
        select: 'title date location bannerImage organizer',
        populate: {
          path: 'organizer',
          select: 'name email'
        }
      });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }
    
    // Check if user owns the ticket or is the event organizer
    if (
      ticket.owner.toString() !== req.user._id.toString() &&
      ticket.event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this ticket'
      });
    }
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Verify and use a ticket
// @route   PUT /api/tickets/:id/verify
// @access  Private (Organizers only)
exports.verifyTicket = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: 'event',
        select: 'organizer'
      });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }
    
    // Check if user is the event organizer or admin
    if (
      ticket.event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to verify this ticket'
      });
    }
    
    // Check verification code
    if (ticket.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }
    
    // Check if ticket is already used
    if (ticket.status === 'used') {
      return res.status(400).json({
        success: false,
        error: 'Ticket has already been used'
      });
    }
    
    // Update ticket status to used
    ticket.status = 'used';
    ticket.usedDate = Date.now();
    await ticket.save();
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Transfer ticket to another user
// @route   PUT /api/tickets/:id/transfer
// @access  Private
exports.transferTicket = async (req, res) => {
  try {
    const { recipientEmail, transactionHash } = req.body;
    
    // Find ticket
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }
    
    // Check if user owns the ticket
    if (ticket.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to transfer this ticket'
      });
    }
    
    // Check if ticket is transferable (not used or cancelled)
    if (ticket.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: `Ticket is ${ticket.status} and cannot be transferred`
      });
    }
    
    // Find recipient by email
    const recipient = await User.findOne({ email: recipientEmail });
    
    if (!recipient) {
      return res.status(404).json({
        success: false,
        error: 'Recipient not found. They must register first.'
      });
    }
    
    // Store transfer history
    ticket.transferHistory.push({
      fromUser: req.user._id,
      toUser: recipient._id,
      transactionHash
    });
    
    // Update owner
    const previousOwner = ticket.owner;
    ticket.owner = recipient._id;
    ticket.status = 'transferred';
    
    await ticket.save();
    
    res.status(200).json({
      success: true,
      data: {
        ticketId: ticket._id,
        previousOwner,
        newOwner: recipient._id,
        transferDate: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 