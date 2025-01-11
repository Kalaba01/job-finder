document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar");
  const interviews = JSON.parse(calendarEl.dataset.interviews || "[]");

  const events = interviews.map((interview) => ({
    id: interview.id,
    title: interview.candidateName,
    start: interview.scheduledDate,
  }));

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: events,
    eventClick: (info) => {
    },
  });

  calendar.render();
});
