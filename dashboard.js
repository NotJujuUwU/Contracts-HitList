// ========================
// SIDEBAR SECTION TOGGLER
// ========================
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
  document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
  event.target.classList.add("active");
}

// ========================
// PROFILE
// ========================
const username = localStorage.getItem("fibUser") || "Unknown Agent";
document.getElementById("agentName").textContent = username;
document.getElementById("profilePic").style.backgroundImage = "url('images/agent.png')";

// ========================
// CONTRACTS PERSISTENCE
// ========================
let contracts = JSON.parse(localStorage.getItem("contracts")) || [];
let myContracts = JSON.parse(localStorage.getItem("myContracts")) || [];

// Save to LS
function saveContracts() {
  localStorage.setItem("contracts", JSON.stringify(contracts));
  localStorage.setItem("myContracts", JSON.stringify(myContracts));
}

// ========================
// CONTRACT FORM TOGGLE
// ========================
function toggleContractForm() {
  const form = document.getElementById("contractForm");
  form.style.display = (form.style.display === "none" ? "block" : "none");
}
window.toggleContractForm = toggleContractForm;

// ========================
// CONTRACT SUBMISSION
// ========================
document.getElementById("contractForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const contract = {
    id: Date.now(),
    target: document.getElementById("targetName").value,
    description: document.getElementById("targetDesc").value,
    payment: document.getElementById("payment").value,
    phone: document.getElementById("phone").value,
    placedBy: username,
    claimedBy: null
  };

  contracts.push(contract);
  myContracts.push({ ...contract, tag: "Placed By Me" });

  saveContracts();   // 🔥 actually persist

  renderContracts();
  renderMyContracts();

  this.reset();
  this.style.display = "none";
});

// ========================
// RENDER ALL CONTRACTS
// ========================
function renderContracts() {
  const board = document.getElementById("contractsBoard");
  if (!board) return;
  board.innerHTML = "";
  contracts.forEach(c => {
    const div = document.createElement("div");
    div.className = "contract-card";
    div.innerHTML = `
      <h3>Target: ${c.target}</h3>
      <p>${c.description}</p>
      <p><b>Payment:</b> $${c.payment}</p>
      <p><b>Phone:</b> ${c.phone}</p>
      <span>Placed by: ${c.placedBy}</span><br>
      ${c.claimedBy ? `<span>Claimed by: ${c.claimedBy}</span>` :
        `<button onclick="claimContract(${c.id})">Claim Contract</button>`}
    `;
    board.appendChild(div);
  });
}

function renderMyContracts() {
  const board = document.getElementById("myContractsBoard");
  if (!board) return;
  board.innerHTML = "";
  myContracts.forEach(c => {
    const div = document.createElement("div");
    div.className = "contract-card";
    div.innerHTML = `
      <h3>Target: ${c.target}</h3>
      <p>${c.description}</p>
      <p><b>Payment:</b> $${c.payment}</p>
      <p><b>Phone:</b> ${c.phone}</p>
      <span>${c.tag}</span>
    `;
    board.appendChild(div);
  });
}

// ========================
// CLAIM CONTRACT
// ========================
function claimContract(id) {
  const c = contracts.find(ct => ct.id === id);
  if (c && !c.claimedBy) {
    c.claimedBy = username;
    myContracts.push({ ...c, tag: "Claimed By Me" });
    saveContracts();  // 🔥 persist update
  }
  renderContracts();
  renderMyContracts();
}
window.claimContract = claimContract;

// ========================
// INIT: on page load
// ========================
renderContracts();
renderMyContracts();