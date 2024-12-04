const goTopButton = document.getElementById("go-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    goTopButton.classList.remove("hidden");
    goTopButton.classList.add("visible");
  } else {
    goTopButton.classList.remove("visible");
    goTopButton.classList.add("hidden");
  }
});

goTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
