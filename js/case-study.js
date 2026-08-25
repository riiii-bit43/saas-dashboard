/* UX Case Study Interactive Process Deck Controller */

function initCaseStudyController() {
  const stepPills = document.querySelectorAll('.step-pill');
  const csCards = document.querySelectorAll('.cs-section-card');

  stepPills.forEach(pill => {
    pill.addEventListener('click', () => {
      stepPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetId = pill.getAttribute('data-target');
      if (targetId === 'all') {
        csCards.forEach(c => c.style.display = 'block');
      } else {
        csCards.forEach(c => {
          if (c.id === targetId) {
            c.style.display = 'block';
            c.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            c.style.display = 'none';
          }
        });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCaseStudyController();
});
