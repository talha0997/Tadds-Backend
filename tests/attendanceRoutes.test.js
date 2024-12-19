// tests/attendanceRoutes.test.js
const request = require('supertest');
const express = require('express');
const attendanceRoutes = require('../routes/attendanceRoutes');
const Attendance = require('../models/Attendance');

// Mock the Attendance model
jest.mock('../models/Attendance');

const app = express();
app.use(express.json());
app.use('/api/attendance', attendanceRoutes);

describe('Attendance Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock call history before each test
  });

  it('should mark check-in successfully when there is no existing record', async () => {
    // Mock findOne to return null, simulating no existing attendance record
    Attendance.findOne.mockResolvedValue(null);

    // Mock save to simulate saving the new attendance record
    Attendance.prototype.save = jest.fn().mockResolvedValue({
      _id: 'mocked_id',
      employeeId: '12345',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:00',
      status: 'Present',
    });

    const response = await request(app)
      .post('/api/attendance/mark')
      .send({
        employeeId: '12345',
        checkInTime: '09:00',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Successfully marked Check In.');
    expect(Attendance.findOne).toHaveBeenCalledTimes(1);
    expect(Attendance.prototype.save).toHaveBeenCalledTimes(1);
  });

  it('should mark check-out successfully when an attendance record exists', async () => {
    // Mock findOne to return an existing attendance record with a mocked save function
    const mockAttendance = {
      _id: 'mocked_id',
      employeeId: '12345',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:00',
      checkOutTime: null,
      status: 'Present',
      save: jest.fn().mockResolvedValue(true), // Mock save for this instance
    };

    Attendance.findOne.mockResolvedValue(mockAttendance);

    const response = await request(app)
      .post('/api/attendance/mark')
      .send({
        employeeId: '12345',
        checkOutTime: '17:00',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Successfully marked Check Out.');
    expect(Attendance.findOne).toHaveBeenCalledTimes(1);
    expect(mockAttendance.save).toHaveBeenCalledTimes(1); // Check save was called on the instance
  });

  it('should handle errors when marking attendance', async () => {
    // Mock findOne to throw an error
    Attendance.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/api/attendance/mark')
      .send({
        employeeId: '12345',
        checkInTime: '09:00',
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to mark attendance');
    expect(Attendance.findOne).toHaveBeenCalledTimes(1);
  });
});
