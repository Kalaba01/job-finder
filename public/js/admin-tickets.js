document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const ticketList = document.getElementById("ticketList");

  // Initialize notification system (Notyf)
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top",
    },
  });

  // Localization strings
  const localizations = {
    noTicketsMessage: document.body.dataset.noTicketsMessage
  };

  // Create and style the "No Tickets" message element
  const noTicketsMessage = document.createElement("p");
  noTicketsMessage.id = "noTicketsMessage";
  noTicketsMessage.textContent = localizations.noTicketsMessage;
  noTicketsMessage.style.textAlign = "center";
  noTicketsMessage.style.color = "#999";
  noTicketsMessage.style.fontSize = "16px";
  noTicketsMessage.style.display = "none";
  ticketList.parentElement.appendChild(noTicketsMessage);

  // Function to filter and search tickets based on input and status
  const filterAndSearchTickets = () => {
    const searchValue = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value.toLowerCase();

    const tickets = ticketList.querySelectorAll(".ticket-card");
    let hasVisibleTickets = false;

    tickets.forEach((ticket) => {
      const title = ticket
        .querySelector(".ticket-title")
        .textContent.toLowerCase();
      const status = ticket
        .querySelector(".ticket-status")
        .textContent.toLowerCase();

      const matchesSearch = title.includes(searchValue);
      const matchesStatus =
        statusValue === "all" || status.includes(statusValue);

      if (matchesSearch && matchesStatus) {
        ticket.style.display = "flex";
        hasVisibleTickets = true;
      } else {
        ticket.style.display = "none";
      }
    });

    // Show or hide the "No Tickets" message based on visibility
    noTicketsMessage.style.display = hasVisibleTickets ? "none" : "block";
  };

  searchInput.addEventListener("input", filterAndSearchTickets);
  statusFilter.addEventListener("change", filterAndSearchTickets);

  // Handle ticket view button clicks
  ticketList.addEventListener("click", (event) => {
    const viewButton = event.target.closest(".view-btn");
    if (viewButton) {
      const ticketCard = viewButton.closest(".ticket-card");
      const ticketId = ticketCard.dataset.id;

      if (!ticketId) {
        notyf.error("Error: Ticket ID is missing.");
        return;
      }

      window.location.href = `/admin/tickets/${ticketId}`;
    }
  });

  filterAndSearchTickets();
});
