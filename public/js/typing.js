function typeEffect() {
  const typingElement = document.getElementById("typing-text");
  const typingText = typingElement.getAttribute("data-typing-text");
  let index = 0;

  typingElement.textContent = "";

  function type() {
    if (index < typingText.length) {
      typingElement.textContent += typingText[index];
      index++;
      setTimeout(type, 100);
    }
  }

  type();
}

document.addEventListener("DOMContentLoaded", typeEffect);
