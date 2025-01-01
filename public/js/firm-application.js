document.addEventListener("DOMContentLoaded", () => {
  const acceptBtn = document.getElementById("accept-btn");
  const rejectBtn = document.getElementById("reject-btn");

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      console.log("Application accepted!");
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      console.log("Application rejected!");
    });
  }
});
