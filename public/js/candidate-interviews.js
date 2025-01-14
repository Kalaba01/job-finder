import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const calendarEl = document.getElementById("calendar");
  const body = document.body;

  const localization = {
    acceptTitle: body.dataset.acceptTitle,
    acceptMessage: body.dataset.acceptMessage,
    rejectTitle: body.dataset.rejectTitle,
    rejectMessage: body.dataset.rejectMessage,
    noAdditionalNotes: body.dataset.noAdditionalNotes,
    dateLabel: body.dataset.dateLabel,
    noteLabel: body.dataset.noteLabel,
  };

  let interviews = JSON.parse(body.dataset.interviews || "[]");

  const getAcceptedInterviews = () =>
    interviews
      .filter((invite) => invite.status === "accepted")
      .map((invite) => ({
        title: invite.Firm?.name || "Interview",
        start: invite.scheduled_date,
        extendedProps: {
          note: invite.note,
          status: invite.status
        }
      }));

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: getAcceptedInterviews(),
    eventClick: (info) => {
      const { note, status } = info.event.extendedProps;
    }
  });
  calendar.render();

  document.querySelectorAll(".accept-btn").forEach((button) =>
    button.addEventListener("click", () => {
      openConfirmModal({
        title: localization.acceptTitle,
        message: localization.acceptMessage,
        id: button.dataset.id,
        action: "accepted",
        onConfirm: (id) => updateInterviewStatus(id, "accepted"),
      });
    })
  );

  document.querySelectorAll(".reject-btn").forEach((button) =>
    button.addEventListener("click", () => {
      openConfirmModal({
        title: localization.rejectTitle,
        message: localization.rejectMessage,
        id: button.dataset.id,
        action: "rejected",
        onConfirm: (id) => updateInterviewStatus(id, "rejected"),
      });
    })
  );

  const updateInterviewStatus = (id, status) => {
    socket.emit("update-status", { inviteId: id, status });
  };

  socket.on("status-updated", (updatedInvite) => {
    const index = interviews.findIndex((invite) => invite.id === updatedInvite.id);
    if (index > -1) {
      interviews[index] = updatedInvite;
    }
  
    refreshPendingInterviews();
    calendar.removeAllEvents();
    calendar.addEventSource(getAcceptedInterviews());
  });  

  const refreshPendingInterviews = () => {
    const list = document.querySelector("#interview-list ul");
    list.innerHTML = "";
    interviews
      .filter((invite) => invite.status === "pending")
      .forEach((invite) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <p>
            <strong>${localization.dateLabel}:</strong> ${new Date(invite.scheduled_date).toLocaleString(body.dataset.locale)}<br />
            <strong>${localization.noteLabel}:</strong> ${invite.note || "No additional notes"}
          </p>
          <button class="accept-btn" data-id="${invite.id}">${localization.acceptTitle}</button>
          <button class="reject-btn" data-id="${invite.id}">${localization.rejectTitle}</button>
        `;
        listItem.querySelector(".accept-btn").addEventListener("click", () =>
          openConfirmModal({
            title: localization.acceptTitle,
            message: localization.acceptMessage,
            id: invite.id,
            action: "accepted",
            onConfirm: (id) => updateInterviewStatus(id, "accepted"),
          })
        );
        listItem.querySelector(".reject-btn").addEventListener("click", () =>
          openConfirmModal({
            title: localization.rejectTitle,
            message: localization.rejectMessage,
            id: invite.id,
            action: "rejected",
            onConfirm: (id) => updateInterviewStatus(id, "rejected"),
          })
        );
        list.appendChild(listItem);
      });
  };
});
