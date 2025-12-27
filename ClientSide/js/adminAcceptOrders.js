// Check authentication before page loads
const role = localStorage.getItem("role");
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true" || role?.toUpperCase() !== "ADMIN") {
  alert("Access denied. Admin privileges required.");
  window.location.href = "../index.html";
}

// ============================================
// 1. LOAD PENDING ORDERS ON PAGE LOAD
// ============================================
async function loadPendingOrders() {
  try {
    if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
      alert('Please login to view orders');
      window.location.href = "../index.html";
      return;
    }

    showLoading(true);

    const response = await window.TokenManager.fetchWithAuth(
      'http://localhost:8080/api/admin/orders/pending',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to load pending orders');
    }

    const orders = await response.json();
    console.log('✅ Loaded orders:', orders);
    
    // Log first order to see structure
    if (orders && orders.length > 0) {
      console.log('📋 Sample order structure:', orders[0]);
    }
    
    await displayOrders(orders);

  } catch (error) {
    console.error('❌ Error loading orders:', error);
    showMessage('Failed to load orders: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
}

// ============================================
// 2. FETCH BOOK DETAILS BY ISBN
// ============================================
async function fetchBookByISBN(isbn) {
  try {
    const response = await fetch(`http://localhost:8080/api/books/search?isbn=${encodeURIComponent(isbn)}`);
    
    if (!response.ok) {
      console.warn(`Book not found for ISBN: ${isbn}`);
      return null;
    }
    
    const books = await response.json();
    
    // API returns an array, get the first book
    if (books && books.length > 0) {
      return books[0];
    }
    
    return null;
    
  } catch (error) {
    console.error(`Error fetching book ${isbn}:`, error);
    return null;
  }
}

// ============================================
// 3. DISPLAY ORDERS
// ============================================
async function displayOrders(orders) {
  const container = document.querySelector('.orders-container');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div class="no-orders">
        <h2>📦 No Pending Orders</h2>
        <p>All orders have been processed!</p>
      </div>
    `;
    return;
  }

  // Process each order
  for (const order of orders) {
    // Get order ID (handle different possible field names)
    const orderId = order.restockOrderId || order.restock_order_id || order.id || order.orderId;
    
    if (!orderId) {
      console.error('⚠️ Order missing ID:', order);
      continue;
    }
    
    // Fetch book details by ISBN
    const book = await fetchBookByISBN(order.isbn);
    
    const bookTitle = book?.title || order.bookTitle || 'Unknown Title';
    const bookAuthor = book?.authors ? (Array.isArray(book.authors) ? book.authors.join(', ') : book.authors) : 'Unknown Author';
    const bookImage = book?.imgPath || book?.img_path || '../images/bookcover.jpg';
    const bookPrice = order.totalPrice || (book?.sellingPrice || 0);
    
    // Format date
    const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A';
    
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.setAttribute('data-order-id', orderId);
    
    orderCard.innerHTML = `
      <div class="order-header">
        <h3>Order #${orderId}</h3>
        <span class="order-status">${order.status || 'Pending'}</span>
      </div>
      <div class="order-details">
        <p><strong>Date:</strong> ${orderDate}</p>
      </div>
      <div class="book-info">
        <div class="book-image">
          <img src="${bookImage}" alt="${bookTitle}" onerror="this.src='../images/bookcover10.jpg'">
        </div>
        <div class="book-details">
          <h4>Book Details:</h4>
          <p><strong>Title:</strong> ${bookTitle}</p>
          <p><strong>Author:</strong> ${bookAuthor}</p>
          <p><strong>ISBN:</strong> ${order.isbn}</p>
          <p><strong>Price:</strong> $${parseFloat(bookPrice).toFixed(2)}</p>
          <p><strong>Quantity:</strong> ${order.quantity || 1}</p>
        </div>
      </div>
      <div class="order-actions">
        <button class="confirm-btn" onclick="confirmOrder(${orderId})">Confirm Order</button>
      </div>
    `;
    
    container.appendChild(orderCard);
  }
}

// ============================================
// 4. CONFIRM ORDER FUNCTION
// ============================================
async function confirmOrder(orderId) {
  try {
    if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
      alert('Please login to confirm orders');
      return;
    }

    const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
    const confirmBtn = orderCard.querySelector(".confirm-btn");
    const statusSpan = orderCard.querySelector(".order-status");

    // Disable button and show loading
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Confirming...";

    // Send confirmation request
    const response = await window.TokenManager.fetchWithAuth(
      `http://localhost:8080/api/admin/orders/${orderId}/confirm`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to confirm order');
    }

    // Update UI on success
    orderCard.classList.add("confirmed");
    statusSpan.textContent = "Confirmed";
    confirmBtn.textContent = "Confirmed ✓";
    
    showMessage('✅ Order confirmed successfully!', 'success');
    
    console.log(`✅ Order ${orderId} confirmed`);

  } catch (error) {
    console.error('❌ Error confirming order:', error);
    
    // Re-enable button on error
    const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
    const confirmBtn = orderCard.querySelector(".confirm-btn");
    confirmBtn.disabled = false;
    confirmBtn.textContent = "Confirm Order";
    
    showMessage('Failed to confirm order: ' + error.message, 'error');
  }
}

// ============================================
// 5. UI HELPER FUNCTIONS
// ============================================
function showLoading(isLoading) {
  const container = document.querySelector('.orders-container');
  if (isLoading && container) {
    container.innerHTML = `
      <div class="loading">
        <h2>📦 Loading Orders...</h2>
      </div>
    `;
  }
}

function showMessage(text, type) {
  let messageEl = document.getElementById('message');
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.id = 'message';
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 8px;
      z-index: 1000;
      color: white;
      font-weight: bold;
      display: none;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(messageEl);
  }
  
  const colors = {
    success: '#4CAF50', 
    error: '#f44336',
    info: '#2196F3'
  };
  
  messageEl.textContent = text;
  messageEl.style.backgroundColor = colors[type] || colors.info;
  messageEl.style.display = 'block';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 4000);
}

// ============================================
// 6. INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('📦 Admin Accept Orders page loaded');
  
  // Load pending orders
  loadPendingOrders();
});
