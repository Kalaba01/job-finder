const typingText = "Find Your Dream Job Today";
const typingElement = document.getElementById("typing-text");
let index = 0;

function typeEffect() {
  if (index < typingText.length) {
    typingElement.textContent += typingText[index];
    index++;
    setTimeout(typeEffect, 100);
  }
}


document.addEventListener("DOMContentLoaded", typeEffect);
