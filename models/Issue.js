// models/Issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
  issueType: {
    type: String,
    required: true,
    enum: ['Electricity', 'Water', 'Road', 'Garbage'],
  },
  description: { type: String, required: true },
  address: { type: String, required: true }, // <-- ADDED
  imageUrl: { type: String },
  status: {
    type: String,
    enum: ['Sent', 'Viewed', 'Working', 'Resolved'],
    default: 'Sent',
  },
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);