(() => {
  'use strict';

  // ✅ Bootstrap validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // ✅ AI Review Summarizer
  document.addEventListener('DOMContentLoaded', () => {
    const summarizeBtn = document.getElementById('summarizeBtn');
    if (!summarizeBtn) return;

    summarizeBtn.addEventListener('click', async () => {
      const reviewElements = document.querySelectorAll('.review-text');
      const reviews = Array.from(reviewElements).map(el => el.textContent.trim());

      if (reviews.length === 0) {
        alert('No reviews to summarize.');
        return;
      }

      const summaryCard = document.getElementById('summaryCard');
      const summaryText = document.getElementById('reviewSummary');
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
    });
  });
})();
