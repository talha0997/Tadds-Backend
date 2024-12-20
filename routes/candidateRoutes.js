// const express = require('express');
// const Candidate = require('../models/Candidate');
// const router = express.Router();

// // Endpoint to get all candidates
// router.get('/candidates', async (req, res) => {
//   try {
//     const candidates = await Candidate.find();
//     res.status(200).json(candidates);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch candidates' });
//   }
// });

// module.exports = router;


const express = require('express');
const Candidate = require('../models/Candidate');
const router = express.Router();

// Endpoint to get candidates with optional search query
router.get('/candidates', async (req, res) => {
  const { search } = req.query; // Retrieve the search query from the request

  try {
    let query = {};
    
    // If search query exists, add filtering logic
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search using regex
    }

    const candidates = await Candidate.find(query); // Fetch candidates based on query
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

module.exports = router;

