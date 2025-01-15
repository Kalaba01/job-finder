document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("user-modal");
  const openModalBtn = document.getElementById("open-modal-btn");
  const closeModalBtns = document.querySelectorAll("#close-modal-btn");
  const roleSelect = document.getElementById("role-select");
  const roleSelectContainer = document.getElementById("role-select-container");
  const modalTitle = document.getElementById("modal-title");
  const roleSpecificFields = document.getElementById("role-specific-fields");
  const addUserForm = document.getElementById("add-user-form");

  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top"
    }
  });

  const localizations = {
    title: document.body.dataset.title,
    addUser: document.body.dataset.addUserTitle,
    editUser: document.body.dataset.editUserTitle,
    selectRole: document.body.dataset.selectRole,
    chooseRole: document.body.dataset.chooseRole,
    emailLabel: document.body.dataset.emailLabel,
    passwordLabel: document.body.dataset.passwordLabel,
    firmNameLabel: document.body.dataset.firmNameLabel,
    firmAddressLabel: document.body.dataset.firmAddressLabel,
    numberOfEmployeesLabel: document.body.dataset.numberOfEmployeesLabel,
    selectedRange: document.body.dataset.selectedRange,
    firstNameLabel: document.body.dataset.firstNameLabel,
    lastNameLabel: document.body.dataset.lastNameLabel,
    cityLabel: document.body.dataset.cityLabel,
    cityPlaceholder: document.body.dataset.cityPlaceholder,
    save: document.body.dataset.save,
    cancel: document.body.dataset.cancel,
    deleteUserTitle: document.body.dataset.deleteUserTitle,
    deleteUserMessage: document.body.dataset.deleteUserMessage,
    yes: document.body.dataset.yes,
    no: document.body.dataset.no,
    userAddedSuccessfully: document.body.dataset.userAddedSuccessfully,
    userUpdatedSuccessfully: document.body.dataset.userUpdatedSuccessfully,
    failedToProcessUser: document.body.dataset.failedToProcessUser,
    errorProcessingUser: document.body.dataset.errorProcessingUser,
    userDeletedSuccessfully: document.body.dataset.userDeletedSuccessfully,
    failedToDeleteUser: document.body.dataset.failedToDeleteUser,
    errorDeletingUser: document.body.dataset.errorDeletingUser,
    errorFetchingUserDetails: document.body.dataset.errorFetchingUserDetails,
    anErrorOccurredProcessingUser:
      document.body.dataset.anErrorOccurredProcessingUser,
  };

  const toggleModalForEdit = (isEdit) => {
    if (isEdit) {
      modalTitle.textContent = localizations.editUser;
      roleSelectContainer.style.display = "none";
      roleSelect.removeAttribute("required");
    } else {
      modalTitle.textContent = localizations.addUser;
      roleSelectContainer.style.display = "block";
      roleSelect.setAttribute("required", "true");
    }
  };

  const closeModal = () => {
    modal.style.display = "none";
    addUserForm.reset();
    roleSpecificFields.innerHTML = "";
  };

  openModalBtn.addEventListener("click", () => {
    toggleModalForEdit(false);
    modal.style.display = "block";
  });

  closeModalBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      closeModal();
    })
  );

  roleSelect.addEventListener("change", (event) => {
    const role = event.target.value;

    roleSpecificFields.innerHTML = "";

    if (role === "admin") {
      roleSpecificFields.innerHTML = `
          <div class="form-group">
            <label for="admin-email">${localizations.emailLabel}:</label>
            <input type="email" id="admin-email" name="email" required />
          </div>
          <div class="form-group">
            <label for="admin-password">${localizations.passwordLabel}:</label>
            <input type="password" id="admin-password" name="password" required />
          </div>
        `;
    } else if (role === "firm") {
      roleSpecificFields.innerHTML = `
        <div class="form-group">
          <label for="firm-email">${localizations.emailLabel}:</label>
          <input type="email" id="firm-email" name="email" required />
        </div>
        <div class="form-group">
          <label for="firm-password">${localizations.passwordLabel}:</label>
          <input type="password" id="firm-password" name="password" required />
        </div>
        <div class="form-group">
          <label for="firm-name">${localizations.firmNameLabel}:</label>
          <input type="text" id="firm-name" name="name" required />
        </div>
        <div class="form-group">
          <label for="firm-city">${localizations.cityLabel}:</label>
          <input type="text" id="firm-city" name="city" required />
        </div>
        <div class="form-group">
          <label for="firm-address">${localizations.firmAddressLabel}:</label>
          <input type="text" id="firm-address" name="address" required />
        </div>
        <div class="form-group">
          <label for="firm-employees">${localizations.numberOfEmployeesLabel}:</label>
          <div id="firm-employees-slider"></div>
          <input type="hidden" id="firm-employees-range" name="employees_range" />
          <div class="slider-values">${localizations.selectedRange}:
            <span id="min-employees">0</span>
            <span> - </span>
            <span id="max-employees">100</span>
          </div>
        </div>
      `;

      const slider = document.getElementById("firm-employees-slider");
      const rangeInput = document.getElementById("firm-employees-range");
      const minLabel = document.getElementById("min-employees");
      const maxLabel = document.getElementById("max-employees");

      noUiSlider.create(slider, {
        start: [10, 50],
        connect: true,
        range: {
          min: 0,
          max: 500
        },
        step: 1
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
            <label for="candidate-email">${localizations.emailLabel}:</label>
            <input type="email" id="candidate-email" name="email" required />
          </div>
          <div class="form-group">
            <label for="candidate-password">${localizations.passwordLabel}:</label>
            <input type="password" id="candidate-password" name="password" required />
          </div>
          <div class="form-group">
            <label for="candidate-first-name">${localizations.firstNameLabel}:</label>
            <input type="text" id="candidate-first-name" name="first_name" required />
          </div>
          <div class="form-group">
            <label for="candidate-last-name">${localizations.lastNameLabel}:</label>
            <input type="text" id="candidate-last-name" name="last_name" required />
          </div>
        `;
    }
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userId = btn.getAttribute("data-id");
      const userEmail = btn.getAttribute("data-email");
      const userRole = btn.getAttribute("data-role");

      const userData = { id: userId, email: userEmail, role: userRole };

      if (userRole === "firm" || userRole === "candidate") {
        const response = await fetch(`/admin/users/details/${userId}`);
        if (response.ok) {
          const details = await response.json();
          Object.assign(userData, details);
        } else {
          notyf.error(localizations.errorFetchingUserDetails);
          return;
        }
      }

      toggleModalForEdit(true);
      populateRoleSpecificFields(userData);
      modal.style.display = "block";
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const userId = btn.getAttribute("data-id");

      openConfirmModal({
        title: localizations.deleteUserTitle,
        message: localizations.deleteUserMessage,
        action: "delete",
        id: userId,
        onConfirm: async (id) => {
          try {
            const response = await fetch(`/admin/users/delete/${id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              notyf.success(localizations.userDeletedSuccessfully);
              location.reload();
            } else {
              const error = await response.json();
              notyf.error(`${localizations.failedToDeleteUser}: ${error.message}`);
            }
          } catch (error) {
            console.error(localizations.errorDeletingUser, error);
            notyf.error(localizations.errorDeletingUser);
          }
        },
      });
    });
  });

  const populateRoleSpecificFields = (userData) => {
    const {
      id,
      role,
      email,
      name = "",
      city = "",
      address = "",
      employees_range = "0-0",
      first_name = "",
      last_name = "",
    } = userData;

    roleSpecificFields.innerHTML = `<input type="hidden" name="id" value="${id}" />`;

    if (role === "admin") {
      roleSpecificFields.innerHTML += `
        <div class="form-group">
          <label for="admin-email">${localizations.emailLabel}:</label>
          <input type="email" id="admin-email" name="email" value="${email}" required />
        </div>`;
    } else if (role === "firm") {
      const [minEmployees, maxEmployees] = employees_range.split("-");
      roleSpecificFields.innerHTML += `
        <div class="form-group">
          <label for="firm-email">${localizations.emailLabel}:</label>
          <input type="email" id="firm-email" name="email" value="${email}" required />
        </div>
        <div class="form-group">
          <label for="firm-name">${localizations.firmNameLabel}:</label>
          <input type="text" id="firm-name" name="name" value="${name}" required />
        </div>
        <div class="form-group">
          <label for="firm-city">${localizations.cityLabel}:</label>
          <input type="text" id="firm-city" name="city" value="${city}" required />
        </div>
        <div class="form-group">
          <label for="firm-address">${localizations.firmAddressLabel}:</label>
          <input type="text" id="firm-address" name="address" value="${address}" required />
        </div>
        <div class="form-group">
          <label for="firm-employees">${localizations.numberOfEmployeesLabel}:</label>
          <div id="firm-employees-slider"></div>
          <input type="hidden" id="firm-employees-range" name="employees_range" value="${employees_range}" />
          <div class="slider-values">${localizations.selectedRange}:
            <span id="min-employees">${minEmployees}</span>
            <span> - </span>
            <span id="max-employees">${maxEmployees}</span>
          </div>
        </div>`;
      initializeSlider(minEmployees, maxEmployees);
    } else if (role === "candidate") {
      roleSpecificFields.innerHTML += `
        <div class="form-group">
          <label for="candidate-email">${localizations.emailLabel}:</label>
          <input type="email" id="candidate-email" name="email" value="${email}" required />
        </div>
        <div class="form-group">
          <label for="candidate-first-name">${localizations.firstNameLabel}:</label>
          <input type="text" id="candidate-first-name" name="first_name" value="${first_name}" required />
        </div>
        <div class="form-group">
          <label for="candidate-last-name">${localizations.lastNameLabel}:</label>
          <input type="text" id="candidate-last-name" name="last_name" value="${last_name}" required />
        </div>`;
    }
  };

  const initializeSlider = (min, max) => {
    const slider = document.getElementById("firm-employees-slider");
    noUiSlider.create(slider, {
      start: [parseInt(min), parseInt(max)],
      connect: true,
      range: { min: 0, max: 500 },
      step: 1,
    });
    slider.noUiSlider.on("update", (values) => {
      const minValue = Math.round(values[0]);
      const maxValue = Math.round(values[1]);
      document.getElementById(
        "firm-employees-range"
      ).value = `${minValue}-${maxValue}`;
      document.getElementById("min-employees").textContent = minValue;
      document.getElementById("max-employees").textContent = maxValue;
    });
  };

  addUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (roleSelectContainer.style.display !== "none") {
      const roleSelect = document.getElementById("role-select");
      if (!roleSelect.value) {
        notyf.error(localizations.selectRoleAlert);
        return;
      }
    }

    const formData = new FormData(addUserForm);
    const userData = Object.fromEntries(formData);

    try {
      const response = await fetch(
        modalTitle.textContent === localizations.addUser
          ? "/admin/users/add"
          : `/admin/users/edit/${userData.id}`,
        {
          method:
            modalTitle.textContent === localizations.addUser ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        notyf.success(
          modalTitle.textContent === localizations.addUser
            ? localizations.userAddedSuccessfully
            : localizations.userUpdatedSuccessfully
        );
        closeModal();
        location.reload();
      } else {
        const error = await response.json();
        notyf.error(`${localizations.failedToProcessUser}: ${error.message}`);
      }
    } catch (error) {
      console.error(localizations.errorProcessingUser, error);
      notyf.error(localizations.anErrorOccurredProcessingUser);
    }
  });
});
