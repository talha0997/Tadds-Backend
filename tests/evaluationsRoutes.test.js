// tests/evaluationRoutes.test.js
const request = require('supertest');
const express = require('express');
const evaluationRoutes = require('../routes/evaluationRoutes');
const Evaluation = require('../models/Evaluation');

// Mock the Evaluation model
jest.mock('../models/Evaluation');

const app = express();
app.use(express.json());
app.use('/api/evaluations', evaluationRoutes);

describe('Evaluation Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock call history before each test
  });

  describe('POST /api/evaluations', () => {
    it('should submit a new evaluation successfully', async () => {
      // Mock save to simulate successful save
      Evaluation.prototype.save = jest.fn().mockResolvedValue({
        candidateId: 'candidate123',
        evaluatorId: 'evaluator123',
        technicalSkills: 4,
        problemSolving: 3,
        behavioralFit: 5,
        culturalFit: 4,
        communicationSkills: 5,
        adaptability: 4,
        situationalJudgment: 3,
        motivationInterest: 5,
        overallImpression: 4,
        comments: 'Great candidate with potential.',
        finalDecision: 'Selected',
      });

      const response = await request(app)
        .post('/api/evaluations')
        .send({
          candidateId: 'candidate123',
          evaluatorId: 'evaluator123',
          technicalSkills: 4,
          problemSolving: 3,
          behavioralFit: 5,
          culturalFit: 4,
          communicationSkills: 5,
          adaptability: 4,
          situationalJudgment: 3,
          motivationInterest: 5,
          overallImpression: 4,
          comments: 'Great candidate with potential.',
          finalDecision: 'Selected',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Evaluation submitted successfully');
      expect(Evaluation.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during evaluation submission', async () => {
      // Mock save to throw an error
      Evaluation.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/evaluations')
        .send({
          candidateId: 'candidate123',
          evaluatorId: 'evaluator123',
          technicalSkills: 4,
          problemSolving: 3,
          behavioralFit: 5,
          culturalFit: 4,
          communicationSkills: 5,
          adaptability: 4,
          situationalJudgment: 3,
          motivationInterest: 5,
          overallImpression: 4,
          comments: 'Great candidate with potential.',
          finalDecision: 'Selected',
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to submit evaluation');
      expect(Evaluation.prototype.save).toHaveBeenCalledTimes(1);
    });
  });
});
