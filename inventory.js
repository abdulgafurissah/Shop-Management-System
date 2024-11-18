// Load items from local storage or initialize empty array
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// Display all items
function displayInventory() {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = "";

    inventory.forEach((item, index) => {
        itemList.innerHTML += `<li>${item.name} - $${item.price} (Stock: ${item.stock})
            <button onclick="sellItem(${index})">Sell</button>
            <button onclick="editItem(${index})">Edit</button>
            <button onclick="deleteItem(${index})">Delete</button></li>`;
    });
}

// Add new item to inventory
function addItem() {
    const name = prompt("Item Name:");
    const price = parseFloat(prompt("Item Price:"));
    const stock = parseInt(prompt("Initial Stock:"));

    if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
        alert("Invalid input. Please enter valid item details.");
        return;
    }

    inventory.push({ name, price, stock });
    localStorage.setItem("inventory", JSON.stringify(inventory));
    displayInventory();
}

// Sell an item and record sales
function sellItem(index) {
    const item = inventory[index];
    const quantity = parseInt(prompt(`Enter quantity to sell (Available: ${item.stock}):`));

    if (isNaN(quantity) || quantity <= 0 || quantity > item.stock) {
        alert("Invalid quantity");
        return;
    }

    const saleAmount = item.price * quantity;
    item.stock -= quantity;

    if (item.stock === 0) {
        inventory.splice(index, 1);
    }

    localStorage.setItem("inventory", JSON.stringify(inventory));
    displayInventory();
    recordSale(saleAmount); // Update sales
}

// Edit item
function editItem(index) {
    const item = inventory[index];
    const name = prompt("New Name:", item.name);
    const price = parseFloat(prompt("New Price:", item.price));
    const stock = parseInt(prompt("New Stock:", item.stock));

    if (name && !isNaN(price) && !isNaN(stock)) {
        inventory[index] = { name, price, stock };
        localStorage.setItem("inventory", JSON.stringify(inventory));
        displayInventory();
    } else {
        alert("Invalid input");
    }
}

// Delete item
function deleteItem(index) {
    inventory.splice(index, 1);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    displayInventory();
}

// Initialize inventory display
displayInventory();

function sellItem(index) {
    const customerName = prompt("Enter Customer Name:");
    if (!customerName) {
        alert("Customer name is required!");
        return;
    }

    const item = inventory[index];
    const quantity = parseInt(prompt(`Enter quantity to sell (Available: ${item.stock}):`));

    if (isNaN(quantity) || quantity <= 0 || quantity > item.stock) {
        alert("Invalid quantity");
        return;
    }

    const saleAmount = item.price * quantity;
    item.stock -= quantity;

    if (item.stock === 0) {
        inventory.splice(index, 1);
    }

    localStorage.setItem("inventory", JSON.stringify(inventory));
    displayInventory();
    recordSale(saleAmount); // Update sales

    // Generate receipt
    generateReceipt(customerName, [{ name: item.name, price: item.price, quantity }], saleAmount);
}

function generateReceipt(customerName, items, totalAmount) {
    const receiptDiv = document.getElementById("receipt");
    const itemList = document.getElementById("purchasedItems");

    document.getElementById("customerName").textContent = customerName;
    document.getElementById("purchaseDate").textContent = new Date().toLocaleString();
    document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);

    itemList.innerHTML = "";
    items.forEach(item => {
        itemList.innerHTML += `<li>${item.name} - $${item.price} x ${item.quantity}</li>`;
    });

    receiptDiv.style.display = "block";
}

function printReceipt() {
    const receiptContent = document.getElementById("receipt").outerHTML;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <html>
            <head><title>Print Receipt</title></head>
            <body>${receiptContent}</body>
        </html>
    `);
    newWindow.document.close();
    newWindow.print();
}

