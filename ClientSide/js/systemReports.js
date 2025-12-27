// System Reports functionality
// This file can be expanded to include API calls to the backend
// Check authentication before page loads
const role = localStorage.getItem("role");
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true" || role?.toLowerCase() !== "admin") {
  alert("Access denied. Admin privileges required.");
  window.location.href = "../index.html";
}

console.log("System Reports initialized");

// You can add additional helper functions here for future backend integration

// Handle logout
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("role");
  window.location.href = "../index.html";
});

function generateReport(reportType) {
  const resultsSection = document.getElementById("resultsSection");
  const resultsContent = document.getElementById("resultsContent");

  resultsSection.style.display = "block";
  resultsContent.innerHTML = '<div class="loading">Generating report...</div>';

  // Simulate API call delay
  setTimeout(() => {
    switch (reportType) {
      case "previousMonth":
        displayPreviousMonthSales();
        break;
      case "specificDay":
        displaySpecificDaySales();
        break;
      case "topCustomers":
        displayTopCustomers();
        break;
      case "topBooks":
        displayTopBooks();
        break;
      case "bookOrderHistory":
        displayBookOrderHistory();
        break;
    }
  }, 500);
}

async function displayPreviousMonthSales() {
  const resultsContent = document.getElementById("resultsContent");
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const monthName = lastMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Format date as YYYY-MM-DD for the first day of last month
  const year = lastMonth.getFullYear();
  const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
  const dateStr = `${year}-${month}-01`;

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/admin/reports/sales/date?date=${dateStr}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sales data');
    }

    const data = await response.json();

    resultsContent.innerHTML = `
        <h3>Total Sales for ${monthName}</h3>
        <div class="stat-box">
          <p class="stat-label">Total Sales Amount</p>
          <p class="stat-value">$${data.totalSales?.toFixed(2) || '0.00'}</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Books Sold</p>
          <p class="stat-value">${data.totalBooks || 0} Books</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Orders</p>
          <p class="stat-value">${data.totalOrders || 0} Orders</p>
        </div>
      `;
  } catch (error) {
    console.error('Error fetching previous month sales:', error);
    resultsContent.innerHTML = '<div class="error">Failed to load sales data. Please try again.</div>';
  }
}

async function displaySpecificDaySales() {
  const dateInput = document.getElementById("salesDate");
  const resultsContent = document.getElementById("resultsContent");

  if (!dateInput.value) {
    resultsContent.innerHTML =
      '<div class="error">Please select a date first.</div>';
    return;
  }

  const selectedDate = new Date(dateInput.value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/admin/reports/sales/date?date=${dateInput.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sales data');
    }

    const data = await response.json();

    resultsContent.innerHTML = `
        <h3>Sales Report for ${selectedDate}</h3>
        <div class="stat-box">
          <p class="stat-label">Total Sales Amount</p>
          <p class="stat-value">$${data.totalSales?.toFixed(2) || '0.00'}</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Books Sold</p>
          <p class="stat-value">${data.totalBooks || 0} Books</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Orders</p>
          <p class="stat-value">${data.totalOrders || 0} Orders</p>
        </div>
      `;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    resultsContent.innerHTML = '<div class="error">Failed to load sales data. Please try again.</div>';
  }
}

async function displayTopCustomers() {
  const resultsContent = document.getElementById("resultsContent");

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch('http://localhost:8080/api/admin/reports/top-customers', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top customers');
    }

    const customers = await response.json();

    const medals = ['🥇', '🥈', '🥉'];
    const rows = customers.map((customer, index) => `
      <tr>
        <td>${index < 3 ? medals[index] : ''} ${index + 1}</td>
        <td>${customer.customerName || 'N/A'}</td>
        <td>$${customer.totalPurchases?.toFixed(2) || '0.00'}</td>
        <td>${customer.orderCount || 0}</td>
      </tr>
    `).join('');

    resultsContent.innerHTML = `
        <h3>Top 5 Customers (Last 3 Months)</h3>
        <table class="results-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Customer Name</th>
              <th>Total Purchases</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="4">No customer data available</td></tr>'}
          </tbody>
        </table>
      `;
  } catch (error) {
    console.error('Error fetching top customers:', error);
    resultsContent.innerHTML = '<div class="error">Failed to load customer data. Please try again.</div>';
  }
}

async function displayTopBooks() {
  const resultsContent = document.getElementById("resultsContent");

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch('http://localhost:8080/api/admin/reports/top-books', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top books');
    }

    const books = await response.json();

    const rows = books.map((book, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${book.title || 'N/A'}</td>
        <td>${book.author || 'N/A'}</td>
        <td>${book.copiesSold || 0}</td>
      </tr>
    `).join('');

    resultsContent.innerHTML = `
        <h3>Top 10 Selling Books (Last 3 Months)</h3>
        <table class="results-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Copies Sold</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="4">No book data available</td></tr>'}
          </tbody>
        </table>
      `;
  } catch (error) {
    console.error('Error fetching top books:', error);
    resultsContent.innerHTML = '<div class="error">Failed to load book data. Please try again.</div>';
  }
}

async function displayBookOrderHistory() {
  const bookInput = document.getElementById("bookIsbn");
  const resultsContent = document.getElementById("resultsContent");

  if (!bookInput.value) {
    resultsContent.innerHTML =
      '<div class="error">Please enter a book ISBN first.</div>';
    return;
  }

  const isbn = bookInput.value.trim();

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/admin/books/${encodeURIComponent(isbn)}/order-count`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch book order history';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    resultsContent.innerHTML = `
        <h3>Order History: ISBN ${isbn}</h3>
        <div class="stat-box">
          <p class="stat-label">Book Title</p>
          <p class="stat-value">${data.title || 'N/A'}</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Times Ordered</p>
          <p class="stat-value">${data.orderCount || 0} Times</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Copies Ordered</p>
          <p class="stat-value">${data.totalQuantity || 0} Copies</p>
        </div>
      `;
  } catch (error) {
    console.error('Error fetching book order history:', error);
    resultsContent.innerHTML = `<div class="error">Failed to load book order history: ${error.message}</div>`;
  }
}

function closeResults() {
  document.getElementById("resultsSection").style.display = "none";
}
