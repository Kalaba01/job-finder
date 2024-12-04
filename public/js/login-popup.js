import { openRegisterPopup } from "./candidate-register-popup.js";

const userIcon = document.getElementById("user-icon");
const loginPopupOverlay = document.getElementById("login-popup-overlay");
const closeLoginPopup = document.getElementById("login-close-popup");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const switchToRegister = document.getElementById("switch-to-register");

export function openLoginPopup() {
  loginPopupOverlay.style.display = "flex";
  loginEmailInput.focus();
}

userIcon.addEventListener("click", () => {
  loginPopupOverlay.style.display = "flex";
  loginEmailInput.focus();
});

closeLoginPopup.addEventListener("click", () => {
  loginPopupOverlay.style.display = "none";
  loginEmailInput.value = "";
  loginPasswordInput.value = "";
});

switchToRegister.addEventListener("click", () => {
  loginPopupOverlay.style.display = "none";
  loginEmailInput.value = "";
  loginPasswordInput.value = "";
  openRegisterPopup();
});
