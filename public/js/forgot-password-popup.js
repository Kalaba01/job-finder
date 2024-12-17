// Dohvatamo elemente za popup
const forgotPasswordPopup = document.getElementById("forgot-password-popup-overlay");
forgotPasswordPopup.style.display = "none";
const forgotPasswordClose = document.getElementById("forgot-password-close-popup");
const forgotPasswordForm = document.getElementById("forgot-password-form");

// Funkcija za otvaranje forgot-password popupa
export function openForgotPasswordPopup() {
  forgotPasswordPopup.style.display = "flex";
}

// Zatvaranje forgot password popupa
forgotPasswordClose.addEventListener("click", () => {
  forgotPasswordPopup.style.display = "none";
});

// Slanje e-maila za reset lozinke
forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgot-password-email").value;

  try {
    const response = await fetch("/password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      alert("Password reset link sent successfully!");
      forgotPasswordPopup.style.display = "none";
    } else {
      const error = await response.json();
      alert(error.message || "Error sending password reset link.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred while sending the reset link.");
  }
});
