const languageIcon = document.getElementById("language-icon");
const languageDropdown = document.getElementById("language-dropdown");
const languageOptions = document.querySelectorAll(".language-option");

// Add a click event listener to each language option
languageOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    const lang = e.target.dataset.lang;
    fetch(`/set-language/${lang}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.reload();
        } else {
          console.error("Error setting language:", data.message);
        }
      })
      .catch((error) => console.error("Network error:", error));
    languageDropdown.classList.remove("show");
  });
});

languageIcon.addEventListener("click", () => {
  languageDropdown.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!languageIcon.contains(e.target)) {
    languageDropdown.classList.remove("show");
  }
});
