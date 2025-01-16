const hamburgerMenu = document.getElementById("hamburger-menu");
const hamburgerSidebar = document.getElementById("hamburger-sidebar");

// Add a click event listener to the hamburger menu button
hamburgerMenu.addEventListener("click", () => {
  hamburgerSidebar.classList.toggle("open");
});

// Add a click event listener to the entire document
document.addEventListener("click", (e) => {
  if (!hamburgerSidebar.contains(e.target) && !hamburgerMenu.contains(e.target)) {
    hamburgerSidebar.classList.remove("open");
  }
});
