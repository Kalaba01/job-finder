document.addEventListener("DOMContentLoaded", () => {
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const popupOverlay = document.getElementById("edit-profile-popup");
  const closePopupBtn = document.getElementById("edit-profile-close-btn");
  const editProfileForm = document.getElementById("edit-profile-form");

  // Initialize notification system (Notyf)
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top"
    }
  });

  // Open the edit profile popup
  editProfileBtn.addEventListener("click", () => {
    popupOverlay.style.display = "flex";
  });

  // Close the edit profile popup and reset file inputs
  closePopupBtn.addEventListener("click", () => {
    resetFileUploads();
    popupOverlay.style.display = "none";
  });

  // Handle profile form submission
  editProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(editProfileForm);

    try {
      const response = await fetch("/candidate/profile/edit", {
        method: "PUT",
        body: formData
      });

      if (response.ok) {
        notyf.success("Profile updated successfully!");
        location.reload();
      } else {
        const errorData = await response.json();
        notyf.error(errorData.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notyf.error("An error occurred while updating the profile.");
    }
  });
});


// Handle file upload input change
// Updates the label's appearance based on whether a file is selected
function handleFileUpload(input) {
  const label = input.closest('.file-upload').querySelector('label');

  if (input.files.length > 0) {
    label.classList.remove("upload-ready");
    label.classList.add("upload-success");
  } else {
    label.classList.remove("upload-success");
    label.classList.add("upload-ready");
  }
}

// Reset all file upload inputs and their associated labels
function resetFileUploads() {
  const fileUploads = document.querySelectorAll('.file-upload');
  fileUploads.forEach((fileUpload) => {
    const input = fileUpload.querySelector('input[type="file"]');
    const label = fileUpload.querySelector('label');

    input.value = "";

    label.classList.remove("upload-success");
    label.classList.add("upload-ready");
  });
}
