// const mongoose = require('mongoose');

// const InterviewSchema = new mongoose.Schema({
//   candidateId: { type: String, required: true }, // Store candidateId like C001, C002
//   interviewId: { type: String, required: true },
//   position: { type: String, required: true },
//   date: { type: Date, required: true },
//   time: { type: String, required: true },
//   employerPanel: [
//     {
//       employeeId: { type: String, required: true },
//       name: { type: String, required: true },
//       position: { type: String, required: true },
//     },
//   ],
// });

// module.exports = mongoose.model('Interview', InterviewSchema);


const mongoose = require('mongoose');

// Define the employer panel schema
const EmployerSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  position: String,
  availability: { type: String, default: 'Available' }
});

// Define the interview schema
const InterviewSchema = new mongoose.Schema({
  interviewId: { type: String, unique: true }, // Custom interview ID field
  candidateId: String,
  position: String,
  date: Date,
  time: String,
  employerPanel: [EmployerSchema]
});

module.exports = mongoose.model('Interview', InterviewSchema);
