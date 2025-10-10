// randomFormId.js
(function () {
  function addRandomId() {
    // Знаходимо твою форму
    const form = document.getElementById('contactForm');
    if (!form) {
      console.warn('contactForm не знайдено');
      return;
    }

    // Знаходимо контейнер форми (твій .form.card.card--solid)
    const wrapper =
      form.closest('.form.card.card--solid') ||
      form.parentElement;

    if (!wrapper) {
      console.warn('Батьківський контейнер форми не знайдено');
      return;
    }

    // Генеруємо динамічний ID з префіксом "itenai"
    if (!/^itenai-f/.test(wrapper.id)) {
      const rid =
        'itenai-f' +
        Math.floor(100 + Math.random() * 900) +
        '-x' +
        Math.floor(1 + Math.random() * 9);
      wrapper.id = rid;
      console.log('✅ Додано унікальний ID для контейнера форми:', rid);
    } else {
      console.log('ℹ️ Контейнер уже має ID:', wrapper.id);
    }
  }

  // Запускаємо коли DOM готовий
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addRandomId);
  } else {
    addRandomId();
  }
})();