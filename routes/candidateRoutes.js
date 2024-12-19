const express = require('express');
const Candidate = require('../models/Candidate');
const router = express.Router();

// Endpoint to get all candidates
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

module.exports = router;
