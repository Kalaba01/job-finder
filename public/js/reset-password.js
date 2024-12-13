document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-password-form");

  form.addEventListener("submit", (event) => {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      event.preventDefault();
      alert("Passwords do not match!");
    }
  });
});
