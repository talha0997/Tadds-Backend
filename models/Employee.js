// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const EmployeeSchema = new mongoose.Schema({
//   employeeId: String,
//   name: String,
//   position: String,
//   availability: {
//     type: String,
//     enum: ['Available', 'Busy', 'On Leave'],
//     default: 'Available',
//   },
//   hireDate: Date,
//   email: String,
//   password: String, // Hashed password
//   designation: String, // New field
//   department: String,  // New field
//   phoneNumber: String, // New field
// });

// // Hash the password before saving the employee
// EmployeeSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

// module.exports = mongoose.model('Employee', EmployeeSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Function to generate a random password
function generateRandomPassword() {
  const length = 8;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  position: String,
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'On Leave'],
    default: 'Available',
  },
  hireDate: Date,
  email: String,
  password: String, // Hashed password
  designation: String,
  department: String,
  phoneNumber: String,
});

// Pre-save hook to generate email and hash password before saving
EmployeeSchema.pre('save', async function (next) {
  // Generate email based on employeeId and name (modify as needed)
  if (!this.email) {
    this.email = `${this.employeeId}@gmail.com`;  // Customize the domain as needed
  }

  // Generate a random password if it doesn't already exist
  if (!this.password) {
    const generatedPassword = generateRandomPassword();
    console.log(`Generated password: ${generatedPassword}`);  // Debugging
    this.plainPassword = generatedPassword;  // Store it in a non-persistent field to return later
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(generatedPassword, salt);
  }

  next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);
