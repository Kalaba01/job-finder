document.addEventListener("DOMContentLoaded", () => {
  const jobAdsListContainer = document.getElementById("job-ads-list-container");
  const jobAdsList = document.getElementById("job-ads-list");
  const searchBar = document.getElementById("search-bar");
  const statusFilter = document.getElementById("status-filter");
  const createJobAdBtn = document.getElementById("create-job-ad-btn");
  const jobAdCreateModal = document.getElementById("job-ad-create-modal");
  const closeCreateModalBtn = document.getElementById("close-create-modal");
  const dropdownButton = document.getElementById("dropdown-button");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const checkboxes = document.querySelectorAll(".document-checkbox");
  const requiredDocumentsJsonInput = document.getElementById("required_documents_json");

  const addQuestionBtn = document.getElementById("add-question-btn");
  const customQuestionsContainer = document.getElementById("custom-questions-container");
  const customQuestionsJsonInput = document.getElementById("custom_questions_json");

  const questionModal = document.getElementById("custom-question-modal");
  const closeQuestionModal = document.getElementById("close-question-modal");
  const saveQuestionBtn = document.getElementById("save-question-btn");

  const questionText = document.getElementById("question-text");
  const questionType = document.getElementById("question-type");
  const optionsContainer = document.getElementById("options-container");
  const optionsList = document.getElementById("options-list");
  const addOptionBtn = document.getElementById("add-option-btn");
  const questionRequired = document.getElementById("question-required");

  const localizations = {
    noAdsMessage: document.body.dataset.noAdsMessage,
    remove: document.body.dataset.remove
  };

  const noAdsMessage = document.createElement("p");
  noAdsMessage.id = "no-ads-message";
  noAdsMessage.className = "no-ads-message";

  let questions = [];

  addQuestionBtn.addEventListener("click", () => {
    clearQuestionForm();
    questionModal.style.display = "block";
  });

  closeQuestionModal.addEventListener("click", () => {
    questionModal.style.display = "none";
  });

  questionType.addEventListener("change", () => {
    if (["dropdown", "radio", "checkbox"].includes(questionType.value)) {
      optionsContainer.style.display = "block";
    } else {
      optionsContainer.style.display = "none";
      optionsList.innerHTML = "";
    }
  });

  addOptionBtn.addEventListener("click", () => {
    const optionInput = optionsContainer.querySelector("#option-input");
    if (!optionInput) {
      console.error("Option input field not found.");
      return;
    }

    if (optionInput.value.trim() === "") {
      alert("Option cannot be empty");
      return;
    }

    const optionItems = optionsList.querySelectorAll(".option-item");
    if (optionItems.length >= 5) {
      alert("You can add up to 5 options only.");
      return;
    }

    const optionItem = document.createElement("div");
    optionItem.classList.add("option-item");
    optionItem.setAttribute("data-option", optionInput.value);
    optionItem.textContent = optionInput.value;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-option-btn");
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", () => {
      optionItem.remove();
    });

    optionItem.appendChild(removeBtn);
    optionsList.appendChild(optionItem);

    optionInput.value = "";
  });

  saveQuestionBtn.addEventListener("click", () => {
    const options = Array.from(
      optionsList.querySelectorAll(".option-item")
    ).map((item) => item.getAttribute("data-option"));

    const newQuestion = {
      id: questions.length + 1,
      question: questionText.value,
      type: questionType.value,
      options: options.length > 0 ? options : null,
      required: questionRequired.checked,
    };

    questions.push(newQuestion);
    updateQuestionsDisplay();
    questionModal.style.display = "none";
  });

  function updateQuestionsDisplay() {
    customQuestionsContainer.innerHTML = "";
    questions.forEach((q, index) => {
      const questionCard = document.createElement("div");
      questionCard.classList.add("question-card");
  
      questionCard.innerHTML = `
        <strong>${q.question}</strong> (${q.type}) 
        ${q.required ? "<span>(Required)</span>" : ""}
        ${
          q.options
            ? `<ul>${q.options.map((opt) => `<li>${opt}</li>`).join("")}</ul>`
            : ""
        }
        <button class="remove-question-btn" data-index="${index}">${localizations.remove}</button>
      `;
  
      customQuestionsContainer.appendChild(questionCard);
    });
  
    customQuestionsJsonInput.value = JSON.stringify(questions);
  
    const removeButtons = customQuestionsContainer.querySelectorAll(
      ".remove-question-btn"
    );
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        removeQuestion(index);
      });
    });
  }
  
  function removeQuestion(index) {
    questions.splice(index, 1);
    updateQuestionsDisplay();
  }  

  function clearQuestionForm() {
    questionText.value = "";
    questionType.value = "text";
    optionsList.innerHTML = "";
    optionsList.innerHTML = `
      <div class="option-input-container">
        <input
          type="text"
          id="option-input"
          placeholder="Enter option"
          class="option-input"
        />
      </div>
    `;
    questionRequired.checked = false;
    optionsContainer.style.display = "none";
  }

  createJobAdBtn.addEventListener("click", () => {
    jobAdCreateModal.style.display = "block";
  });

  closeCreateModalBtn.addEventListener("click", () => {
    jobAdCreateModal.style.display = "none";
  });

  dropdownButton.addEventListener("click", (event) => {
    dropdownMenu.classList.toggle("show");
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (
      !dropdownMenu.contains(event.target) &&
      !dropdownButton.contains(event.target)
    ) {
      dropdownMenu.classList.remove("show");
    }
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const selectedDocuments = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);
      requiredDocumentsJsonInput.value = JSON.stringify(selectedDocuments);
    });
  });

  const filterJobAds = () => {
    const searchQuery = searchBar.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    let visibleCount = 0;

    if (jobAdsList) {
      Array.from(jobAdsList.children).forEach((jobCard) => {
        const title = jobCard.getAttribute("data-title");
        const status = jobCard.getAttribute("data-status");

        const matchesSearch = title.includes(searchQuery);
        const matchesStatus = !selectedStatus || status === selectedStatus;

        const isVisible = matchesSearch && matchesStatus;
        jobCard.style.display = isVisible ? "block" : "none";

        if (isVisible) visibleCount++;
      });
    }

    if (visibleCount === 0) {
      if (!document.getElementById("no-ads-message")) {
        noAdsMessage.textContent = localizations.noAdsMessage;
        jobAdsListContainer.appendChild(noAdsMessage);
      }
    } else {
      const existingMessage = document.getElementById("no-ads-message");
      if (existingMessage) {
        existingMessage.remove();
      }
    }
  };

  searchBar.addEventListener("input", filterJobAds);
  statusFilter.addEventListener("change", filterJobAds);
});
