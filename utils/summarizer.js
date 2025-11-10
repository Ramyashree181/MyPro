const { CohereClient } = require('cohere-ai');
require('dotenv').config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

async function summarizeReviews(reviews) {
  if (!Array.isArray(reviews)) {
    console.log('❌ reviews is not an array:', reviews);
    throw new Error('Expected reviews to be an array of strings');
  }

  const inputText = reviews.join('\n');

  const response = await cohere.chat({
    message: `Summarize the following reviews in a short paragraph:\n\n${inputText}`,
    temperature: 0.3, // ✅ no model specified
  });

  return response.text;
}

module.exports = summarizeReviews;
