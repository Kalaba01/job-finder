const firmRegisterPopupOverlay = document.getElementById("firm-register-popup-overlay");
const firmRegisterClosePopup = document.getElementById("firm-register-close-popup");
const firmRegisterForm = document.getElementById("firm-register-form");
const registerFirmButton = document.querySelector(".btn-register-firm");
const employeeRangeSlider = document.getElementById("employee-range-slider");
const rangeOutput = document.getElementById("firm-register-range-output");

// Initialize the range slider
noUiSlider.create(employeeRangeSlider, {
  start: [10, 100],
  connect: true,
  range: {
    min: 1,
    max: 500,
  },
  step: 1,
});

// Update the output for the range slider
employeeRangeSlider.noUiSlider.on("update", (values) => {
  rangeOutput.textContent = `${Math.floor(values[0])} - ${Math.ceil(values[1])}`;
});

// Open the firm registration popup
registerFirmButton.addEventListener("click", () => {
  firmRegisterPopupOverlay.style.display = "flex";
});

// Close the firm registration popup
firmRegisterClosePopup.addEventListener("click", () => {
  closeFirmRegisterPopup();
});

// Function to close the popup
function closeFirmRegisterPopup() {
  firmRegisterPopupOverlay.style.display = "none";
  resetFirmRegisterForm();
}

// Reset the form
function resetFirmRegisterForm() {
  firmRegisterForm.reset();
  employeeRangeSlider.noUiSlider.set([10, 100]); // Reset the range slider
}

// Handle form submission
firmRegisterForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("firm-register-email").value;
  const name = document.getElementById("firm-register-name").value;
  const address = document.getElementById("firm-register-address").value;
  const employeesRange = employeeRangeSlider.noUiSlider.get();

  const formData = {
    email,
    name,
    address,
    employees_range: `${Math.floor(employeesRange[0])}-${Math.ceil(employeesRange[1])}`,
  };

  try {
    const response = await fetch("/auth/register/firm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Request submitted successfully!");
      closeFirmRegisterPopup();
    } else {
      const errorData = await response.json();
      alert(`Failed to submit request: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("An error occurred. Please try again later.");
  }
});
