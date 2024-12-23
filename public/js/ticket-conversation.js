import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  const ticketDataElement = document.getElementById("ticketData");
  const ticketId = parseInt(ticketDataElement.dataset.ticketId, 10);
  const senderRole = ticketDataElement.dataset.senderRole;

  const ticketMessageForm = document.getElementById("ticketMessageForm");
  const ticketMessageInput = document.getElementById("ticketMessageInput");
  const ticketMessageList = document.getElementById("ticketMessageList");

  const socket = io("/", {
    withCredentials: true
  });

  socket.emit("join-ticket", ticketId);

  socket.on("new-message", (message) => {
    displayMessage(message);
  });

  ticketMessageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = ticketMessageInput.value.trim();
    if (message) {
      socket.emit("send-message", { ticketId, message, senderRole });
      ticketMessageInput.value = "";
    }
  });

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
});
