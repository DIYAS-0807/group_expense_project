// Initialize storage
let members = JSON.parse(localStorage.getItem("members") || "[]");
let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

// ------------------- Members -------------------
function renderMembers() {
  const memberList = document.getElementById("member-list");
  if (memberList) {
    memberList.innerHTML = "";
    members.forEach(m => {      settlements.push({
        from: debtor.member,
        to: creditor.member,
        amount: minAmount
      });
      debtor.amount -= minAmount;
      creditor.amount -= minAmount;
      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }
    // Render settlement suggestions
    settlements.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.from} should pay ${s.to} ₹${s.amount.toFixed(2)}`;
      settlementsList.appendChild(li);
    });
  }
</script>
      const li = document.createElement("li");
      li.textContent = m;
      memberList.appendChild(li);
    });
  }

  // Update "Paid By" dropdown
  const paidBy = document.getElementById("paidBy");
  if (paidBy) {
    paidBy.innerHTML = "";
    members.forEach(m => {
      const option = document.createElement("option");
      option.value = m;
      option.textContent = m;
      paidBy.appendChild(option);
    });
  }
}

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

// ------------------- Expenses -------------------
const expenseForm = document.getElementById("expense-form");
if (expenseForm) {
  expenseForm.addEventListener("submit", e => {
    e.preventDefault();
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const paidBy = document.getElementById("paidBy").value;

    if (!description || isNaN(amount) || !paidBy) return;

    expenses.push({
      description,
      amount,
      paidBy,
      date: new Date().toLocaleDateString()
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));
    expenseForm.reset();
    renderExpenses();
    renderBalance();
  });
}

// ------------------- Dash
