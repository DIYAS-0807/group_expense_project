// Load data
let members = JSON.parse(localStorage.getItem("members") || "[]");
let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

// ---------------- Members ----------------
function renderMembers() {
  const memberList = document.getElementById("member-list");
  if (memberList) {
    memberList.innerHTML = "";
    members.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m;
      memberList.appendChild(li);
    });
  }

  const payerSelect = document.getElementById("expense-payer");
  if (payerSelect) {
    payerSelect.innerHTML = "";
    members.forEach(m => {
      const option = document.createElement("option");
      option.value = m;
      option.textContent = m;
      payerSelect.appendChild(option);
    });
  }
}

// Add member
const addMemberBtn = document.getElementById("add-member-btn");
if (addMemberBtn) {
  addMemberBtn.addEventListener("click", () => {
    const input = document.getElementById("member-name");
    const name = input.value.trim();
    if (name && !members.includes(name)) {
      members.push(name);
      localStorage.setItem("members", JSON.stringify(members));
      renderMembers();
      input.value = "";
    }
  });
}

// Create group
const createGroupBtn = document.getElementById("create-group-btn");
if (createGroupBtn) {
  createGroupBtn.addEventListener("click", () => {
    const groupName = document.getElementById("group-name").value.trim();
    const error = document.getElementById("group-error");
    error.textContent = "";
    if (!groupName) { error.textContent = "Enter group name."; return; }
    if (members.length < 2) { error.textContent = "Add at least 2 members."; return; }

    localStorage.setItem("groupName", groupName);
    localStorage.setItem("members", JSON.stringify(members));
    window.location.href = "add_expense.html";
  });
}

// ---------------- Expenses ----------------
const addExpenseBtn = document.getElementById("add-expense-btn");
if (addExpenseBtn) {
  addExpenseBtn.addEventListener("click", () => {
    const payer = document.getElementById("expense-payer").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;
    const error = document.getElementById("expense-error");
    error.textContent = "";

    if (!payer) { error.textContent = "Select payer"; return; }
    if (isNaN(amount) || amount <= 0) { error.textContent = "Enter valid amount"; return; }

    expenses.push({payer, amount, category, date: new Date().toLocaleDateString()});
    localStorage.setItem("expenses", JSON.stringify(expenses));
    document.getElementById("expense-amount").value = "";
    alert("Expense added!");
  });
}

// ---------------- Render ----------------
function renderExpenses() {
  const list = document.getElementById("expenses-list");
  if (!list) return;
  list.innerHTML = "";
  if (expenses.length === 0) list.innerHTML = "<li>No expenses yet</li>";
  else expenses.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.payer} paid ₹${e.amount.toFixed(2)} for ${e.category} on ${e.date}`;
    list.appendChild(li);
  });
}

function renderBalances() {
  const list = document.getElementById("balances-list");
  if (!list) return;
