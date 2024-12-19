const express = require('express');
const Attendance = require('../models/Attendance');
const router = express.Router();


router.post('/mark', async (req, res) => {
    const { employeeId, checkInTime, checkOutTime } = req.body;
  
    try {
      // Get today's date in YYYY-MM-DD format
      const todayDate = new Date().toISOString().split('T')[0];
  
      // Find today's attendance record for the employee
      let attendance = await Attendance.findOne({
        employeeId,
        date: todayDate,
      });
  
      // If no attendance record exists, create a new one with check-in time
      if (!attendance) {
        attendance = new Attendance({
          employeeId,
          date: todayDate,
          checkInTime: checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Present', // Default status for new check-ins
        });
      } else {
        // If a check-out time is provided, update it without changing the check-in time
        if (checkOutTime) {
          attendance.checkOutTime = checkOutTime;
        } else if (checkInTime) {
          // If only check-in time is provided (for some reason), update it
          attendance.checkInTime = checkInTime;
        }
      }
  
      await attendance.save();
      res.status(200).json({ message: `Successfully marked ${checkInTime ? 'Check In' : 'Check Out'}.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to mark attendance' });
    }
  });
  
module.exports = router;
