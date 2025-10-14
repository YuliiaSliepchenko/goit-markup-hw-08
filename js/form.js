(function () {
  const form   = document.getElementById("contactForm");
  const status = document.getElementById("status");
  const popup  = document.getElementById("successPopup");

  // ==== НАЛАШТУВАННЯ ====
  const THANKS_URL = "/thank-you.html";   // <-- ВАША сторінка подяки (замість Formspree)
  const REDIRECT_DELAY_MS = 1200;         // затримка перед редіректом (анімація встигає з’явитись)

  if (!form) return;

  let t1 = null, t2 = null;

  const showPopup = () => {
    if (!popup) return;
    clearTimeout(t1); clearTimeout(t2);
    popup.classList.remove("hide");
    popup.classList.add("show");

    // НЕ обов’язково ховати — все одно редіректимося
    // Але якщо хочете — залиште автозакриття попапа:
    // t1 = setTimeout(() => {
    //   popup.classList.remove("show");
    //   popup.classList.add("hide");
    // }, 2500);
    // t2 = setTimeout(() => {
    //   popup.classList.remove("hide");
    // }, 3500);
  };

  const hidePopup = () => {
    if (!popup) return;
    clearTimeout(t1); clearTimeout(t2);
    popup.classList.remove("show");
    popup.classList.add("hide");
    setTimeout(() => popup.classList.remove("hide"), 800);
  };

  if (popup) {
    popup.addEventListener("click", hidePopup);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hidePopup();
    });
  }

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
        // 1️⃣ показуємо анімацію
        showPopup();

        // 2️⃣ фолбек-підпис під формою (за бажанням)
        if (status) {
          status.style.color = "green";
          status.textContent = "✅ Повідомлення успішно відправлено!";
        }

        // 3️⃣ клас для аналітики
        form.classList.add("form--sent");

        // 4️⃣ чистимо форму
        form.reset();

        // 5️⃣ РЕДІРЕКТ НА ВАШУ THANK YOU СТОРІНКУ
        setTimeout(() => {
          window.location.href = THANKS_URL;
        }, REDIRECT_DELAY_MS);

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

  form.addEventListener("input", () => form.classList.remove("form--sent"));
})();
