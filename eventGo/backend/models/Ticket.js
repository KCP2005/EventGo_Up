const mongoose = require('mongoose');
const qrcode = require('qrcode');
const crypto = require('crypto');

const ticketSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  ownerAddress: {
    type: String,
    required: true
  },
  tokenId: {
    type: String,
    unique: true,
    sparse: true
  },
  contractAddress: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'used', 'transferred', 'refunded'],
    default: 'active'
  },
  qrCode: {
    type: String
  },
  transferHistory: [{
    fromAddress: String,
    toAddress: String,
    date: Date,
    transactionHash: String
  }],
  usedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to generate QR code
ticketSchema.methods.generateQR = async function () {
  // Create data for QR code (include ticket ID and verification data)
  const qrData = JSON.stringify({
    ticketId: this._id,
    eventId: this.eventId,
    ownerAddress: this.ownerAddress,
    tokenId: this.tokenId,
    timestamp: Date.now()
  });
  
  // Generate QR code as base64 string
  try {
    this.qrCode = await qrcode.toDataURL(qrData);
    return this.qrCode;
  } catch (err) {
    throw new Error('QR code generation failed');
  }
};

// Pre-save hook to generate QR code
ticketSchema.pre('save', async function(next) {
  if (!this.qrCode) {
    await this.generateQR();
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema); 