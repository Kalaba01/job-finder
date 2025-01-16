document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-password-form");

  // Initialize notification system (Notyf)
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top"
    }
  });

  // Add a submit event listener to the form
  form.addEventListener("submit", (event) => {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      event.preventDefault();
      notyf.error("Passwords do not match!");
    }
  });
});
