// Load saved data
let members = JSON.parse(localStorage.getItem("members") || "[]");
let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

// ------------------- Render Members -------------------
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

  // Update Paid By dropdown
  const paidBySelect = document.getElementById("paidBy");
  if (paidBySelect) {
    paidBySelect.innerHTML = "";
    members.forEach(m => {
      const option = document.createElement("option");
      option.value = m;
      option.textContent = m;
      paidBySelect.appendChild(option);
    });
  }
}

// ------------------- Add Member -------------------
const memberForm = document.getElementById("member-form");
if (memberForm) {
  memberForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("member-name").value.trim();
    if (name && !members.includes(name)) {
      members.push(name);
      localStorage.setItem("members", JSON.stringify(members));
      renderMembers();
      memberForm.reset();
    }
  });
}
renderMembers();

// ------------------- Add Expense -------------------
const expenseForm = document.getElementById("expense-form");
if (expenseForm) {
  expenseForm.addEventListener("submit", e => {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const paidBy = document.getElementById("paidBy").value;

    if (description && amount && paidBy) {
      expenses.push({
        description,
        amount,
        paidBy,
        date: new Date().toLocaleDateString()
      });
      localStorage.setItem("expenses", JSON.stringify(expenses));
      renderExpenses();
      renderBalance();
      expenseForm.reset();
    }
  });
}

// ------------------- Render Expenses -------------------
function renderExpenses() {
  const table = document.getElementById("expense-table");
  if (table) {
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    expenses.forEach(exp => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${exp.date}</td>
                      <td>${exp.description}</td>
                      <td>${exp.amount}</td>
                      <td>${exp.paidBy}</td>`;
      tbody.appendChild(tr);
    });
  }
}
renderExpenses();

// ------------------- Render Balance -------------------
// ------------------- Render Balance -------------------
function renderBalance() {
  const table = document.getElementById("balance-table");
  if (!table) return; // only run if balance table exists

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  if (members.length === 0 || expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No data yet. Add members & expenses first.</td></tr>`;
    return;
  }

  const totals = {};
  members.forEach(m => totals[m] = 0);

  let totalAmount = 0;
  expenses.forEach(exp => {
    totals[exp.paidBy] += exp.amount;
    totalAmount += exp.amount;
  });

  const perPerson = totalAmount / members.length;

  members.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m}</td>
      <td>${totals[m].toFixed(2)}</td>
      <td>${(totals[m] - perPerson).toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}
