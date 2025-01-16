import { openLoginPopup } from "./login-popup.js";

const registerPopupOverlay = document.getElementById("register-popup-overlay");
const closeRegisterPopup = document.getElementById("register-close-popup");
const registerEmailInput = document.getElementById("register-email");
const registerFirstNameInput = document.getElementById("register-first-name");
const registerLastNameInput = document.getElementById("register-last-name");
const registerPasswordInput = document.getElementById("register-password");
const registerConfirmPasswordInput = document.getElementById("register-confirm-password");
const switchToLogin = document.getElementById("switch-to-login");
const registerForm = document.getElementById("register-form");

// Initialize notification system (Notyf)
const notyf = new Notyf({
  position: {
    x: "right",
    y: "top"
  }
});

// Function to open the register popup
export function openRegisterPopup() {
  registerPopupOverlay.style.display = "flex";
  registerFirstNameInput.focus();
}

// Close the register popup and reset the form
closeRegisterPopup.addEventListener("click", () => {
  registerPopupOverlay.style.display = "none";
  resetRegisterForm();
});

// Switch to the login popup from the register popup
switchToLogin.addEventListener("click", () => {
  registerPopupOverlay.style.display = "none";
  resetRegisterForm();
  openLoginPopup();
});

// Reset all form fields in the register form
function resetRegisterForm() {
  registerEmailInput.value = "";
  registerFirstNameInput.value = "";
  registerLastNameInput.value = "";
  registerPasswordInput.value = "";
  registerConfirmPasswordInput.value = "";
}

// Handle the registration form submission
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (registerPasswordInput.value.length < 6) {
    notyf.error("Password must be at least 6 characters long!");
    return;
  }

  if (registerPasswordInput.value !== registerConfirmPasswordInput.value) {
    notyf.error("Passwords do not match!");
    return;
  }

  const formData = {
    email: registerEmailInput.value,
    first_name: registerFirstNameInput.value,
    last_name: registerLastNameInput.value,
    password: registerPasswordInput.value
  };

  try {
    const response = await fetch("/auth/register/candidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      notyf.success("Registration successful! Redirecting to login...");
      registerPopupOverlay.style.display = "none";
      resetRegisterForm();
      openLoginPopup();
    } else {
      const errorData = await response.json();
      notyf.error(`Registration failed: ${errorData.error}`);
    }
  } catch (error) {
    notyf.error("An error occurred. Please try again.");
  }
});
