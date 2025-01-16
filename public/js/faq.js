document.querySelectorAll(".faq-header").forEach((header) => {
  header.addEventListener("click", () => {
    const card = header.parentElement;

    // Close all other FAQ cards
    document.querySelectorAll(".faq-card").forEach((c) => {
      if (c !== card) {
        c.classList.remove("open");
      }
    });

    // Toggle the 'open' class on the clicked card
    card.classList.toggle("open");
  });
});
