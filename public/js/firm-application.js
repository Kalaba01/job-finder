document.addEventListener("DOMContentLoaded", () => {
  const acceptBtn = document.getElementById("accept-btn");
  const rejectBtn = document.getElementById("reject-btn");

  const handleApplicationAction = async (action) => {
    const applicationId = window.location.pathname.split("/").pop();
    try {
      const response = await fetch(`/firm/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        alert(`Application ${action}ed successfully!`);
        location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to ${action} application: ${error.message}`);
      }
    } catch (err) {
      console.error(`Error ${action}ing application:`, err);
      alert(`Failed to ${action} application.`);
    }
  };

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => handleApplicationAction("accept"));
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => handleApplicationAction("reject"));
  }
});
