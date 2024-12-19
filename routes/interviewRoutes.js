// const express = require('express');
// const Interview = require('../models/Interview');
// const auth = require('../middleware/auth');

// const router = express.Router();

// // Get interviews for the logged-in employee
// router.get('/:employeeId', async (req, res) => {
//     const { employeeId } = req.params;
//     console.log(`Fetching interviews for employee: ${employeeId}`); // Log employeeId
    
//     try {
//       const interviews = await Interview.find({ 'employerPanel.employeeId': employeeId });
      
//       if (!interviews.length) {
//         console.log(`No interviews found for employee: ${employeeId}`);
//         return res.status(404).json({ message: 'No interviews found for this employee' });
//       }
      
//       res.status(200).json(interviews);
//     } catch (error) {
//       console.error('Error fetching interviews:', error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });
    

//   router.patch('/:interviewId/unavailable', async (req, res) => {
//     const { interviewId } = req.params;
//     const { employeeId } = req.body; // Pass employeeId in the request body
  
//     try {
//       // Use interviewId as a string field
//       const interview = await Interview.findOne({ interviewId });
//       if (!interview) {
//         return res.status(404).json({ error: 'Interview not found' });
//       }
  
//       // Update the availability of the employee in the employerPanel
//       const employeePanel = interview.employerPanel.find(emp => emp.employeeId === employeeId);
//       if (employeePanel) {
//         employeePanel.availability = 'Busy';
//       }
  
//       await interview.save();
//       res.status(200).json({ message: 'Employee marked as busy for the interview' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Failed to update employee availability' });
//     }
//   });
  
//   module.exports = router;

// routes/interviewRoutes.js

const express = require('express');
const Interview = require('../models/Interview');
const router = express.Router();

// Get interviews for a specific employee, excluding those where the employee is marked as 'Busy'
router.get('/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  
  try {
    // Fetch interviews where the employee is in the panel and not marked as 'Busy'
    const interviews = await Interview.find({
      'employerPanel.employeeId': employeeId,
      'employerPanel.availability': { $ne: 'Busy' } // Exclude interviews where employee is busy
    });
    
    res.status(200).json(interviews);
  } catch (error) {
    console.error('Error fetching interviews', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
