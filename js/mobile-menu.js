document.addEventListener('DOMContentLoaded', () => {
  const menu     = document.querySelector('#mobile-menu');
  const openBtn  = document.querySelector('.js-open-menu');
  const closeBtn = document.querySelector('.js-close-menu');
  const body     = document.body;

  if (!menu || !openBtn || !closeBtn) return;

  const open  = () => {
    menu.classList.add('is-open');
    body.classList.add('menu-open', 'no-scroll');  // ← ховаємо бургер і блокуємо скрол
    openBtn.setAttribute('aria-expanded','true');
  };

  const close = () => {
    menu.classList.remove('is-open');
    body.classList.remove('menu-open', 'no-scroll');
    openBtn.setAttribute('aria-expanded','false');
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  matchMedia('(min-width: 768px)').addEventListener('change', e => { if (e.matches) close(); });
});
