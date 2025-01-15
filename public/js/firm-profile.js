document.addEventListener("DOMContentLoaded", () => {
  const editPopup = document.getElementById("editProfilePopup");
  const openPopupBtn = document.getElementById("openEditPopup");
  const closePopupBtn = document.getElementById("closeEditPopup");
  const editForm = document.querySelector("#editProfilePopup form");

  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top"
    }
  });

  openPopupBtn.addEventListener("click", () => {
    editPopup.style.display = "flex";
  });

  closePopupBtn.addEventListener("click", () => {
    resetFileUploads();
    editPopup.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === editPopup) {
      editPopup.style.display = "none";
    }
  });

  const employeeSlider = document.getElementById("employeeRange");
  const employeesInput = document.getElementById("employees");
  const selectedRange = document.getElementById("selectedRange");
  const employeeRange = employeesInput.value.split("-").map(Number);

  // Inicijalizacija noUiSlider-a
  noUiSlider.create(employeeSlider, {
    start: employeeRange,
    connect: true,
    range: {
      min: 0,
      max: 1000,
    },
    step: 1,
    format: {
      to: (value) => Math.round(value),
      from: (value) => Math.round(value),
    },
  });

  employeeSlider.noUiSlider.on("update", (values) => {
    employeesInput.value = `${values[0]}-${values[1]}`;
    const rangeLabel = selectedRange.getAttribute("data-i18n");
    selectedRange.textContent = `${rangeLabel}: ${values[0]} - ${values[1]}`;
});

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(editForm);

    try {
      const response = await fetch("/firm/profile/edit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        notyf.success("Profile updated successfully!");
        location.reload();
      } else {
        const error = await response.json();
        notyf.error(`Error: ${error.message || "Failed to update profile"}`);
      }
    } catch (err) {
      console.error("Error submitting the form:", err);
      notyf.error("An error occurred. Please try again.");
    }
  });
});

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
