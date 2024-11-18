let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let cart = [];

// Display available items
function displayShopItems() {
    const shopItemsBody = document.querySelector("#shopItems tbody");
    shopItemsBody.innerHTML = "";
    inventory.forEach((item, index) => {
        shopItemsBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.stock}</td>
                <td><button onclick="addToCart(${index})">Add to Cart</button></td>
            </tr>
        `;
    });
}

// Add item to cart
function addToCart(index) {
    const item = inventory[index];
    if (item.stock > 0) {
        const cartItem = cart.find(c => c.name === item.name);
        if (cartItem) {
            cartItem.quantity += 1;
            cartItem.subtotal = cartItem.quantity * cartItem.price;
        } else {
            cart.push({
                name: item.name,
                price: item.price,
                quantity: 1,
                subtotal: item.price
            });
        }
        item.stock -= 1;
        localStorage.setItem("inventory", JSON.stringify(inventory));
        updateCart();
        displayShopItems();
    } else {
        alert("Item is out of stock.");
    }
}

// Update cart display
function updateCart() {
    const cartItemsBody = document.querySelector("#cartItems tbody");
    const cartTotal = document.getElementById("cartTotal");
    cartItemsBody.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        cartItemsBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
                <td><button onclick="removeFromCart(${index})">Remove</button></td>
            </tr>
        `;
        total += item.subtotal;
    });

    cartTotal.textContent = total.toFixed(2);
    updateDailySales();
}

// Remove item from cart
function removeFromCart(index) {
    const item = cart[index];
    const inventoryItem = inventory.find(inv => inv.name === item.name);
    inventoryItem.stock += item.quantity;
    cart.splice(index, 1);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateCart();
    displayShopItems();
}

// Update daily sales
function updateDailySales() {
    const today = new Date().toISOString().slice(0, 10);
    const dailySales = JSON.parse(localStorage.getItem("dailySales")) || {};
    const todaySales = dailySales[today] || 0;
    document.getElementById("dailySales").textContent = todaySales.toFixed(2);
}

// Checkout and save daily sales
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty.");
        return;
    }

    const today = new Date().toISOString().slice(0, 10);
    let total = 0;

    cart.forEach(item => {
        total += item.subtotal;
    });

    const dailySales = JSON.parse(localStorage.getItem("dailySales")) || {};
    dailySales[today] = (dailySales[today] || 0) + total;
    localStorage.setItem("dailySales", JSON.stringify(dailySales));

    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
    cart = [];
    updateCart();
}

// Initialize
displayShopItems();
updateDailySales();
// Generate and print receipt invoice
function generateInvoice() {
    if (cart.length === 0) {
        alert("Cart is empty.");
        return;
    }

    const customerName = prompt("Enter customer's name:");
    if (!customerName) {
        alert("Customer name is required to generate the invoice.");
        return;
    }

    let totalItems = 0;
    let receiptHTML = `
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h2, p {
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table th, table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: center;
                }
                table th {
                    background-color: #f2f2f2;
                    color: #333;
                }
            </style>
        </head>
        <body>
            <h2>Shop Invoice</h2>
            <p>Customer Name: <strong>${customerName}</strong></p>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let total = 0;
    cart.forEach(item => {
        receiptHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
            </tr>
        `;
        total += item.subtotal;
        totalItems += item.quantity;
    });

    receiptHTML += `
                </tbody>
            </table>
            <p><strong>Total Items: ${totalItems}</strong></p>
            <p><strong>Total: $${total.toFixed(2)}</strong></p>
            <p>Thank you for shopping with us!</p>
        </body>
        </html>
    `;

    // Open a new window for the invoice
    const receiptWindow = window.open("", "", "width=600,height=400");
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
    receiptWindow.print();
}

// Attach generateInvoice to the checkout process
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty.");
        return;
    }

    const today = new Date().toISOString().slice(0, 10);
    let total = 0;

    cart.forEach(item => {
        total += item.subtotal;
    });

    const dailySales = JSON.parse(localStorage.getItem("dailySales")) || {};
    dailySales[today] = (dailySales[today] || 0) + total;
    localStorage.setItem("dailySales", JSON.stringify(dailySales));

    generateInvoice(); // Generate and print receipt invoice
    cart = [];
    updateCart();
}

