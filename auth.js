// Simulated User Database
const users = [
    { username: "manager", password: "manager123", role: "manager" },
    { username: "assistant", password: "assistant123", role: "assistant" }
];

// Handle login form
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = user.role === "manager" ? "inventory.html" : "shop.html";
    } else {
        alert("Invalid login credentials.");
    }
});

// Logout functionality
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function checkAccess() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        window.location.href = "index.html"; // Redirect if not logged in
    }

    const isManager = user.role === "manager";
    if (document.getElementById("inventorySection") && !isManager) {
        document.getElementById("inventorySection").style.display = "none";
    }
    if (document.getElementById("salesSection") && !isManager) {
        document.getElementById("salesSection").style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
