// tests/employeeRoutes.test.js
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const employeeRoutes = require('../routes/employeeRoutes');
const Employee = require('../models/Employee');
const Interview = require('../models/Interview');

// Mock dependencies
jest.mock('../models/Employee');
jest.mock('../models/Interview');

const app = express();
app.use(express.json());
app.use('/api/employees', employeeRoutes);

describe('Employee Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/employees/create', () => {
    it('should create a new employee successfully', async () => {
      const mockEmployee = {
        _id: 'mocked_id',
        employeeId: '12345',
        name: 'John Doe',
        position: 'Developer',
        email: 'johndoe@example.com',
        plainPassword: 'password123',
      };

      Employee.prototype.save = jest.fn().mockResolvedValue(mockEmployee);

      const response = await request(app)
        .post('/api/employees/create')
        .send({
          employeeId: '12345',
          name: 'John Doe',
          position: 'Developer',
          hireDate: '2022-01-01',
          designation: 'Developer',
          department: 'Engineering',
          phoneNumber: '1234567890',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Employee created successfully');
      expect(response.body).toHaveProperty('password', 'password123');
      expect(Employee.prototype.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/employees/login', () => {
    it('should log in an existing employee successfully', async () => {
      const mockEmployee = {
        _id: 'mocked_id',
        email: 'johndoe@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      Employee.findOne = jest.fn().mockResolvedValue(mockEmployee);
      jwt.sign = jest.fn().mockReturnValue('mocked_jwt_token');

      const response = await request(app)
        .post('/api/employees/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token', 'mocked_jwt_token');
      expect(Employee.findOne).toHaveBeenCalledWith({ email: 'johndoe@example.com' });
      expect(bcrypt.compare).toBeCalled();
    });
  });

  describe('GET /api/employees', () => {
    it('should fetch all employees', async () => {
      const mockEmployees = [
        { _id: '1', name: 'Employee 1', position: 'Position 1' },
        { _id: '2', name: 'Employee 2', position: 'Position 2' },
      ];
      Employee.find.mockResolvedValue(mockEmployees);

      const response = await request(app).get('/api/employees');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEmployees);
      expect(Employee.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /api/employees/:employeeId/availability', () => {
    it('should update the availability of an employee', async () => {
      const mockEmployee = {
        _id: 'mocked_id',
        employeeId: '12345',
        availability: 'Available',
        save: jest.fn().mockResolvedValue(true),
      };

      Employee.findOne = jest.fn().mockResolvedValue(mockEmployee);

      const response = await request(app)
        .patch('/api/employees/12345/availability')
        .send({ availability: 'Busy' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Employee availability updated successfully');
      expect(Employee.findOne).toHaveBeenCalledWith({ employeeId: '12345' });
      expect(mockEmployee.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/employees/:employeeId', () => {
    it('should fetch interviews for an employee based on availability', async () => {
      const mockInterviews = [
        { _id: '1', employerPanel: [{ employeeId: '12345', availability: 'Available' }] },
        { _id: '2', employerPanel: [{ employeeId: '12345', availability: 'Available' }] },
      ];

      Interview.find.mockResolvedValue(mockInterviews);

      const response = await request(app).get('/api/employees/12345');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockInterviews);
      expect(Interview.find).toHaveBeenCalledWith({
        employerPanel: {
          $elemMatch: { employeeId: '12345', availability: { $ne: 'Busy' } },
        },
      });
    });
  });
});
