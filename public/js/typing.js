// Function to create a typing effect for text within an element
function typeEffect() {
  const typingElement = document.getElementById("typing-text");
  const typingText = typingElement.getAttribute("data-typing-text");
  let index = 0;

  typingElement.textContent = "";

  // Inner function to type one character at a time
  function type() {
    if (index < typingText.length) {
      typingElement.textContent += typingText[index];
      index++;
      setTimeout(type, 100);
    }
  }

  type();
}

// Start the typing effect once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", typeEffect);
