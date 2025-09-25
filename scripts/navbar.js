document.addEventListener('DOMContentLoaded', function () {
  const toggler = document.querySelector('.navbar-toggler');
  const collapse = document.querySelector('.navbar-collapse');
  if (!toggler || !collapse) return;

  // Ensure ARIA attributes exist for accessibility
  if (!toggler.hasAttribute('aria-expanded')) toggler.setAttribute('aria-expanded', 'false');
  if (!toggler.hasAttribute('aria-controls')) toggler.setAttribute('aria-controls', collapse.id || 'navbarCollapse');
  if (!collapse.id) collapse.id = toggler.getAttribute('aria-controls') || 'navbarCollapse';

  // Toggle function
  function toggle() {
    const isOpen = collapse.classList.contains('show');
    collapse.classList.toggle('show');
    toggler.classList.toggle('open', !isOpen);
    toggler.setAttribute('aria-expanded', String(!isOpen));
  }

  // Close the collapse when clicking outside (optional, helpful on mobile)
  function onDocumentClick(e) {
    if (!collapse.classList.contains('show')) return;
    if (collapse.contains(e.target) || toggler.contains(e.target)) return;
    collapse.classList.remove('show');
    toggler.classList.remove('open');
    toggler.setAttribute('aria-expanded', 'false');
  }

  // Reset collapse state on large screens (so it doesn't remain open when resizing)
  function onResize() {
    // Mirror Bootstrap's lg breakpoint (992px)
    if (window.innerWidth >= 992 && collapse.classList.contains('show')) {
      collapse.classList.remove('show');
      toggler.classList.remove('open');
      toggler.setAttribute('aria-expanded', 'false');
    }
  }

  toggler.addEventListener('click', function (e) {
    e.preventDefault();
    toggle();
  });

  document.addEventListener('click', onDocumentClick);
  window.addEventListener('resize', onResize);
});
