document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("user-modal");
  const openModalBtn = document.getElementById("open-modal-btn");
  const closeModalBtns = document.querySelectorAll("#close-modal-btn");
  const roleSelect = document.getElementById("role-select");
  const roleSpecificFields = document.getElementById("role-specific-fields");
  const addUserForm = document.getElementById("add-user-form");

  openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModalBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      closeModal();
    })
  );

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  const closeModal = () => {
    modal.style.display = "none";
    addUserForm.reset();
    roleSpecificFields.innerHTML = "";
  };

  roleSelect.addEventListener("change", (event) => {
    const role = event.target.value;

    roleSpecificFields.innerHTML = "";

    if (role === "admin") {
      roleSpecificFields.innerHTML = `
          <div class="form-group">
            <label for="admin-email">Email:</label>
            <input type="email" id="admin-email" name="email" required />
          </div>
          <div class="form-group">
            <label for="admin-password">Password:</label>
            <input type="password" id="admin-password" name="password" required />
          </div>
        `;
    } else if (role === "firm") {
      roleSpecificFields.innerHTML = `
        <div class="form-group">
          <label for="firm-email">Email:</label>
          <input type="email" id="firm-email" name="email" required />
        </div>
        <div class="form-group">
          <label for="firm-password">Password:</label>
          <input type="password" id="firm-password" name="password" required />
        </div>
        <div class="form-group">
          <label for="firm-name">Firm Name:</label>
          <input type="text" id="firm-name" name="name" required />
        </div>
        <div class="form-group">
          <label for="firm-address">Firm Address:</label>
          <input type="text" id="firm-address" name="address" required />
        </div>
        <div class="form-group">
          <label for="firm-employees">Number of Employees:</label>
          <div id="firm-employees-slider"></div>
          <input type="hidden" id="firm-employees-range" name="employees_range" />
          <div class="slider-values"> Selected Range:
            <span id="min-employees">0</span>
            <span> - </span>
            <span id="max-employees">100</span>
          </div>
        </div>
      `;
  
      // Initialize noUiSlider
      const slider = document.getElementById("firm-employees-slider");
      const rangeInput = document.getElementById("firm-employees-range");
      const minLabel = document.getElementById("min-employees");
      const maxLabel = document.getElementById("max-employees");
  
      noUiSlider.create(slider, {
        start: [10, 50],
        connect: true,
        range: {
          min: 0,
          max: 500,
        },
        step: 1,
      });
  
      slider.noUiSlider.on("update", (values) => {
        const [min, max] = values.map(Math.round);
        rangeInput.value = `${min}-${max}`;
        minLabel.textContent = min;
        maxLabel.textContent = max;
      });
    } else if (role === "candidate") {
      roleSpecificFields.innerHTML = `
          <div class="form-group">
            <label for="candidate-email">Email:</label>
            <input type="email" id="candidate-email" name="email" required />
          </div>
          <div class="form-group">
            <label for="candidate-password">Password:</label>
            <input type="password" id="candidate-password" name="password" required />
          </div>
          <div class="form-group">
            <label for="candidate-first-name">First Name:</label>
            <input type="text" id="candidate-first-name" name="first_name" required />
          </div>
          <div class="form-group">
            <label for="candidate-last-name">Last Name:</label>
            <input type="text" id="candidate-last-name" name="last_name" required />
          </div>
        `;
    }
  });

  addUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(addUserForm);
    const userData = Object.fromEntries(formData);

    try {
      const response = await fetch("/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("User added successfully!");
        closeModal();

        location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to add user: ${error.message}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  });
});
