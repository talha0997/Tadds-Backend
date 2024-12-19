// tests/interviewRoutes.test.js
const request = require('supertest');
const express = require('express');
const interviewRoutes = require('../routes/interviewRoutes');
const Interview = require('../models/Interview');

// Mock the Interview model
jest.mock('../models/Interview');

const app = express();
app.use(express.json());
app.use('/api/interviews', interviewRoutes);

describe('Interview Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock call history before each test
  });

  describe('GET /api/interviews/:employeeId', () => {
    it('should return interviews for a specific employee excluding those marked as "Busy"', async () => {
      const mockEmployeeId = 'employee123';

      // Mock interviews to be returned by the database
      Interview.find = jest.fn().mockResolvedValue([
        {
          _id: 'interview1',
          date: '2024-11-04',
          position: 'Software Engineer',
          employerPanel: [
            { employeeId: mockEmployeeId, availability: 'Available' },
            { employeeId: 'otherEmployee', availability: 'Busy' },
          ],
        },
        {
          _id: 'interview2',
          date: '2024-11-05',
          position: 'Data Analyst',
          employerPanel: [
            { employeeId: mockEmployeeId, availability: 'Available' },
          ],
        },
      ]);

      const response = await request(app).get(`/api/interviews/${mockEmployeeId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          _id: 'interview1',
          date: '2024-11-04',
          position: 'Software Engineer',
          employerPanel: [
            { employeeId: mockEmployeeId, availability: 'Available' },
            { employeeId: 'otherEmployee', availability: 'Busy' },
          ],
        },
        {
          _id: 'interview2',
          date: '2024-11-05',
          position: 'Data Analyst',
          employerPanel: [
            { employeeId: mockEmployeeId, availability: 'Available' },
          ],
        },
      ]);
      expect(Interview.find).toHaveBeenCalledTimes(1);
      expect(Interview.find).toHaveBeenCalledWith({
        'employerPanel.employeeId': mockEmployeeId,
        'employerPanel.availability': { $ne: 'Busy' },
      });
    });

    it('should handle errors when fetching interviews', async () => {
      const mockEmployeeId = 'employee123';

      // Mock Interview.find to throw an error
      Interview.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get(`/api/interviews/${mockEmployeeId}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Server error');
      expect(Interview.find).toHaveBeenCalledTimes(1);
    });
  });
});
