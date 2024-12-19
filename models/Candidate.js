const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  candidateId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  isShortlisted: { type: Boolean, default: false },
  experience: { type: Number, required: true },  // Number of years of experience
  skills: { type: [String], required: true },    // Array of skills
  education: { type: String, required: true },
  resume: { type: String },                      // URL or path to the resume file
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
