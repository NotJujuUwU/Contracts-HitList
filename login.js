// Listen for login form submit
document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Demo valid credentials (you can replace with your values)
  const validUsername = "agent47";
  const validPassword = "classified";

  if (username === validUsername && password === validPassword) {
    // Save username (used later in dashboard)
    localStorage.setItem("fibUser", username);

    // Hide login card
    document.querySelector(".login-container").style.display = "none";

    // Show hacker animation
    const hackerScreen = document.getElementById("hackerScreen");
    hackerScreen.style.display = "block";

    // Hacker animation lines
    let lines = [
      ">>> INITIALIZING FIB MAINFRAME...",
      ">>> AUTHORIZATION BREACHED...",
      ">>> ENCRYPTION KEYS BYPASSED...",
      ">>> FIREWALL DISABLED...",
      ">>> LOADING CRIMINAL UNDERWORLD..."
    ];

    let i = 0, charIndex = 0;
    function typeLine() {
      if (i < lines.length) {
        if (charIndex < lines[i].length) {
          hackerScreen.textContent += lines[i][charIndex];
          charIndex++;
          setTimeout(typeLine, 20); // typing speed
        } else {
          hackerScreen.textContent += "\n";
          i++; charIndex = 0;
          setTimeout(typeLine, 120); // pause before next line
        }
      } else {
        setTimeout(() => { 
          window.location.href = "dashboard.html"; 
        }, 1000); // redirect after final line
      }
    }
    typeLine();

  } else {
    // Wrong login: Shake effect
    const loginBox = document.querySelector(".login-container");
    loginBox.classList.add("shake");

    // Remove shake class after animation ends
    setTimeout(() => {
      loginBox.classList.remove("shake");
    }, 400);

    // Remove old error if already shown
    let oldMsg = document.querySelector(".error");
    if (oldMsg) oldMsg.remove();

    // Show error
    const msg = document.createElement("p");
    msg.textContent = "Access Denied. Invalid credentials.";
    msg.style.color = "red";
    msg.className = "error";
    document.getElementById("loginForm").appendChild(msg);
  }
});

function toggleInfo() {
  const popup = document.getElementById("infoPopup");
  if (popup.style.display === "block") {
    popup.style.display = "none";
  } else {
    popup.style.display = "block";
  }
}