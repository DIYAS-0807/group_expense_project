// Load or initialize data
let group = JSON.parse(localStorage.getItem('group')) || null;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Save group to localStorage
function saveGroup(name, members) {
    group = { name, members };
    localStorage.setItem('group', JSON.stringify(group));
}

// Add expense to localStorage
function addExpense(payer, amount, category) {
    const expense = {
        payer, amount, category, date: new Date().toISOString()
    };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Populate payer dropdown
function populatePayerDropdown() {
    if (!group) return;
    const select = document.getElementById('expense-payer');
    if (!select) return;
    select.innerHTML = '';
    group.members.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m;
        select.appendChild(option);
    });
}

// Render expenses
function renderExpenses() {
    const list = document.getElementById('expenses-list');
    if (!list) return;
    list.innerHTML = '';
    if (expenses.length === 0) {
        list.innerHTML = '<li>No expenses added yet.</li>';
        return;
    }
    expenses.forEach(e => {
        const li = document.createElement('li');
        const date = new Date(e.date).toLocaleDateString();
        li.textContent = `${e.payer} paid ₹${e.amount.toFixed(2)} for ${e.category} on ${date}`;
        list.appendChild(li);
    });
}

// Render balances
function renderBalances() {
    const list = document.getElementById('balances-list');
    if (!list || !group) return;
    list.innerHTML = '';
    if (expenses.length === 0) {
        list.innerHTML = '<li>No balances to show.</li>';
        return;
    }

    const totalPaid = {};
    group.members.forEach(m => totalPaid[m] = 0);
    expenses.forEach(e => totalPaid[e.payer] += e.amount);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const share = total / group.members.length;

    group.members.forEach(m => {
        const bal = totalPaid[m] - share;
        const li = document.createElement('li');
        if (bal > 0) li.textContent = `${m} should receive ₹${bal.toFixed(2)}`;
        else if (bal < 0) li.textContent = `${m} owes ₹${(-bal).toFixed(2)}`;
        else li.textContent = `${m} is settled`;
        list.appendChild(li);
    });
}
