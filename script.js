(() => {
  const tiles = [...document.querySelectorAll('.tile')];
  const filters = [...document.querySelectorAll('.filter')];

  // Project filters
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on);
      });
      tiles.forEach((t) => { t.hidden = f !== 'all' && t.dataset.project !== f; });
    });
  });

  // Lightbox
  const lb = document.querySelector('.lightbox');
  const img = lb.querySelector('img');
  const cap = lb.querySelector('figcaption');
  let current = 0;

  const visible = () => tiles.filter((t) => !t.hidden);

  const show = (i) => {
    const list = visible();
    current = (i + list.length) % list.length;
    const btn = list[current].querySelector('.tile-btn');
    img.src = btn.dataset.full;
    img.alt = btn.querySelector('img').alt;
    cap.textContent = btn.dataset.caption;
  };

  tiles.forEach((t) => {
    t.querySelector('.tile-btn').addEventListener('click', () => {
      show(visible().indexOf(t));
      lb.showModal();
    });
  });

  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.tagName === 'FIGURE') lb.close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
