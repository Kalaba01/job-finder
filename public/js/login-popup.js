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

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    email: loginEmailInput.value,
    password: loginPasswordInput.value,
  };

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      window.location.href = data.redirectUrl;
    } else {
      const errorData = await response.json();
      console.error("Login failed:", errorData.error);
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
});
