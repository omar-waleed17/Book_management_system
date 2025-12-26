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

function displayPreviousMonthSales() {
  const resultsContent = document.getElementById("resultsContent");
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const monthName = lastMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  resultsContent.innerHTML = `
        <h3>Total Sales for ${monthName}</h3>
        <div class="stat-box">
          <p class="stat-label">Total Sales Amount</p>
          <p class="stat-value">$12,458.75</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Books Sold</p>
          <p class="stat-value">342 Books</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Orders</p>
          <p class="stat-value">156 Orders</p>
        </div>
      `;
}

function displaySpecificDaySales() {
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

  resultsContent.innerHTML = `
        <h3>Sales Report for ${selectedDate}</h3>
        <div class="stat-box">
          <p class="stat-label">Total Sales Amount</p>
          <p class="stat-value">$1,247.50</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Books Sold</p>
          <p class="stat-value">28 Books</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Orders</p>
          <p class="stat-value">15 Orders</p>
        </div>
      `;
}

function displayTopCustomers() {
  const resultsContent = document.getElementById("resultsContent");

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
            <tr>
              <td>🥇 1</td>
              <td>John Doe</td>
              <td>$2,845.50</td>
              <td>42</td>
            </tr>
            <tr>
              <td>🥈 2</td>
              <td>Jane Smith</td>
              <td>$2,156.75</td>
              <td>35</td>
            </tr>
            <tr>
              <td>🥉 3</td>
              <td>Michael Brown</td>
              <td>$1,892.30</td>
              <td>28</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Sarah Johnson</td>
              <td>$1,647.25</td>
              <td>24</td>
            </tr>
            <tr>
              <td>5</td>
              <td>David Wilson</td>
              <td>$1,423.80</td>
              <td>21</td>
            </tr>
          </tbody>
        </table>
      `;
}

function displayTopBooks() {
  const resultsContent = document.getElementById("resultsContent");

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
            <tr>
              <td>1</td>
              <td>The Great Gatsby</td>
              <td>F. Scott Fitzgerald</td>
              <td>124</td>
            </tr>
            <tr>
              <td>2</td>
              <td>To Kill a Mockingbird</td>
              <td>Harper Lee</td>
              <td>108</td>
            </tr>
            <tr>
              <td>3</td>
              <td>1984</td>
              <td>George Orwell</td>
              <td>98</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Pride and Prejudice</td>
              <td>Jane Austen</td>
              <td>87</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Harry Potter</td>
              <td>J.K. Rowling</td>
              <td>82</td>
            </tr>
            <tr>
              <td>6</td>
              <td>The Catcher in the Rye</td>
              <td>J.D. Salinger</td>
              <td>76</td>
            </tr>
            <tr>
              <td>7</td>
              <td>The Hobbit</td>
              <td>J.R.R. Tolkien</td>
              <td>71</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Animal Farm</td>
              <td>George Orwell</td>
              <td>65</td>
            </tr>
            <tr>
              <td>9</td>
              <td>Lord of the Flies</td>
              <td>William Golding</td>
              <td>58</td>
            </tr>
            <tr>
              <td>10</td>
              <td>Brave New World</td>
              <td>Aldous Huxley</td>
              <td>52</td>
            </tr>
          </tbody>
        </table>
      `;
}

function displayBookOrderHistory() {
  const bookInput = document.getElementById("bookId");
  const resultsContent = document.getElementById("resultsContent");

  if (!bookInput.value) {
    resultsContent.innerHTML =
      '<div class="error">Please enter a book ID or title first.</div>';
    return;
  }

  resultsContent.innerHTML = `
        <h3>Order History: "${bookInput.value}"</h3>
        <div class="stat-box">
          <p class="stat-label">Total Times Ordered</p>
          <p class="stat-value">47 Times</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Total Copies Ordered</p>
          <p class="stat-value">1,245 Copies</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Last Order Date</p>
          <p class="stat-value">Dec 20, 2025</p>
        </div>
      `;
}

function closeResults() {
  document.getElementById("resultsSection").style.display = "none";
}
