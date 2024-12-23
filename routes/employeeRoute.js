// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Employee = require('../models/Employee');
// const auth = require('../middleware/auth');


// const router = express.Router();


// router.post('/create', async (req, res) => {
//     try {
//       const { employeeId, name, position, hireDate, designation, department, phoneNumber } = req.body;
  
//       const newEmployee = new Employee({
//         employeeId,
//         name,
//         position,
//         hireDate,
//         designation,
//         department,
//         phoneNumber,
//       });
  
//       await newEmployee.save();
  
//       // Return the plain password that was generated
//       res.status(201).json({
//         success: true,
//         message: 'Employee created successfully',
//         email: newEmployee.email,
//         password: newEmployee.plainPassword,  // Return the generated password here
//         employee: newEmployee,
//       });
//     } catch (error) {
//       console.error('Error creating employee:', error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });

// // Login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       const employee = await Employee.findOne({ email });
//       if (!employee) {
//         console.log(`Employee not found for email: ${email}`);
//         return res.status(400).json({ error: 'Invalid credentials' });
//       }
  
//       // Trim password to rule out any leading or trailing spaces
//       const trimmedPassword = password.trim();
//       console.log('Provided password (plain text):', trimmedPassword);
//       console.log('Stored hashed password from DB:', employee.password);
  
//       // Compare the plain password with the hashed password
//       const isMatch = await bcrypt.compare(trimmedPassword, employee.password);
//       console.log('Password comparison result:', isMatch);  // Log the result of bcrypt.compare()
  
//       if (!isMatch) {
//         console.log('Password mismatch');
//         return res.status(400).json({ error: 'Invalid credentials' });
//       }
  
//       // If the password matches, generate a token
//       const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       return res.status(200).json({ success: true, token, employee });
//     } catch (error) {
//       console.error('Error during login:', error);
//       return res.status(500).json({ error: 'Server error' });
//     }
//   });
// // Get all employees
// router.get('/', async (req, res) => {
//     try {
//       const employees = await Employee.find();
//       res.status(200).json(employees);
//     } catch (error) {
//       res.status(500).json({ error: 'Server error' });
//     }
// });


// router.patch('/:employeeId/availability', async (req, res) => {
//   const { employeeId } = req.params;
//   const { availability } = req.body;

//   try {
//     // Find the employee by employeeId
//     const employee = await Employee.findOne({ employeeId });

//     if (!employee) {
//       return res.status(404).json({ error: 'Employee not found' });
//     }

//     // Update the availability field
//     employee.availability = availability;

//     // Save the updated employee document
//     await employee.save();

//     res.status(200).json({ success: true, message: 'Employee availability updated successfully' });
//   } catch (error) {
//     console.error('Error updating availability:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// router.get('/:employeeId', async (req, res) => {
//   const { employeeId } = req.params;

//   try {
//     // Find all interviews where the employee is available in the employerPanel
//     const interviews = await Interview.find({
//       employerPanel: {
//         $elemMatch: { employeeId: employeeId, availability: { $ne: 'Busy' } },
//       },
//     });

//     res.status(200).json(interviews);
//   } catch (error) {
//     console.error('Error fetching interviews', error);
//     res.status(500).json({ error: 'Failed to fetch interviews' });
//   }
// });



// module.exports = router;


const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { employeeId, name, position, hireDate, designation, department, phoneNumber } = req.body;

    const newEmployee = new Employee({
      employeeId,
      name,
      position,
      hireDate,
      designation,
      department,
      phoneNumber,
    });

    await newEmployee.save();

    // Return the plain password that was generated
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      email: newEmployee.email,
      password: newEmployee.plainPassword,  // Return the generated password here
      employee: newEmployee,
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      console.log(`Employee not found for email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

     // Compare the plain text password directly
     if (employee.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // If the password matches, generate a token
    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ success: true, token, employee });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});
// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update employee availability
router.patch('/:employeeId/availability', async (req, res) => {
  const { employeeId } = req.params;
  const { availability } = req.body;

  try {
    // Find the employee by employeeId
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update the availability field
    employee.availability = availability;

    // Save the updated employee document
    await employee.save();

    res.status(200).json({ success: true, message: 'Employee availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch interviews for an employee (excluding those where the employee is marked as 'Busy')
router.get('/interviews/:employeeId', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const interviews = await Interview.find({
      employerPanel: {
        $elemMatch: { employeeId: employeeId, availability: { $ne: 'Busy' } },
      },
    });

    res.status(200).json(interviews);
  } catch (error) {
    console.error('Error fetching interviews', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

// Fetch employee availability
router.get('/availability/:employeeId', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ availability: employee.availability });
  } catch (error) {
    console.error('Error fetching availability', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
