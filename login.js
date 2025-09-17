document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const loginBox = document.querySelector(".login-container");

  if (!username || !password) {
    loginBox.classList.add("shake");
    setTimeout(() => loginBox.classList.remove("shake"), 400);
    return;
  }

  // Look for existing profile
  let playerData = localStorage.getItem("lifeSim_" + username);

  if (!playerData) {
    // New agent profile
    playerData = {
      username: username,
      gold: 100,
      inventory: [ { item: "Health Potion", qty: 2 } ]
    };
    localStorage.setItem("lifeSim_" + username, JSON.stringify(playerData));
  }

  // Track current login
  localStorage.setItem("lifeSim_currentUser", username);

  // Hacker screen animation
  loginBox.style.display = "none";
  const hackerScreen = document.getElementById("hackerScreen");
  hackerScreen.style.display = "block";

  let lines = [
    ">>> INITIALIZING FIB MAINFRAME...",
    ">>> VALIDATING AGENT " + username + " ...",
    ">>> ACCESS CODE ACCEPTED...",
    ">>> LOADING AGENT DASHBOARD..."
  ];

  let i = 0, j = 0;
  function typeLine() {
    if (i < lines.length) {
      if (j < lines[i].length) {
        hackerScreen.textContent += lines[i][j];
        j++;
        setTimeout(typeLine, 20);
      } else {
        hackerScreen.textContent += "\n";
        i++; j = 0;
        setTimeout(typeLine, 120);
      }
    } else {
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    }
  }
  typeLine();
});

// Info popup
function toggleInfo() {
  const popup = document.getElementById("infoPopup");
  popup.style.display = (popup.style.display === "block") ? "none" : "block";
}
window.toggleInfo = toggleInfo;