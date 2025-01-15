document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-password-form");

  form.addEventListener("submit", (event) => {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const notyf = new Notyf({
      position: {
        x: "right",
        y: "top"
      }
    });

    if (newPassword !== confirmPassword) {
      event.preventDefault();
      notyf.error("Passwords do not match!");
    }
  });
});
