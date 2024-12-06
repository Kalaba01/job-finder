const hamburgerMenu = document.getElementById("hamburger-menu");
const hamburgerSidebar = document.getElementById("hamburger-sidebar");

hamburgerMenu.addEventListener("click", () => {
  hamburgerSidebar.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!hamburgerSidebar.contains(e.target) && !hamburgerMenu.contains(e.target)) {
    hamburgerSidebar.classList.remove("open");
  }
});
