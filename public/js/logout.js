// Add an event listener to the logout icon
document.getElementById("logout-icon").addEventListener("click", () => {
  fetch("/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Failed to logout");
      }
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
});
