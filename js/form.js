const form   = document.getElementById("contactForm");
  const status = document.getElementById("status");        // можна сховати через CSS, якщо не потрібен
  const popup  = document.getElementById("successPopup");  // <div class="success-popup" id="successPopup">...</div>

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (status) status.textContent = "";

    try {
      const data = new FormData(form);

      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        // показати попап (виїзд справа → в центр)
        if (popup) {
          popup.classList.remove("hide");
          popup.classList.add("show");
        }

        // текстовий статус (необов'язково)
        if (status) {
          status.style.color = "green";
          status.textContent = "✅ Повідомлення успішно відправлено!";
        }

        form.reset();

        // через 2.5 cек — запускаємо зникнення (вліво)
        setTimeout(() => {
          if (popup) {
            popup.classList.remove("show");
            popup.classList.add("hide");
          }
        }, 2500);

        // ще через 1 cек — прибираємо "hide", щоб підготувати до наступного показу
        setTimeout(() => {
          if (popup) popup.classList.remove("hide");
        }, 3500);

      } else {
        if (status) {
          status.style.color = "red";
          status.textContent = "❌ Помилка при відправці. Спробуйте ще раз.";
        }
      }
    } catch (err) {
      if (status) {
        status.style.color = "red";
        status.textContent = "❌ Сталася помилка мережі. Спробуйте ще раз.";
      }
    }
  });