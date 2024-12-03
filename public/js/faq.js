// FAQ Interaktivnost
document.querySelectorAll(".faq-header").forEach((header) => {
    header.addEventListener("click", () => {
      const card = header.parentElement;
  
      // Zatvaranje svih drugih kartica
      document.querySelectorAll(".faq-card").forEach((c) => {
        if (c !== card) {
          c.classList.remove("open");
        }
      });
  
      // Otvaranje/zatvaranje kliknute kartice
      card.classList.toggle("open");
    });
  });
