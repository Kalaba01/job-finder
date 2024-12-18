document.addEventListener("DOMContentLoaded", () => {
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const popupOverlay = document.getElementById("edit-profile-popup");
  const closePopupBtn = document.getElementById("edit-profile-close-btn");
  const editProfileForm = document.getElementById("edit-profile-form");

  editProfileBtn.addEventListener("click", () => {
    popupOverlay.style.display = "flex";
  });

  closePopupBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  editProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(editProfileForm);
  
    try {
      const response = await fetch("/candidate/profile/edit", {
        method: "PUT",
        body: formData
      });
  
      if (response.ok) {
        alert("Profile updated successfully!");
        location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  });  
});
