// Shared reveal animation for page heroes and about content
(function () {
  const selectors = ['header .display-4', 'header .lead', '.about-text', '.about-banner'];

  function reveal() {
    const nodes = Array.from(document.querySelectorAll(selectors.join(', ')));
    nodes.forEach((el, i) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(6px)';
      setTimeout(() => {
        el.style.transition = 'opacity .6s ease, transform .6s ease';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 120 * i);
    });
  }

  document.addEventListener('DOMContentLoaded', reveal);
})();
