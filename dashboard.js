// ========================
// SIDEBAR TOGGLER
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
// STORAGE
// ========================
let contracts = JSON.parse(localStorage.getItem("contracts")) || [];
let myContracts = JSON.parse(localStorage.getItem("myContracts")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

function saveContracts() {
  localStorage.setItem("contracts", JSON.stringify(contracts));
  localStorage.setItem("myContracts", JSON.stringify(myContracts));
  localStorage.setItem("history", JSON.stringify(history));
}

// ========================
// TOGGLE CONTRACT FORM
// ========================
function toggleContractForm() {
  const form = document.getElementById("contractForm");
  form.style.display = (form.style.display === "none" || form.style.display === "") 
    ? "block" 
    : "none";
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
    bank: document.getElementById("bank").value,
    placedBy: username,
    claimedBy: null,
    proofUrl: null,
    status: "Open"
  };

  contracts.push(contract);

  // Poster always gets it in My Contracts
  myContracts.push({ ...contract, tag: "Placed By Me" });

  saveContracts();
  renderContracts();
  renderMyContracts();

  this.reset();
  this.style.display = "none";
});

// ========================
// RENDER Contracts (Public Board)
// ========================
function renderContracts() {
  const board = document.getElementById("contractsBoard");
  if (!board) return;
  board.innerHTML = "";

  contracts.forEach(c => {
    // Don’t show if claimed, completed, or paid
    if (c.status === "Paid" || c.status === "Completed" || c.claimedBy) return;

    const div = document.createElement("div");
    div.className = "contract-card";

    div.innerHTML = `
      <h3>Target: ${c.target}</h3>
      <p>${c.description}</p>
      <p><b>Payment:</b> $${c.payment}</p>
      <p><b>Phone:</b> ${c.phone}</p>
      <p><b>Bank:</b> ${c.bank}</p>
      <span>Placed by: ${c.placedBy}</span><br>
      <button onclick="claimContract(${c.id})">Claim Contract</button>
    `;
    board.appendChild(div);
  });
}

// ========================
// RENDER My Contracts
// ========================
function renderMyContracts() {
  const board = document.getElementById("myContractsBoard");
  if (!board) return;
  board.innerHTML = "";

  myContracts.forEach(c => {
    if (c.status === "Paid") return; // Paid go to history

    let extra = "";
    if (c.placedBy === username && c.proofUrl && c.status === "Open") {
      extra = `<button onclick="confirmProof(${c.id})">Confirm Proof</button>`;
    } else if (c.placedBy === username && c.status === "Completed") {
      extra = `<button onclick="sendMoney(${c.id})">Money Sent</button>`;
    } else if (c.claimedBy === username && c.status === "Open") {
      extra = `
        <button onclick="showProofForm(${c.id})">Send Proof</button>
        <div id="proofForm-${c.id}" style="display:none; margin-top:10px;">
          <input type="text" id="proofUrl-${c.id}" placeholder="Paste proof URL">
          <button onclick="submitProof(${c.id})">Submit</button>
        </div>
      `;
    } else if (c.claimedBy === username && c.status === "Completed") {
      extra = `<span style="color:orange;">Awaiting Payment</span>`;
    }

    board.innerHTML += `
      <div class="contract-card">
        <h3>Target: ${c.target}</h3>
        <p>${c.description}</p>
        <p><b>Payment:</b> $${c.payment}</p>
        <p><b>Phone:</b> ${c.phone}</p>
        <p><b>Bank:</b> ${c.bank}</p>
        <span>${c.tag}</span><br>
        ${c.proofUrl ? `<p><b>Proof:</b> <a href="${c.proofUrl}" target="_blank">${c.proofUrl}</a></p>` : ""}
        ${extra}
      </div>
    `;
  });
}

// ========================
// RENDER History
// ========================
function renderHistory() {
  const board = document.getElementById("historyBoard");
  if (!board) return;
  board.innerHTML = "";

  history.forEach(c => {
    board.innerHTML += `
      <div class="contract-card">
        <h3>Target: ${c.target}</h3>
        <p>${c.description}</p>
        <p><b>Payment:</b> $${c.payment}</p>
        <p><b>Phone:</b> ${c.phone}</p>
        <p><b>Bank:</b> ${c.bank}</p>
        <span>Placed by: ${c.placedBy}</span><br>
        ${c.claimedBy ? `<p><b>Claimed by:</b> ${c.claimedBy}</p>` : ""}
        ${c.proofUrl ? `<p><b>Proof:</b> <a href="${c.proofUrl}" target="_blank">${c.proofUrl}</a></p>` : ""}
        <p style="color:lime;">✅ Contract Closed & Archived</p>
      </div>
    `;
  });
}

// ========================
// ACTIONS
// ========================
function claimContract(id) {
  const c = contracts.find(ct => ct.id === id);
  if (c && !c.claimedBy) {
    c.claimedBy = username;

    // Remove any existing versions of this contract in myContracts (avoid duplicates)
    myContracts = myContracts.filter(ct => ct.id !== id);

    if (c.placedBy === username) {
      myContracts.push({ ...c, tag: "Placed By Me" });
    } else {
      myContracts.push({ ...c, tag: "Claimed By Me" });
    }
    saveContracts();
  }
  renderContracts();
  renderMyContracts();
}
window.claimContract = claimContract;

function showProofForm(id) {
  document.getElementById(`proofForm-${id}`).style.display = "block";
}
window.showProofForm = showProofForm;

function submitProof(id) {
  const url = document.getElementById(`proofUrl-${id}`).value.trim();
  if (url !== "") {
    const c = contracts.find(ct => ct.id === id);
    if (c && c.claimedBy === username) {
      c.proofUrl = url;
      const mc = myContracts.find(ct => ct.id === id);
      if (mc) mc.proofUrl = url;
      saveContracts();
      renderContracts();
      renderMyContracts();
    }
  }
}
window.submitProof = submitProof;

function confirmProof(id) {
  const c = contracts.find(ct => ct.id === id);
  if (c && c.placedBy === username && c.proofUrl) {
    c.status = "Completed";
    const mc = myContracts.find(ct => ct.id === id);
    if (mc) mc.status = "Completed";
    saveContracts();
    renderContracts();
    renderMyContracts();
  }
}
window.confirmProof = confirmProof;

function sendMoney(id) {
  const c = contracts.find(ct => ct.id === id);
  if (c && c.placedBy === username && c.status === "Completed") {
    c.status = "Paid";
    history.push(c);

    // Remove from active arrays
    contracts = contracts.filter(ct => ct.id !== id);
    myContracts = myContracts.filter(ct => ct.id !== id);

    saveContracts();
    renderContracts();
    renderMyContracts();
    renderHistory();
  }
}
window.sendMoney = sendMoney;

// ========================
// INIT
// ========================
renderContracts();
renderMyContracts();
renderHistory();