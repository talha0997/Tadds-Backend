// routes/evaluationRoutes.js
const express = require('express');
const Evaluation = require('../models/Evaluation');
const router = express.Router();

router.post('/', async (req, res) => {
  const {
    candidateId,
    evaluatorId,
    technicalSkills,
    problemSolving,
    behavioralFit,
    culturalFit,
    communicationSkills,
    adaptability,
    situationalJudgment,
    motivationInterest,
    overallImpression,
    comments,
    finalDecision,
  } = req.body;

  try {
    const evaluation = new Evaluation({
      candidateId, // No conversion to ObjectId
      evaluatorId, // No conversion to ObjectId
      technicalSkills,
      problemSolving,
      behavioralFit,
      culturalFit,
      communicationSkills,
      adaptability,
      situationalJudgment,
      motivationInterest,
      overallImpression,
      comments,
      finalDecision,
    });

    await evaluation.save();
    res.status(201).json({ message: 'Evaluation submitted successfully' });
  } catch (error) {
    console.error('Error saving evaluation:', error);
    res.status(500).json({ error: 'Failed to submit evaluation' });
  }
});

module.exports = router;

// routes/evaluationRoutes.js

// const express = require('express');
// const mongoose = require('mongoose');
// const Evaluation = require('../models/Evaluation');
// const PDFDocument = require('pdfkit');
// const router = express.Router();

// // Endpoint to submit evaluation
// router.post('/', async (req, res) => {
//   const { candidateId, technicalSkills, problemSolving, behavioralFit, culturalFit, communicationSkills, adaptability, situationalJudgment, motivationInterest, overallImpression, comments, finalDecision, evaluatorId } = req.body;

//   try {
//     // Create a new evaluation
//     const evaluation = new Evaluation({
//       candidateId,
//       technicalSkills,
//       problemSolving,
//       behavioralFit,
//       culturalFit,
//       communicationSkills,
//       adaptability,
//       situationalJudgment,
//       motivationInterest,
//       overallImpression,
//       comments,
//       finalDecision,
//       evaluatorId,
//     });

//     await evaluation.save();
//     res.status(201).json({ message: 'Evaluation submitted successfully', evaluationId: evaluation._id });
//   } catch (error) {
//     console.error('Error saving evaluation:', error);
//     res.status(500).json({ error: 'Failed to submit evaluation' });
//   }
// });

// // Endpoint to download evaluation as PDF
// router.get('/download/:id', async (req, res) => {
//   try {
//     const evaluation = await Evaluation.findById(req.params.id);
//     if (!evaluation) return res.status(404).json({ error: 'Evaluation not found' });

//     // Setup PDF headers
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=evaluation.pdf');

//     const doc = new PDFDocument();
//     doc.pipe(res);

//     // Add content to the PDF
//     doc.fontSize(20).text(`Candidate Evaluation Report`, { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Candidate ID: ${evaluation.candidateId}`);
//     doc.text(`Evaluator ID: ${evaluation.evaluatorId}`);
//     doc.text(`Technical Skills: ${evaluation.technicalSkills}`);
//     doc.text(`Problem Solving: ${evaluation.problemSolving}`);
//     doc.text(`Behavioral Fit: ${evaluation.behavioralFit}`);
//     doc.text(`Cultural Fit: ${evaluation.culturalFit}`);
//     doc.text(`Communication Skills: ${evaluation.communicationSkills}`);
//     doc.text(`Adaptability: ${evaluation.adaptability}`);
//     doc.text(`Situational Judgment: ${evaluation.situationalJudgment}`);
//     doc.text(`Motivation & Interest: ${evaluation.motivationInterest}`);
//     doc.text(`Overall Impression: ${evaluation.overallImpression}`);
//     doc.moveDown();
//     doc.text(`Comments: ${evaluation.comments}`);
//     doc.text(`Final Decision: ${evaluation.finalDecision}`);

//     doc.end();
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     res.status(500).json({ error: 'Failed to generate PDF' });
//   }
// });

// module.exports = router;

