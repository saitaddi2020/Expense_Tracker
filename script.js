let expenses = [];
let totalAmount = 0;

const category = document.getElementById("category");
const amount = document.getElementById("amount");
const dateSelect = document.getElementById("dateSelect");
const addBtn = document.getElementById("addBtn");
const expensesBody = document.getElementById("expensesBody");
const totalCount = document.getElementById("totalCount");

addBtn.addEventListener('click', function(){
   const categories = category.value;
   const money = Number(amount.value);
   const inputDate = dateSelect.value;
   
   if(categories === ''){
    alert("please select a category")
    return;
   }
   if(isNaN(money) || money<=0){
    alert("please enter a valid amount")
    return;
   }
   if(inputDate===''){
    alert("please select a date")
    return;
   }
   document.querySelector(".expenses-list").style.display = 'block' 
   const expense = {categories,money,inputDate};
   expenses.push(expense);

   totalAmount += money;
   totalCount.textContent = totalAmount;    
   
   const newRow = expensesBody.insertRow();

   const serialCell = newRow.insertCell();
   const categoriesCell = newRow.insertCell();
   const moneyCell = newRow.insertCell();
   const inputDateCell = newRow.insertCell();
   const deleteCell = newRow.insertCell();
   
   const deleteBtn = document.createElement('button');
   deleteBtn.textContent = 'delete';
   deleteBtn.classList.add('deleteBtn');

   deleteBtn.addEventListener('click', function(){
      const expense = expenses[expenses.length-1];
      const index = expenses.indexOf(expense)
      
   if(index != -1){
      expenses.splice(index,1)
   }
      totalAmount -= expense.money;
      totalCount.textContent = totalAmount;
      expensesBody.removeChild(newRow);
      if(expenses.length ===0){
         document.querySelector(".expenses-list").style.display = 'none'
      }
      updateSerialNumbers();
   })
     
   serialCell.textContent = expenses.length
    categoriesCell.textContent  = expense.categories
   moneyCell.textContent = expense.money
   inputDateCell.textContent = expense.inputDate
   deleteCell.appendChild(deleteBtn); 

   function updateSerialNumbers() {
      const rows = expensesBody.rows;
      for (let i = 0; i < rows.length; i++) {
         rows[i].cells[0].textContent = i + 1;
      }
   }
})
// for(const expense of expenses){
//  totalAmount += Number(amount.value);
//    totalCount.textContent = totalAmount;    
   
//    const newRow = expensesBody.insertRow();

//    const categoriesCell = newRow.insertCell();
//    const moneyCell = newRow.insertCell();
//    const inputDateCell = newRow.insertCell();
//    const deleteCell = newRow.insertCell();
   
//    const deleteBtn = document.createElement('deleteBtn');
//    deleteBtn.textContent = 'delete';
//    deleteBtn.classList.add('deleteBtn');

//    deleteBtn.addEventListener('click', function(){
//       expenses.splice(expenses.indexOf(expense),1)
//       totalAmount -= expense.money;
//       totalAmount.textContent = totalAmount;
//       expensesBody.removeChild(newRow);
//    })
   
//    const expense = expenses[expenses.length-1];

//    categoriesCell.textContent  = expense.categories
//    moneyCell.textContent = expense.money
//    inputDateCell.textContent = expense.inputDate
//    deleteCell.appendChild(deleteBtn); 
// }
