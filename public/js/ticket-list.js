document.addEventListener("DOMContentLoaded", () => {
  const statusFilter = document.getElementById("statusFilter");
  const searchInput = document.getElementById("searchInput");
  const ticketList = document.getElementById("ticketList");
  const noTicketsMessage = document.getElementById("noTicketsMessage");

  const filterAndSearchTickets = () => {
    const statusValue = statusFilter.value.toLowerCase();
    const searchValue = searchInput.value.toLowerCase();

    const tickets = ticketList.querySelectorAll(".ticket-item");

    let hasVisibleTickets = false;

    tickets.forEach((ticket) => {
      const title = ticket.querySelector("h3").textContent.toLowerCase();
      const status = ticket.querySelector("p:nth-of-type(2)").textContent.toLowerCase();

      const matchesStatus =
        statusValue === "all" || status.includes(statusValue);
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
      console.log(`Clicked ticket ID: ${ticketId}`);
      // Placeholder za buduću funkcionalnost
    }
  });

  filterAndSearchTickets();
});
