document.addEventListener("DOMContentLoaded", () => {
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const popupOverlay = document.getElementById("edit-profile-popup");
  const closePopupBtn = document.getElementById("edit-profile-close-btn");
  const editProfileForm = document.getElementById("edit-profile-form");

  // Otvaranje popupa
  editProfileBtn.addEventListener("click", () => {
    popupOverlay.style.display = "flex";
  });

  // Zatvaranje popupa
  closePopupBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Slanje forme
  editProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Kreiramo FormData za podršku fajlova
    const formData = new FormData(editProfileForm);
  
    try {
      const response = await fetch("/candidate/profile/edit", {
        method: "PUT",
        body: formData, // Šaljemo FormData objekt
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
