const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const employeeRoute = require('./routes/employeeRoute');
const interviewRoutes = require('./routes/interviewRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const candidateRoutes = require('./routes/candidateRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // tls: true,
  // tlsInsecure: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('MongoDB connection error:', error.message);
});

app.use('/api/employees', employeeRoute);
app.use('/api/interviews', interviewRoutes);
app.use('/api/attendance', attendanceRoutes)
app.use('/api', candidateRoutes);
app.use('/api/evaluations', evaluationRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
