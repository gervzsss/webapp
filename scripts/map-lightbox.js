/* map-lightbox.js — simple accessible lightbox for the about page map image */
(function () {
  function openLightbox(src, alt) {
    let lb = document.getElementById('mapLightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'mapLightbox';
      lb.className = 'map-lightbox';
      lb.innerHTML = `
        <button class="close-x" aria-label="Close map">×</button>
        <img src="" alt="" />
      `;
      document.body.appendChild(lb);
      lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
      lb.querySelector('.close-x').addEventListener('click', () => closeLightbox());
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
    }
    const img = lb.querySelector('img');
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('open');
    // trap focus to the close button for simple accessibility
    const closeBtn = lb.querySelector('.close-x');
    closeBtn.focus();
  }

  function closeLightbox() {
    const lb = document.getElementById('mapLightbox');
    if (!lb) return;
    lb.classList.remove('open');
    // remove src to free memory
    const img = lb.querySelector('img');
    if (img) img.src = '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const holder = document.querySelector('.map-placeholder');
    if (!holder) return;
    const img = holder.querySelector('img');
    if (!img) return;
    // make the image clickable to open lightbox
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      openLightbox(img.src, img.alt);
    });
  });

  // expose for debug
  window.MapLightbox = { open: openLightbox, close: closeLightbox };
})();
