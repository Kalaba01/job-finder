import { openRegisterPopup } from "./candidate-register-popup.js";
import { openForgotPasswordPopup } from "./forgot-password-popup.js";

const userIcon = document.getElementById("user-icon");
const loginPopupOverlay = document.getElementById("login-popup-overlay");
const loginForm = document.getElementById("login-form");
const closeLoginPopup = document.getElementById("login-close-popup");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const switchToRegister = document.getElementById("switch-to-register");
const forgotPasswordLink = document.getElementById("forgot-password-link");

// Initialize notification system (Notyf)
const notyf = new Notyf({
  position: {
    x: "right",
    y: "top"
  },
});

// Exported function to open the login popup
export function openLoginPopup() {
  loginPopupOverlay.style.display = "flex";
  loginEmailInput.focus();
}

function resetLoginForm() {
  loginEmailInput.value = "";
  loginPasswordInput.value = "";
}

userIcon.addEventListener("click", () => {
  loginPopupOverlay.style.display = "flex";
  loginEmailInput.focus();
});

closeLoginPopup.addEventListener("click", () => {
  loginPopupOverlay.style.display = "none";
  resetLoginForm();
});

switchToRegister.addEventListener("click", () => {
  loginPopupOverlay.style.display = "none";
  resetLoginForm();
  openRegisterPopup();
});

forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginPopupOverlay.style.display = "none";
  openForgotPasswordPopup();
});

// Event listener for form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    email: loginEmailInput.value,
    password: loginPasswordInput.value
  };

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const data = await response.json();
      notyf.success("Login successful! Redirecting...");
      window.location.href = data.redirectUrl;
    } else {
      const errorData = await response.json();
      notyf.error(errorData.error || "Login failed. Please try again.");
    }
  } catch (error) {
    notyf.error("An error occurred during login. Please try again.");
  }
});
