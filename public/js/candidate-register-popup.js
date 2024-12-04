import { openLoginPopup } from "./login-popup.js";

const registerPopupOverlay = document.getElementById("register-popup-overlay");
const closeRegisterPopup = document.getElementById("register-close-popup");
const registerEmailInput = document.getElementById("register-email");
const registerPasswordInput = document.getElementById("register-password");
const registerConfirmPasswordInput = document.getElementById("register-confirm-password");
const switchToLogin = document.getElementById("switch-to-login");

export function openRegisterPopup() {
  registerPopupOverlay.style.display = "flex";
  registerEmailInput.focus();
}

closeRegisterPopup.addEventListener("click", () => {
  registerPopupOverlay.style.display = "none";
  registerEmailInput.value = "";
  registerPasswordInput.value = "";
  registerConfirmPasswordInput.value = "";
});

switchToLogin.addEventListener("click", () => {
  registerPopupOverlay.style.display = "none";
  registerEmailInput.value = "";
  registerPasswordInput.value = "";
  registerConfirmPasswordInput.value = "";
  openLoginPopup();
});
