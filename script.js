// Load saved data from localStorage
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
