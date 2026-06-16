document.getElementById("total-orders").textContent = orders.length;

document.getElementById("total-revenue").textContent =
    "R" + totalRevenue.toFixed(2);

document.getElementById("pending-orders").textContent =
    pendingOrders;