// ---------- Storage Helpers ----------
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadData(key, defaultValue) {
  return JSON.parse(localStorage.getItem(key)) || defaultValue;
}

// ---------- Global Data ----------
let group = loadData("group", null);
let expenses = loadData("expenses", []);

// ---------- Create Group ----------
const createGroupBtn = document.getElementById("create-group-btn");
if (createGroupBtn) {
  createGroupBtn.addEventListener("click", () => {
    const name = document.getElementById("group-name").value.trim();
    const membersRaw = document.getElementById("member-names").value.trim();
    const groupError = document.getElementById("group-error");

    groupError.textContent = "";
    if (!name) {
      groupError.textContent = "Please enter a group name.";
      return;
    }
    if (!membersRaw) {
      groupError.textContent = "Please enter at least one member.";
      return;
    }

    const members = membersRaw.split(",").map(m => m.trim()).filter(m => m);
    if (members.length < 2) {
      groupError.textContent = "Group must have at least 2 members.";
      return;
    }

    group = { name, members };
    expenses = [];
    saveData("group", group);
    saveData("expenses", expenses);

    alert("Group created! Now go to Add Expense.");
    window.location.href = "add-expense.html";
  });
}

// ---------- Add Expense ----------
const addExpenseBtn = document.getElementById("add-expense-btn");
if (addExpenseBtn) {
  const payerSelect = document.getElementById("expense-payer");
  const amountInput = document.getElementById("expense-amount");
  const categorySelect = document.getElementById("expense-category");
  const expenseError = document.getElementById("expense-error");

  // Populate members in dropdown
  if (group && payerSelect) {
    payerSelect.innerHTML = "";
    group.members.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      payerSelect.appendChild(opt);
    });
  }

  addExpenseBtn.addEventListener("click", () => {
    expenseError.textContent = "";
    if (!group) {
      expenseError.textContent = "Create a group first.";
      return;
    }
    const payer = payerSelect.value;
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;

    if (!payer) {
      expenseError.textContent = "Select a payer.";
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      expenseError.textContent = "Enter a valid amount.";
      return;
    }

    const date = new Date().toLocaleDateString();
    expenses.push({ payer, amount, category, date });
    saveData("expenses", expenses);

    amountInput.value = "";
    alert("Expense added!");
  });
}

// ---------- Balances ----------
function renderExpenses() {
  const list = document.getElementById("expenses-list");
  if (!list) return;
  list.innerHTML = "";

  if (expenses.length === 0) {
    list.innerHTML = "<li>No expenses added yet.</li>";
    return;
  }

  expenses.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.payer} paid ₹${e.amount.toFixed(2)} for ${e.category} on ${e.date}`;
    list.appendChild(li);
  });
}

function renderBalances() {
  const list = document.getElementById("balances-list");
  if (!list || !group) return;
  list.innerHTML = "";

  if (expenses.length === 0) {
    list.innerHTML = "<li>No balances to show.</li>";
    return;
  }

  const totalPaid = {};
  group.members.forEach(m => totalPaid[m] = 0);
  expenses.forEach(e => totalPaid[e.payer] += e.amount);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const share = totalExpenses / group.members.length;

  const netBalances = {};
  group.members.forEach(m => {
    netBalances[m] = totalPaid[m] - share;
  });

  group.members.forEach(m => {
    const li = document.createElement("li");
    const bal = netBalances[m];
    if (bal > 0) li.textContent = `${m} should receive ₹${bal.toFixed(2)}`;
    else if (bal < 0) li.textContent = `${m} owes ₹${(-bal).toFixed(2)}`;
    else li.textContent = `${m} is settled`;
    list.appendChild(li);
  });
}

function renderSettlements() {
  const list = document.getElementById("settlements-list");
  if (!list || !group) return;
  list.innerHTML = "";

  if (expenses.length === 0) {
    list.innerHTML = "<li>No settlements needed.</li>";
    return;
  }

  const totalPaid = {};
  group.members.forEach(m => totalPaid[m] = 0);
  expenses.forEach(e => totalPaid[e.payer] += e.amount);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const share = totalExpenses / group.members.length;

  const netBalances = {};
  group.members.forEach(m => netBalances[m] = totalPaid[m] - share);

  const creditors = [];
  const debtors = [];
  for (const m of group.members) {
    const bal = netBalances[m];
    if (bal > 0.01) creditors.push({ member: m, amount: bal });
    else if (bal < -0.01) debtors.push({ member: m, amount: -bal });
  }

  if (creditors.length === 0 && debtors.length === 0) {
    list.innerHTML = "<li>All settled up! No one owes anything.</li>";
    return;
  }

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const minAmount = Math.min(debtor.amount, creditor.amount);

    const li = document.createElement("li");
    li.textContent = `${debtor.member} should pay ${creditor.member} ₹${minAmount.toFixed(2)}`;
    list.appendChild(li);

    debtor.amount -= minAmount;
    creditor.amount -= minAmount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }
}

// Auto-render if on balances page
if (document.getElementById("balances-list")) {
  renderExpenses();
  renderBalances();
  renderSettlements();
}
