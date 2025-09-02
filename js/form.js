const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let data = new FormData(form);

  let response = await fetch(form.action, {
    method: form.method,
    body: data,
    headers: { 'Accept': 'application/json' }
  });

  if (response.ok) {
    status.style.color = "green";
    status.innerText = "✅ Повідомлення успішно відправлено!";
    form.reset();
  } else {
    status.style.color = "red";
    status.innerText = "❌ Помилка при відправці. Спробуйте ще раз.";
  }
});