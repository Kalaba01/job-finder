const themeToggle = document.getElementById("theme-icon");
const themeIcon = themeToggle.querySelector("i");

const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);
themeIcon.className = currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

themeToggle.addEventListener("click", () => {
  const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
});
