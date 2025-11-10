document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reviewForm');
  const reviewList = document.getElementById('reviewList');
  const summaryCard = document.getElementById('summaryCard');
  const summaryText = document.getElementById('reviewSummary');

  const getAllReviews = () => {
    const reviewElements = reviewList.querySelectorAll('.review-text');
    return Array.from(reviewElements).map(el => el.textContent.trim());
  };

  const updateSummary = async () => {
    const reviews = getAllReviews();
    if (reviews.length === 0) {
      summaryText.textContent = 'No summary yet.';
      summaryCard.style.display = 'none';
      return;
    }

    summaryCard.style.display = 'block';
    summaryText.textContent = 'Summarizing...';

    try {
      const res = await fetch('/api/summarize-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews })
      });

      const data = await res.json();
      summaryText.textContent = data.summary;
    } catch (err) {
      summaryText.textContent = 'Failed to summarize reviews.';
      console.error(err);
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const textarea = form.querySelector('textarea[name="review"]');
    const reviewText = textarea.value.trim();
    if (!reviewText) return;

    // Add review to the list
    const reviewCard = document.createElement('div');
    reviewCard.className = 'card mb-2';
    reviewCard.innerHTML = `
      <div class="card-body">
        <p class="card-text review-text">${reviewText}</p>
      </div>
    `;
    reviewList.appendChild(reviewCard);

    textarea.value = '';
    updateSummary();
  });
});
