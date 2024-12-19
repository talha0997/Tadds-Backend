// tests/candidateRoutes.test.js
const request = require('supertest');
const express = require('express');
const candidateRoutes = require('../routes/candidateRoutes');
const Candidate = require('../models/Candidate');

// Mock the Candidate model
jest.mock('../models/Candidate');

const app = express();
app.use(express.json());
app.use('/api', candidateRoutes);

describe('Candidate Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock call history before each test
  });

  it('should fetch all candidates successfully', async () => {
    // Mock find to return a list of candidates
    const mockCandidates = [
      { _id: '1', name: 'Candidate A', position: 'Developer', experience: 3 },
      { _id: '2', name: 'Candidate B', position: 'Designer', experience: 5 },
    ];
    Candidate.find.mockResolvedValue(mockCandidates);

    const response = await request(app).get('/api/candidates');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCandidates);
    expect(Candidate.find).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching candidates', async () => {
    // Mock find to throw an error
    Candidate.find.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/candidates');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to fetch candidates');
    expect(Candidate.find).toHaveBeenCalledTimes(1);
  });
});
