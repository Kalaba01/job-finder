document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar");
  const interviews = JSON.parse(calendarEl.dataset.interviews || "[]");

  // Filter and map interview data into events for the calendar
  const events = interviews
  .filter((interview) => interview.status === "accepted")
  .map((interview) => ({
    id: interview.id,
    title: interview.candidateName,
    start: interview.scheduledDate
  }));

  // Initialize FullCalendar with the events and default view
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: events,
    eventClick: (info) => {
    },
  });

  // Render the calendar
  calendar.render();
});
