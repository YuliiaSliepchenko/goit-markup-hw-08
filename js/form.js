(function () {
  const GA_MEASUREMENT_ID = 'G-F5YZ1GYQJ0';
  const THANKS_URL = '/thank-you.html';
  const REDIRECT_DELAY_MS = 600;

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvRJm134vqSVpPM7pXx11q0kqdZdRAF9D8goMKxTFDcjGfd5uruS6IRTcdAg9uCQ9UTg/exec';

  const form = document.getElementById('contactForm');
  const status = document.getElementById('status');
  const popup = document.getElementById('successPopup');

  if (!form) return;

  const showPopup = (msg = '✅ Повідомлення відправлено!') => {
    if (!popup) return;
    popup.textContent = msg;
    popup.classList.remove('hide');
    popup.classList.add('show');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Відправляємо...';
    }

    const formData = new FormData(form);

    const payload = {
      name: (formData.get('user_name') || '').toString().trim(),
      phone: (formData.get('user_phone') || '').toString().trim(),
      email: (formData.get('user_mail') || '').toString().trim(),
      childAge: '',
      subject: 'Заявка з основного сайту',
      message: (formData.get('user_text') || '').toString().trim(),
      status: 'new'
    };

    try {
      // 1. Головне: швидко відправляємо в Formspree
      const formspreeResponse = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (!formspreeResponse.ok) {
        throw new Error('Formspree error');
      }

      // 2. Одразу показуємо успіх користувачу
      form.reset();
      form.classList.add('form--sent');
      showPopup();

      if (status) {
        status.style.color = 'green';
        status.textContent = '✅ Успішно відправлено!';
      }

      if (typeof gtag === 'function') {
        gtag('event', 'form_submit', {
          send_to: GA_MEASUREMENT_ID,
          form_id: form.id || '(no-id)',
          form_name: form.getAttribute('name') || 'Contact Form',
          page_location: window.location.href,
          page_title: document.title
        });
      }

      // 3. Відправляємо в Apps Script У ФОНІ
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      }).catch(err => {
        console.error('Apps Script background error:', err);
      });

      // 4. Редірект
      setTimeout(() => {
        window.location.href = THANKS_URL;
      }, REDIRECT_DELAY_MS);

    } catch (error) {
      console.error('Submit error:', error);

      if (status) {
        status.style.color = 'red';
        status.textContent = '⚠️ Помилка відправки. Спробуйте ще раз.';
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Відправити';
      }
    }
  });
})();