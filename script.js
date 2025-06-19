document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("addBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const typeSelect = document.getElementById("type");
  const dateInput = document.getElementById("dateSelect");
  const descriptionInput = document.getElementById("description");
  const categorySelect = document.getElementById("category");
  const amountInput = document.getElementById("amount");
  const expensesBody = document.getElementById("expensesBody");
  const totalIncomeEl = document.getElementById("totalIncome");
  const totalExpenseEl = document.getElementById("totalExpense");
  const balanceAmountEl = document.getElementById("balanceAmount");
  const filterCategory = document.getElementById("filterCategory");
  const filterMonth = document.getElementById("filterMonth");

  let incomeData = JSON.parse(localStorage.getItem("income")) || [];
  let expenseData = JSON.parse(localStorage.getItem("expense")) || [];
  let editingIndex = null;
  let editingType = null;

  const expenseCategories = [
    "Transport", "Food", "Rent", "Fees", "Recharges", "Entertainment",
    "Insurance", "Medical", "Others"
  ];
  const incomeCategories = ["Salary", "Bonus", "Interest Income", "Business Income",
    "Subsidies", "Others"
  ];

  amountInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9.]/g, '');
  });

  function updateCategoryOptions() {
    const selectedType = typeSelect.value;
    categorySelect.innerHTML = `<option value="">-- Select an option --</option>`;
    const categories = selectedType === "Income" ? incomeCategories : expenseCategories;
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  updateCategoryOptions();
  typeSelect.addEventListener("change", updateCategoryOptions);

  function updateLocalStorage() {
    localStorage.setItem("income", JSON.stringify(incomeData));
    localStorage.setItem("expense", JSON.stringify(expenseData));
  }

  function calculateTotals() {
    const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalExpense = expenseData.reduce((sum, item) => sum + Number(item.amount), 0);
    totalIncomeEl.textContent = `₹${totalIncome.toFixed(2)}`;
    totalExpenseEl.textContent = `₹${totalExpense.toFixed(2)}`;
    balanceAmountEl.textContent = (totalIncome - totalExpense).toFixed(2);
  }


  function renderTable() {
    expensesBody.innerHTML = "";
    const hasData = incomeData.length > 0 || expenseData.length > 0;
document.getElementById("tableContainer").style.display = hasData ? "block" : "none";
document.getElementById("noDataMsg").style.display = hasData ? "none" : "block";

    const combined = [
      ...incomeData.map((e, i) => ({ ...e, index: i, typeData: "Income" })),
      ...expenseData.map((e, i) => ({ ...e, index: i, typeData: "Expense" }))
    ];

    const filtered = combined.filter(item => {
      const matchCategory = !filterCategory.value || item.category === filterCategory.value;
      const matchMonth = !filterMonth.value || new Date(item.date).toISOString().slice(0, 7) === filterMonth.value;
      return matchCategory && matchMonth;
    });

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).reverse();

    filtered.forEach((item, displayIndex) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${displayIndex + 1}</td>
        <td>${item.type}</td>
        <td>${item.date}</td>
        <td>${item.description}</td>
        <td>${item.category}</td>
        <td>₹${Number(item.amount).toFixed(2)}</td>
        <td>
          <button onclick="editEntry('${item.typeData}', ${item.index})">✏️</button>
          <button onclick="deleteEntry('${item.typeData}', ${item.index})">❌</button>
        </td>
      `;
      expensesBody.appendChild(tr);
    });
  }

  function resetForm() {
    editingIndex = null;
    editingType = null;
    addBtn.textContent = "Add";
    cancelBtn.style.display = "none";

    typeSelect.value = "Expense";
    dateInput.value = "";
    descriptionInput.value = "";
    amountInput.value = "";
    updateCategoryOptions();
    categorySelect.value = "";
  }

  window.editEntry = function (type, index) {
    const item = type === "Income" ? incomeData[index] : expenseData[index];
    typeSelect.value = item.type;
    dateInput.value = item.date;
    descriptionInput.value = item.description;
    updateCategoryOptions();
    categorySelect.value = item.category;
    amountInput.value = item.amount;

    editingIndex = index;
    editingType = type;
    addBtn.textContent = "Update";
    cancelBtn.style.display = "inline-block";
  };

  window.deleteEntry = function (type, index) {
    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    if (type === "Income") {
      incomeData.splice(index, 1);
    } else {
      expenseData.splice(index, 1);
    }
    updateLocalStorage();
    renderTable();
    calculateTotals();
    populateFilterMonths();
  };

  function populateFilterMonths() {
    const dates = [...incomeData, ...expenseData].map(e => new Date(e.date));
    const months = new Set(dates.map(d => d.toISOString().slice(0, 7)));
    filterMonth.innerHTML = '<option value="">All</option>';
    months.forEach(m => {
      const option = document.createElement("option");
      option.value = m;
      option.textContent = m;
      filterMonth.appendChild(option);
    });
  }

  addBtn.addEventListener("click", () => {
    const type = typeSelect.value;
    const date = dateInput.value;
    const description = descriptionInput.value;
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);

    if (!date || !category || isNaN(amount) || amount <= 0) {
      alert("Please fill all fields correctly and enter a valid amount.");
      return;
    }

    const entry = { type, date, description, category, amount };

    if (editingIndex !== null) {
      if (editingType === "Income") {
        incomeData[editingIndex] = entry;
      } else {
        expenseData[editingIndex] = entry;
      }
      showToast("Transaction updated successfully!");
    } else {
      if (type === "Income") {
        incomeData.push(entry);
      } else {
        expenseData.push(entry);
      }
      showToast("Transaction added successfully!");
    }

    updateLocalStorage();
    renderTable();
    calculateTotals();
    populateFilterMonths();
    resetForm();
  });

  cancelBtn.addEventListener("click", resetForm);

  filterCategory.addEventListener("change", renderTable);
  filterMonth.addEventListener("change", renderTable);

  document.getElementById("exportCSV").addEventListener("click", () => {
    const rows = [["Type", "Date", "Description", "Category", "Amount"]];
    [...incomeData, ...expenseData].forEach(item => {
      rows.push([item.type, item.date, item.description, item.category, item.amount]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  window.goToChartPage = function () {
    window.location.href = "chart.html";
  };

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Initial load
  renderTable();
  calculateTotals();
  populateFilterMonths();
});
