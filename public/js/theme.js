const themeToggle = document.getElementById("theme-icon");
const themeIcon = themeToggle.querySelector("i");

const currentTheme = localStorage.getItem("theme") || "light";

// Set the initial theme on the document based on the saved preference
document.documentElement.setAttribute("data-theme", currentTheme);

// Update the icon to reflect the current theme
themeIcon.className = currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

// Add a click event listener to the theme toggle button
themeToggle.addEventListener("click", () => {
  const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
});
