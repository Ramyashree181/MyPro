const express = require('express');
const router = express.Router();
const summarizeReviews = require('../utils/summarizer');

router.post('/api/summarize-reviews', async (req, res) => {
  try {
    const { reviews } = req.body;

    // 🔍 Debug logs to help diagnose the error
    console.log('📥 Received reviews:', reviews);
    console.log('📦 typeof reviews:', typeof reviews);
    console.log('🧪 Array.isArray:', Array.isArray(reviews));
    console.log('🔍 Object.keys:', Object.keys(reviews));

    const summary = await summarizeReviews(reviews);
    res.json({ summary });
  } catch (err) {
    console.error('❌ Summarization failed:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to summarize reviews' });
  }
});

module.exports = router;
