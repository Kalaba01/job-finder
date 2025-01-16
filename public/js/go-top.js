const goTopButton = document.getElementById("go-top");

// Add a scroll event listener to the window
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    goTopButton.classList.remove("hidden");
    goTopButton.classList.add("visible");
  } else {
    goTopButton.classList.remove("visible");
    goTopButton.classList.add("hidden");
  }
});

// Add a click event listener to the "Go to Top" button
goTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
