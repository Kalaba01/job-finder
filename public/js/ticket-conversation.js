import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  const ticketDataElement = document.getElementById("ticketData");
  const ticketId = parseInt(ticketDataElement.dataset.ticketId, 10);
  const senderRole = ticketDataElement.dataset.senderRole;

  const ticketMessageForm = document.getElementById("ticketMessageForm");
  const ticketMessageInput = document.getElementById("ticketMessageInput");
  const ticketMessageList = document.getElementById("ticketMessageList");
  const resolveTicketButton = document.getElementById("resolveTicketButton");

  const localizations = {
    resolvedNotice: document.body.dataset.resolvedNotice
  };

  const socket = io("/", {
    withCredentials: true
  });

  socket.emit("join-ticket", ticketId);

  socket.on("new-message", (message) => {
    displayMessage(message);
  });

  socket.on("ticket-resolved", (data) => {
    if (data.ticketId === ticketId) updateResolvedUI();
  });

  ticketMessageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = ticketMessageInput.value.trim();
    if (message) {
      socket.emit("send-message", { ticketId, message, senderRole });
      ticketMessageInput.value = "";
    }
  });

  if (resolveTicketButton) {
    resolveTicketButton.addEventListener("click", async () => {
      try {
        const response = await fetch(`/tickets/resolve/${ticketId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (response.ok) socket.emit("mark-resolved", ticketId);
        else alert("Failed to mark ticket as resolved.");
      } catch (error) {
        console.error("Error resolving ticket:", error);
        alert("An error occurred while marking the ticket as resolved.");
      }
    });
  }

  const displayMessage = (message) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `ticket-message ${message.sender_id === parseInt(ticketDataElement.dataset.userId, 10) ? 'sent' : 'received'}`;
    messageDiv.innerHTML = `
      <p class="ticket-message-meta">
        <strong>${message.sender_name || "Unknown"}</strong>
        <span>${new Date(message.createdAt).toLocaleString()}</span>
      </p>
      <p class="ticket-message-content">${message.message}</p>
    `;
    ticketMessageList.appendChild(messageDiv);
    ticketMessageList.scrollTop = ticketMessageList.scrollHeight;
  };

  const updateResolvedUI = () => {
    document.querySelector(".ticket-info .ticket-status").textContent = "resolved";
    if (resolveTicketButton) resolveTicketButton.remove();
  
      ticketMessageForm.classList.add("resolved");
      ticketMessageInput.setAttribute("placeholder", localizations.resolvedNotice);
      ticketMessageInput.setAttribute("disabled", true);
      ticketMessageForm.querySelector(".ticket-send-btn").setAttribute("disabled", true);
  }
});
