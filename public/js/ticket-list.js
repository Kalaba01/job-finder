document.addEventListener("DOMContentLoaded", () => {
  const statusFilter = document.getElementById("statusFilter");
  const searchInput = document.getElementById("searchInput");
  const ticketList = document.getElementById("ticketList");
  const noTicketsMessage = document.getElementById("noTicketsMessage");
  const createTicketButton = document.getElementById("createTicketButton");
  const ticketCreatePopup = document.getElementById("ticketCreatePopup");
  const closeTicketCreatePopup = document.getElementById("closeTicketCreatePopup");
  const ticketCreateForm = document.getElementById("ticketCreateForm");

  const filterAndSearchTickets = () => {
    const statusValue = statusFilter.value.toLowerCase();
    const searchValue = searchInput.value.toLowerCase();

    const tickets = ticketList.querySelectorAll(".ticket-item");

    let hasVisibleTickets = false;

    tickets.forEach((ticket) => {
      const title = ticket.querySelector("h3").textContent.toLowerCase();
      const status = ticket.querySelector("p:nth-of-type(2)").textContent.toLowerCase();

      const matchesStatus = statusValue === "all" || status.includes(statusValue);
      const matchesSearch = title.includes(searchValue);

      if (matchesStatus && matchesSearch) {
        ticket.style.display = "block";
        hasVisibleTickets = true;
      } else {
        ticket.style.display = "none";
      }
    });

    noTicketsMessage.style.display = hasVisibleTickets ? "none" : "block";
  };

  statusFilter.addEventListener("change", filterAndSearchTickets);
  searchInput.addEventListener("input", filterAndSearchTickets);

  ticketList.addEventListener("click", (event) => {
    const ticketItem = event.target.closest(".ticket-item");
    if (ticketItem) {
      const ticketId = ticketItem.getAttribute("data-id");
      const userRole = ticketItem.getAttribute("data-user-role");

      if (userRole) {
        window.location.href = `/${userRole}/tickets/${ticketId}`;
      } else {
        console.error("User role is not defined.");
      }
    }
  });

  filterAndSearchTickets();

  createTicketButton.addEventListener("click", () => {
    ticketCreatePopup.style.display = "flex";
  });

  closeTicketCreatePopup.addEventListener("click", () => {
    resetFormAndClosePopup();
  });

  ticketCreatePopup.addEventListener("click", (event) => {
    if (event.target === ticketCreatePopup) {
      resetFormAndClosePopup();
    }
  });

  const resetFormAndClosePopup = () => {
    ticketCreatePopup.style.display = "none";
    ticketCreateForm.reset();
    const fileInputs = ticketCreateForm.querySelectorAll("input[type='file']");
    fileInputs.forEach((fileInput) => {
      const label = fileInput.closest(".file-upload").querySelector("label");
      label.classList.remove("upload-success");
      label.classList.add("upload-ready");
    });
  };

  ticketCreateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(ticketCreateForm);

    try {
      const response = await fetch("/tickets", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Ticket created successfully!");
        resetFormAndClosePopup();
        location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create ticket.");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("An error occurred while creating the ticket.");
    }
  });

  window.handleFileUpload = (input) => {
    const label = input.closest(".file-upload").querySelector("label");
    if (input.files.length > 0) {
      label.classList.remove("upload-ready");
      label.classList.add("upload-success");
    } else {
      label.classList.remove("upload-success");
      label.classList.add("upload-ready");
    }
  };
});
