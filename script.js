// Use localStorage to persist data across pages
let group = JSON.parse(localStorage.getItem('group')) || null;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Elements
const groupNameInput = document.getElementById('group-name');
const memberNamesInput = document.getElementById('member-names');
const createGroupBtn = document.getElementById('create-group-btn');
const groupError = document.getElementById('group-error');

const expensePayerSelect = document.getElementById('expense-payer');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategorySelect = document.getElementById('expense-category');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseError = document.getElementById('expense-error');

const expensesList = document.getElementById('expenses-list');
const balancesList = document.getElementById('balances-list');
const settlementsList = document.getElementById('settlements-list');

// Create group
if (createGroupBtn) {
  createGroupBtn.addEventListener('click', () => {
    groupError.textContent = '';
    const name = groupNameInput.value.trim();
    const membersRaw = memberNamesInput.value.trim();

    if (!name) return groupError.textContent = 'Please enter a group name.';
    if (!membersRaw) return groupError.textContent = 'Please enter at least one member.';

    const members = membersRaw.split(',').map(m => m.trim()).filter(m => m);
    if (members.length < 2) return groupError.textContent = 'Group must have at least 2 members.';

    group = {name, members};
    expenses = [];
    localStorage.setItem('group', JSON.stringify(group));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    alert('Group created! Now go to Add Expense.');
    window.location.href = 'add_expense.html';
  });
}

// Populate payer select
if (expensePayerSelect && group) {
  expensePayerSelect.innerHTML = '';
  group.members.forEach(m => {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = m;
    expensePayerSelect.appendChild(option);
  });
}

// Add expense
if (addExpenseBtn) {
  addExpenseBtn.addEventListener('click', () => {
    expenseError.textContent = '';
    if (!group) return expenseError.textContent = 'Create a group first.';

    const payer = expensePayerSelect.value;
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategorySelect.value;
    const date = new Date();

    if (!payer) return expenseError.textContent = 'Select a payer.';
    if (isNaN(amount) || amount <= 0) return expenseError.textContent = 'Enter a valid amount.';

    expenses.push({payer, amount, category, date});
    localStorage.setItem('expenses', JSON.stringify(expenses));
    expenseAmountInput.value = '';
    alert('Expense added!');
  });
}

// Render balances (for balance.html)
if (expensesList) renderBalancesPage();

function renderBalancesPage() {
  expensesList.innerHTML = '';
  balancesList.innerHTML = '';
  settlementsList.innerHTML = '';

  if (!group) {
    expensesList.innerHTML = '<li>Create a group first.</li>';
    return;
  }
  if (expenses.length === 0) {
    expensesList.innerHTML = '<li>No expenses added yet.</li>';
    balancesList.innerHTML = '<li>No balances to show.</li>';
    settlementsList.innerHTML = '<li>No settlements needed.</li>';
    return;
  }

  // Render expenses
  expenses.forEach(e => {
    const li = document.createElement('li');
    li.textContent = `${e.payer} paid ₹${e.amount.toFixed(2)} for ${e.category} on ${new Date(e.date).toLocaleDateString()}`;
    expensesList.appendChild(li);
  });

  // Calculate balances
  const totalPaid = {};
  group.members.forEach(m => totalPaid[m] = 0);
  expenses.forEach(e => totalPaid[e.payer] += e.amount);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const sharePerMember = totalExpenses / group.members.length;

  const netBalances = {};
  group.members.forEach(m => netBalances[m] = totalPaid[m] - sharePerMember);

  group.members.forEach(m => {
    const bal = netBalances[m];
    const li = document.createElement('li');
    if (bal > 0) li.textContent = `${m} should receive ₹${bal.toFixed(2)} back`;
    else if (bal < 0) li.textContent = `${m} owes ₹${(-bal).toFixed(2)}`;
    else li.textContent = `${m} is settled`;
    balancesList.appendChild(li);
  });

  // Settlements
  const creditors = [], debtors = [];
  group.members.forEach(m => {
    const bal = netBalances[m];
    if (bal > 0.01) creditors.push({member: m, amount: bal});
    else if (bal < -0.01) debtors.push({member: m, amount: -bal});
  });

  const settlements = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const minAmount = Math.min(debtor.amount, creditor.amount);

    settlements.push({from: debtor.member, to: creditor.member, amount: minAmount});

    debtor.amount -= minAmount;
    creditor.amount -= minAmount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  if (settlements.length === 0) {
    settlementsList.innerHTML = '<li>All settled up! No one owes anything.</li>';
  } else {
    settlements.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.from} should pay ${s.to} ₹${s.amount.toFixed(2)}`;
      settlementsList.appendChild(li);
    });
  }
}
