(function () {
  const GA_MEASUREMENT_ID = 'G-F5YZ1GYQJ0';  // ← встав сюди свій GA4 ID
  const THANKS_URL        = '/thank-you.html';
  const REDIRECT_DELAY_MS = 800;

  const form   = document.getElementById('contactForm');
  const status = document.getElementById('status');
  const popup  = document.getElementById('successPopup');
  if (!form) return;

  const showPopup = (msg = '✅ Повідомлення відправлено!') => {
    if (!popup) return;
    popup.textContent = msg;
    popup.classList.remove('hide');
    popup.classList.add('show');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.reset();
        form.classList.add('form--sent');
        showPopup();
        if (status) { status.style.color = 'green'; status.textContent = '✅ Успішно відправлено!'; }

        // 🔥 Відправляємо подію в GA4
        if (typeof gtag === 'function') {
          gtag('event', 'form_submit', {
            send_to: GA_MEASUREMENT_ID,
            form_id: form.id || '(no-id)',
            form_name: form.getAttribute('name') || 'Contact Form',
            page_location: window.location.href,
            page_title: document.title
          });
        }

        // Редірект на сторінку подяки
        setTimeout(() => window.location.href = THANKS_URL, REDIRECT_DELAY_MS);

      } else {
        if (status) { status.style.color = 'red'; status.textContent = '❌ Помилка при відправці.'; }
      }
    } catch (error) {
      console.error(error);
      if (status) { status.style.color = 'red'; status.textContent = '⚠️ Помилка мережі.'; }
    }
  });
})();
