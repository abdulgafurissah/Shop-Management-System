// Retrieve daily sales
function getDailySales() {
    const today = new Date().toISOString().slice(0, 10);
    const dailySales = JSON.parse(localStorage.getItem("dailySales")) || {};
    return dailySales[today] || 0;
}

// Retrieve monthly sales
function getMonthlySales() {
    const dailySales = JSON.parse(localStorage.getItem("dailySales")) || {};
    const currentMonth = new Date().toISOString().slice(0, 7);
    let monthlyTotal = 0;

    for (const date in dailySales) {
        if (date.startsWith(currentMonth)) {
            monthlyTotal += dailySales[date];
        }
    }
    return monthlyTotal;
}

// Record a sale for the day
function recordSale(amount) {
    const today = new Date().toISOString().slice(0, 10);
    const dailySales = JSON.parse(localStorage.getItem("dailySales")) || {};

    dailySales[today] = (dailySales[today] || 0) + amount;
    localStorage.setItem("dailySales", JSON.stringify(dailySales));

    // Update the displayed totals immediately
    document.getElementById("dailySalesTotal").textContent = getDailySales().toFixed(2);
    document.getElementById("monthlySalesTotal").textContent = getMonthlySales().toFixed(2);
}

// Initialize sales totals on page load
document.getElementById("dailySalesTotal").textContent = getDailySales().toFixed(2);
document.getElementById("monthlySalesTotal").textContent = getMonthlySales().toFixed(2);
