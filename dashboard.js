// ========================
// Section Toggle
// ========================
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
  document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
  event.target.classList.add("active");

  if (id === "leaderboard") renderLeaderboard();
}

// ========================
// Agent Profile Stats
// ========================
const username = localStorage.getItem("fibUser") || "Unknown Agent";
document.getElementById("agentName").textContent = username;
document.getElementById("profilePic").style.backgroundImage = "url('images/agent.png')";

let agents = JSON.parse(localStorage.getItem("agents")) || {};
if (!agents[username]) {
  agents[username] = { completed: 0, failed: 0, earnings: 0 };
}

function renderProfile() {
  const stats = agents[username];
  document.getElementById("profileName").textContent = username;
  document.getElementById("completedCount").textContent = stats.completed;
  document.getElementById("failedCount").textContent = stats.failed;
  document.getElementById("earnings").textContent = stats.earnings;

  const total = stats.completed + stats.failed;
  const success = total > 0 ? Math.round((stats.completed / total) * 100) : 0;
  document.getElementById("successRate").textContent = success + "%";

  const rep = (stats.completed * 2) - stats.failed;
  document.getElementById("repScore").textContent = rep;

  let rank = "Recruit";
  if (stats.completed >= 1 && stats.completed < 5) rank = "Enforcer";
  else if (stats.completed >= 5 && stats.completed < 10) rank = "Silent Assassin";
  else if (stats.completed >= 10 && stats.completed < 20) rank = "Master Hitman";
  else if (stats.completed >= 20) rank = "The Bay Harbour Butcher";

  document.getElementById("agentRank").textContent = rank;
  localStorage.setItem("agents", JSON.stringify(agents));
}

// ========================
// Storage
// ========================
let contracts = JSON.parse(localStorage.getItem("contracts")) || [];
let myContracts = JSON.parse(localStorage.getItem("myContracts")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

function saveContracts() {
  localStorage.setItem("contracts", JSON.stringify(contracts));
  localStorage.setItem("myContracts", JSON.stringify(myContracts));
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("agents", JSON.stringify(agents));
  renderLeaderboard();
}

// ========================
// Contract Form Submit
// ========================
function toggleContractForm() {
  const form = document.getElementById("contractForm");
  form.style.display = (form.style.display === "none" || form.style.display === "") ? "block" : "none";
}
window.toggleContractForm = toggleContractForm;

document.getElementById("contractForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const expiryHours = parseInt(document.getElementById("expiryHours").value) || 24;
  const anonymous = document.getElementById("isAnonymous").checked;

  const contract = {
    id: Date.now(),
    target: document.getElementById("targetName").value,
    description: document.getElementById("targetDesc").value,
    payment: document.getElementById("payment").value,
    phone: document.getElementById("phone").value,
    assassinBank: null,
    placedBy: username,
    claimedBy: null,
    proofUrl: null,
    status: "Open",
    expiresAt: Date.now() + (expiryHours * 60 * 60 * 1000),
    anonymous: anonymous
  };
  contracts.push(contract);
  myContracts.push({ ...contract, tag: "Placed By Me" });
  saveContracts(); renderContracts(); renderMyContracts();
  this.reset(); this.style.display = "none";
});

// ========================
// Expiration Check
// ========================
function checkExpiredContracts() {
  const now = Date.now();
  const expired = contracts.filter(c => c.expiresAt && c.expiresAt < now && c.status === "Open");
  expired.forEach(c => {
    if (c.claimedBy) {
      if (!agents[c.claimedBy]) agents[c.claimedBy] = { completed: 0, failed: 0, earnings: 0 };
      agents[c.claimedBy].failed++;
      c.status = "Failed";
      history.push(c);
    } else {
      c.status = "Expired";
      history.push(c);
    }
  });

  contracts = contracts.filter(c => !(c.status === "Failed" || c.status === "Expired"));
  myContracts = myContracts.filter(c => !(c.status === "Failed" || c.status === "Expired"));
  saveContracts();
  renderContracts(); renderMyContracts(); renderHistory(); renderProfile();
}
setInterval(checkExpiredContracts, 60000);
checkExpiredContracts();

// ========================
// Render Contracts
// ========================
function renderContracts() {
  const board=document.getElementById("contractsBoard"); if(!board) return;
  board.innerHTML="";
  contracts.forEach(c=>{
    if(c.status==="Paid"||c.status==="Completed"||c.claimedBy) return;
    const hoursLeft=Math.floor((c.expiresAt - Date.now())/3600000);
    const expired=hoursLeft < 0;
    const placedBy = c.anonymous ? `<span class="anonymous">Anonymous</span>` : c.placedBy;

    board.innerHTML+=`
      <div class="contract-card">
        <h3>Target: ${c.target}</h3>
        <p>${c.description}</p>
        <p><b>Payment:</b> $${c.payment}</p>
        <p><b>Phone:</b> ${c.phone}</p>
        <p class="expiration ${expired?"expired":""}">
          ${expired? "❌ Expired" : `⏳ Expires in ${hoursLeft}h`}
        </p>
        <span>Placed by: ${placedBy}</span><br>
        <button onclick="showClaimForm(${c.id})">Claim Contract</button>
        <div id="claimForm-${c.id}" class="claim-form" style="display:none;">
          <label>Enter Your Bank Number</label>
          <input type="text" id="claimBank-${c.id}" placeholder="Bank #">
          <button onclick="submitClaim(${c.id})">Confirm Claim</button>
        </div>
      </div>`;
  });
}

// ========================
// Inline Claim Process
// ========================
function showClaimForm(id) {
  document.getElementById(`claimForm-${id}`).style.display = "block";
}
window.showClaimForm = showClaimForm;

function submitClaim(id) {
  const c = contracts.find(ct => ct.id === id);
  const bankField = document.getElementById(`claimBank-${id}`);
  const bankNum = bankField.value.trim();
  if (!bankNum) return alert("You must enter your bank number to claim.");

  if (c && !c.claimedBy) {
    c.claimedBy = username;
    c.assassinBank = bankNum;
    myContracts = myContracts.filter(ct => ct.id !== id);
    if (c.placedBy === username) {
      myContracts.push({ ...c, tag: "Placed By Me" });
    } else {
      myContracts.push({ ...c, tag: "Claimed By Me" });
    }
    saveContracts();
  }
  renderContracts(); renderMyContracts();
}
window.submitClaim = submitClaim;

// ========================
// FAIL & EXPIRE ACTIONS
// ========================
function failContract(id) {
  const c = contracts.find(ct => ct.id === id);
  if (c && c.placedBy === username && c.claimedBy) {
    c.status = "Failed";
    if (!agents[c.claimedBy]) agents[c.claimedBy] = { completed:0, failed:0, earnings:0 };
    agents[c.claimedBy].failed++;
    history.push(c);
    contracts=contracts.filter(ct=>ct.id!==id);
    myContracts=myContracts.filter(ct=>ct.id!==id);
    saveContracts(); renderContracts(); renderMyContracts(); renderHistory(); renderProfile();
  }
}
window.failContract = failContract;

function expireContract(id) {
  const c = contracts.find(ct => ct.id === id);
  if (c && c.placedBy === username) {
    c.status = "Expired";
    history.push(c);
    contracts=contracts.filter(ct=>ct.id!==id);
    myContracts=myContracts.filter(ct=>ct.id!==id);
    saveContracts(); renderContracts(); renderMyContracts(); renderHistory(); renderProfile();
  }
}
window.expireContract = expireContract;

// ========================
// Render My Contracts
// ========================
function renderMyContracts() {
  const board=document.getElementById("myContractsBoard"); if(!board) return;
  board.innerHTML="";
  myContracts.forEach(c=>{
    if(c.status==="Paid") return;
    let extra="";
    if(c.placedBy===username && c.proofUrl && c.status==="Open"){
      extra=`
        <button onclick="confirmProof(${c.id})">Confirm Proof</button>
        <button style="background:#aa0000" onclick="failContract(${c.id})">Fail Contract</button>`;
    } else if(c.placedBy===username && c.status==="Completed"){
      extra=`<button onclick="sendMoney(${c.id})">Money Sent</button>
              <button style="background:#aa0000" onclick="failContract(${c.id})">Fail Contract</button>`;
    } else if(c.claimedBy===username && c.status==="Open"){
      extra=`
        <button onclick="showProofForm(${c.id})">Send Proof</button>
        <div id="proofForm-${c.id}" style="display:none;margin-top:10px;">
          <input type="text" id="proofUrl-${c.id}" placeholder="Paste proof URL">
          <button onclick="submitProof(${c.id})">Submit</button>
        </div>`;
    } else if(c.claimedBy===username && c.status==="Completed"){
      extra=`<span style="color:orange;">Awaiting Payment</span>`;
    }
    if(c.placedBy===username && (c.status==="Open" || c.status==="Completed")){
      extra += `<button style="background:#555;margin-top:5px;" onclick="expireContract(${c.id})">Expire Contract</button>`;
    }
    const hoursLeft = Math.floor((c.expiresAt - Date.now()) / 3600000);
    board.innerHTML+=`
      <div class="contract-card">
        <h3>Target: ${c.target}</h3>
        <p>${c.description}</p>
        <p><b>Payment:</b> $${c.payment}</p>
        <p><b>Phone:</b> ${c.phone}</p>
        ${c.assassinBank ? `<p><b>Assassin's Bank Details:</b> ${c.assassinBank}</p>` : ""}
        <p class="expiration ${hoursLeft<0 ?"expired":""}">
          ${hoursLeft<0?"❌ Expired":`⏳ Expires in ${hoursLeft}h`}
        </p>
        <span>${c.tag}</span><br>
        ${c.proofUrl?`<p><b>Proof:</b><a href="${c.proofUrl}" target="_blank">${c.proofUrl}</a></p>`:""}
        ${extra}
      </div>`;
  });
}

// ========================
// Casefile History
// ========================
function renderHistory() {
  const board=document.getElementById("historyBoard"); if(!board) return;
  board.innerHTML="";
  history.forEach(c=>{
    let statusClass="", stampText="";
    if(c.status==="Failed"){ statusClass="failed"; stampText="FAILED"; }
    else if(c.status==="Expired"){ statusClass="expired"; stampText="EXPIRED"; }
    else { statusClass="completed"; stampText="COMPLETED"; }
    board.innerHTML+=`
    <div class="casefile">
      <span class="stamp ${statusClass}">${stampText}</span>
      <h3>Target: ${c.target}</h3>
      <p><b>Description:</b> ${c.description}</p>
      <p><b>Payment:</b> $${c.payment}</p>
      <p><b>Phone:</b> ${c.phone}</p>
      ${c.assassinBank?`<p><b>Assassin's Bank:</b> ${c.assassinBank}</p>`:""}
      <p><b>Placed by:</b> ${c.placedBy}</p>
      ${c.claimedBy?`<p><b>Claimed by:</b> ${c.claimedBy}</p>`:""}
      ${c.proofUrl?`<div class="proof"><b>Proof Evidence:</b> <a href="${c.proofUrl}" target="_blank">${c.proofUrl}</a></div>`:""}
    </div>`;
  });
}

// ========================
// Proof / Confirm / Payment
// ========================
function showProofForm(id){ document.getElementById(`proofForm-${id}`).style.display="block"; }
window.showProofForm=showProofForm;

function submitProof(id){
  const url=document.getElementById(`proofUrl-${id}`).value.trim();
  if(url!==""){
    const c=contracts.find(ct=>ct.id===id);
    if(c && c.claimedBy===username){
      c.proofUrl=url;
      const mc=myContracts.find(ct=>ct.id===id);
      if(mc) mc.proofUrl=url;
      saveContracts(); renderContracts(); renderMyContracts();
    }
  }
}
window.submitProof=submitProof;

function confirmProof(id){
  const c=contracts.find(ct=>ct.id===id);
  if(c && c.placedBy===username && c.proofUrl){
    c.status="Completed";
    const mc=myContracts.find(ct=>ct.id===id);
    if(mc) mc.status="Completed";
    saveContracts(); renderContracts(); renderMyContracts();
  }
}
window.confirmProof=confirmProof;

function sendMoney(id){
  const c=contracts.find(ct=>ct.id===id);
  if(c && c.placedBy===username && c.status==="Completed"){
    c.status="Paid";
    history.push(c);
    if(c.claimedBy){
      if(!agents[c.claimedBy]) agents[c.claimedBy] = {completed:0,failed:0,earnings:0};
      agents[c.claimedBy].completed++;
      agents[c.claimedBy].earnings += parseInt(c.payment);
    }
    contracts=contracts.filter(ct=>ct.id!==id);
    myContracts=myContracts.filter(ct=>ct.id!==id);
    saveContracts(); renderContracts(); renderMyContracts(); renderHistory(); renderProfile();
  }
}
window.sendMoney=sendMoney;

// ========================
// Leaderboard
// ========================
function renderLeaderboard() {
  const board=document.getElementById("leaderboardBoard"); if(!board) return;
  board.innerHTML="";
  const entries=Object.entries(agents).map(([name,stats])=>{
    const rep=(stats.completed*2)-stats.failed;
    return { name, avatar:"images/agent.png", ...stats, rep };
  });
  entries.sort((a,b)=> b.completed - a.completed || b.rep - a.rep);
  entries.forEach((agent,idx)=>{
    const card=document.createElement("div");
    card.classList.add("leaderboard-card");
    if(idx===0) card.classList.add("rank-1");
    if(idx===1) card.classList.add("rank-2");
    if(idx===2) card.classList.add("rank-3");
    card.innerHTML=`
      <div class="agent-info">
        <div class="avatar" style="background-image:url('${agent.avatar}')"></div>
        <div>
          <p><b>${idx+1}. ${agent.name}</b></p>
          <p>✅ ${agent.completed} | ❌ ${agent.failed}</p>
        </div>
      </div>
      <div>
        <p>⭐ Rep: ${agent.rep}</p>
        <p>💰 $${agent.earnings}</p>
      </div>
    `;
    board.appendChild(card);
  });
}

// ========================
// INIT
// ========================
renderContracts();
renderMyContracts();
renderHistory();
renderProfile();
renderLeaderboard();