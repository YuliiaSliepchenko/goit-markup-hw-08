(function () {
  const form   = document.getElementById("contactForm");
  const status = document.getElementById("status");
  const popup  = document.getElementById("successPopup");

  if (!form) return;

  let t1 = null, t2 = null;

  const showPopup = () => {
    if (!popup) return;
    clearTimeout(t1); clearTimeout(t2);
    popup.classList.remove("hide");
    popup.classList.add("show");
    t1 = setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hide");
    }, 2500);
    t2 = setTimeout(() => {
      popup.classList.remove("hide");
    }, 3500);
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
        // 1️⃣ показати анімацію
        showPopup();

        // 2️⃣ текст під формою
        if (status) {
          status.style.color = "green";
          status.textContent = "✅ Повідомлення успішно відправлено!";
        }

        // 3️⃣ клас для аналітики
        form.classList.add("form--sent");

        // 4️⃣ очистка форми
        form.reset();

        // 5️⃣ через ~1 сек редірект на Formspree “Thank you”
        setTimeout(() => {
          window.location.href = "https://formspree.io/thanks";
        }, 1000);

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
