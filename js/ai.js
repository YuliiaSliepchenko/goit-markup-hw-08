document.addEventListener("DOMContentLoaded", function () {
  const openAiButton = document.querySelector(".button-ai");
  const containerAi = document.querySelector(".conteiner_ai");
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");

  if (openAiButton && containerAi && header && main && footer) {
    openAiButton.addEventListener("click", function () {
      containerAi.classList.add("hidden");
      header.classList.remove("hidden");
      main.classList.remove("hidden");
      footer.classList.remove("hidden");
    });
  } else {
    console.error("One or more elements not found. Check your selectors.");
  }
});
