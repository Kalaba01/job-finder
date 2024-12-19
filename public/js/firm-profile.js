document.addEventListener("DOMContentLoaded", () => {
  const editPopup = document.getElementById("editProfilePopup");
  const openPopupBtn = document.getElementById("openEditPopup");
  const closePopupBtn = document.getElementById("closeEditPopup");
  const editForm = document.querySelector("#editProfilePopup form");

  if (openPopupBtn) {
    openPopupBtn.addEventListener("click", () => {
      editPopup.style.display = "flex";
    });
  }

  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", () => {
      editPopup.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === editPopup) {
      editPopup.style.display = "none";
    }
  });

  const employeeSlider = document.getElementById("employeeRange");
  const employeesInput = document.getElementById("employees");
  const employeeRange = employeesInput.value.split("-").map(Number);

  noUiSlider.create(employeeSlider, {
    start: employeeRange,
    connect: true,
    range: {
      min: 0,
      max: 1000,
    },
    step: 1,
    tooltips: [true, true],
    format: {
      to: (value) => Math.round(value),
      from: (value) => Math.round(value),
    },
  });

  employeeSlider.noUiSlider.on("update", (values) => {
    employeesInput.value = `${values[0]}-${values[1]}`;
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
        alert("Profile updated successfully!");
        location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to update profile"}`);
      }
    } catch (err) {
      console.error("Error submitting the form:", err);
      alert("An error occurred. Please try again.");
    }
  });
});
