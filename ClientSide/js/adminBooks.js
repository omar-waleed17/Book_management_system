// books.js - WITH FIXED CART CREATION
let currentPage = 1;
const pageSize = 10;
let allBooks = [];
let cartItems = {}; // Store cart items from database: {isbn: quantity}

// ============================================
// 1. CHECK AUTHENTICATION
// ============================================
function checkAuth() {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../index.html";
    return false;
  }
  return true;
}

// ============================================
// 2. LOAD CART FROM DATABASE
// ============================================
async function loadCartFromDatabase() {
  try {
    if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
      return;
    }
    
    console.log('🛒 Loading cart from database...');
    
    const response = await window.TokenManager.fetchWithAuth(
      'http://localhost:8080/api/customer/cart',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      const cartData = await response.json();
      console.log('✅ Cart loaded:', cartData);
      
      // Reset cartItems
      cartItems = {};
      
      // Extract items from cart
      if (cartData.items && Array.isArray(cartData.items)) {
        cartData.items.forEach(item => {
          if (item.isbn) {
            cartItems[item.isbn] = item.quantity || 1;
          }
        });
        console.log(`📚 Found ${Object.keys(cartItems).length} books in cart`);
      }
    } else if (response.status === 404) {
      console.log('🛒 No cart found in database');
      cartItems = {};
    }
    
  } catch (error) {
    console.error('❌ Error loading cart:', error);
    cartItems = {};
  }
}

// ============================================
// 3. FETCH ALL BOOKS
// ============================================
async function fetchAllBooks() {
  if (!checkAuth()) return;
  
  try {
    showLoading(true);
    
    // Load cart first
    await loadCartFromDatabase();
    
    console.log('📚 Fetching books...');
    const response = await fetch('http://localhost:8080/api/books/search');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    allBooks = await response.json();
    console.log(`✅ Fetched ${allBooks.length} books`);
    
    paginateBooks(allBooks);
    
  } catch (error) {
    console.error('❌ Error:', error);
    showMessage('Failed to load books.', 'error');
    displayBooks([]);
  } finally {
    showLoading(false);
  }
}

// ============================================
// 4. DISPLAY BOOKS WITH CART CHECK
// ============================================
function displayBooks(bookArray) {
  const list = document.getElementById("booksList");
  if (!list) return;
  
  list.innerHTML = "";
  
  if (bookArray.length === 0) {
    list.innerHTML = '<div class="no-books"><p>📚 No books found</p></div>';
    return;
  }
  
  bookArray.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    
    // Handle authors
    let authors = 'Unknown';
    if (book.authors && Array.isArray(book.authors)) {
      authors = book.authors.join(", ");
    } else if (book.authors) {
      authors = book.authors;
    }
    
    // Handle image
    const coverImage = book.imgPath || book.img_path || '../images/default_book.jpg';
    
    // Check if book is in cart
    const inCartQuantity = cartItems[book.isbn] || 0;
    const isInCart = inCartQuantity > 0;
    const availableStock = book.quantityInStock || 0;
    
    card.innerHTML = `
      <img src="${coverImage}" alt="${book.title}" class="book-cover" onerror="this.src='../images/default_book.jpg'">
      <div class="book-info">
        <h3 class="book-title">${book.title || 'Untitled'}</h3>
        <p class="book-category">📚 ${book.category || 'Unknown'}</p>
        <p class="book-author">👤 ${authors}</p>
        <p class="book-isbn">🔖 ${book.isbn || 'N/A'}</p>
        <p class="book-price">💰 $${(book.sellingPrice || 0).toFixed(2)}</p>
        <p class="book-stock">📦 ${availableStock} in stock</p>
        <button class="edit-book-btn" data-isbn="${book.isbn}" onclick="window.location.href='modifyBook.html?isbn=${encodeURIComponent(book.isbn)}'">
          ✏️ Edit Book
        </button>
        ${isInCart ? `
          <div class="cart-controls">
            <p class="in-cart">🛒 ${inCartQuantity} in cart</p>
            <div class="cart-buttons">
              <button class="cart-btn remove" data-isbn="${book.isbn}">−</button>
              <span class="cart-quantity">${inCartQuantity}</span>
              <button class="cart-btn add" data-isbn="${book.isbn}" ${inCartQuantity >= availableStock ? 'disabled' : ''}>+</button>
            </div>
          </div>
        ` : `
          <button class="add-cart-btn" data-isbn="${book.isbn}">
            🛒 Add to Cart
          </button>
        `}
      </div>
    `;
    
    list.appendChild(card);
  });
  
  // Add cart button listeners
  addCartButtonListeners();
}

// ============================================
// 5. CART HELPER FUNCTIONS
// ============================================
async function ensureCartExists() {
  try {
    // First try to get cart to see if it exists
    const response = await window.TokenManager.fetchWithAuth(
      'http://localhost:8080/api/customer/cart',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      console.log('✅ Cart exists');
      return true;
    } else if (response.status === 404) {
      console.log('🛒 Cart not found, creating...');
      return await createCart();
    } else {
      console.error('❌ Error checking cart:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error ensuring cart exists:', error);
    return false;
  }
}

async function createCart() {
  try {
    console.log('🛒 Creating new cart...');
    const response = await window.TokenManager.fetchWithAuth(
      'http://localhost:8080/api/customer/cart',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      console.log('✅ Cart created successfully');
      return true;
    } else {
      const errorData = await response.json();
      console.error('❌ Failed to create cart:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Create cart error:', error);
    return false;
  }
}

// ============================================
// 6. ADD TO CART FUNCTIONS
// ============================================
function addCartButtonListeners() {
  // Add to cart buttons
  document.querySelectorAll('.add-cart-btn').forEach(button => {
    button.addEventListener('click', async function() {
      const isbn = this.getAttribute('data-isbn');
      await addToCart(isbn, this);
    });
  });
  
  // Plus buttons
  document.querySelectorAll('.cart-btn.add').forEach(button => {
    button.addEventListener('click', async function() {
      const isbn = this.getAttribute('data-isbn');
      const book = allBooks.find(b => b.isbn === isbn);
      const currentQuantity = cartItems[isbn] || 0;
      await updateCartItem(isbn, currentQuantity + 1, book);
    });
  });
  
  // Minus buttons
  document.querySelectorAll('.cart-btn.remove').forEach(button => {
    button.addEventListener('click', async function() {
      const isbn = this.getAttribute('data-isbn');
      const currentQuantity = cartItems[isbn] || 0;
      if (currentQuantity > 1) {
        await updateCartItem(isbn, currentQuantity - 1);
      } else {
        await removeFromCart(isbn);
      }
    });
  });
}

async function addToCart(isbn, buttonElement) {
  try {
    // Check authentication
    if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
      alert('Please login to add items to cart');
      window.location.href = '../index.html';
      return;
    }
    
    console.log(`Adding book ${isbn} to cart...`);
    
    // Disable button temporarily
    buttonElement.disabled = true;
    const originalText = buttonElement.textContent;
    buttonElement.textContent = 'Adding...';
    
    // First ensure cart exists
    const cartExists = await ensureCartExists();
    if (!cartExists) {
      throw new Error('Failed to create or access cart');
    }
    
    // Add item to cart using POST (adds quantity to existing)
    const response = await window.TokenManager.fetchWithAuth(
      `http://localhost:8080/api/customer/cart/item?isbn=${isbn}&quantity=1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      // Update local cart state
      cartItems[isbn] = (cartItems[isbn] || 0) + 1;
      
      // Refresh the display to show cart controls
      paginateBooks(allBooks);
      
      showMessage('✅ Book added to cart!', 'success');
      
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add to cart');
    }
    
  } catch (error) {
    console.error('❌ Add to cart error:', error);
    
    // Re-enable button on error
    buttonElement.disabled = false;
    buttonElement.textContent = '🛒 Add to Cart';
    
    showMessage('Failed: ' + error.message, 'error');
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      alert('Session expired. Please login again.');
      window.location.href = '../index.html';
    }
  }
}

async function updateCartItem(isbn, newQuantity, book = null) {
  try {
    if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
      return;
    }
    
    // First ensure cart exists
    const cartExists = await ensureCartExists();
    if (!cartExists) {
      showMessage('❌ Cart not available', 'error');
      return;
    }
    
    // If book not provided, find it
    if (!book) {
      book = allBooks.find(b => b.isbn === isbn);
    }
    
    const availableStock = book?.quantityInStock || 0;
    
    // Check stock
    if (newQuantity > availableStock) {
      showMessage('❌ Cannot exceed available stock!', 'error');
      return;
    }
    
    console.log(`Updating book ${isbn} quantity to ${newQuantity}...`);
    
    // Update cart item using PUT
    const response = await window.TokenManager.fetchWithAuth(
      `http://localhost:8080/api/customer/cart/item?isbn=${isbn}&quantity=${newQuantity}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      // Update local cart state
      cartItems[isbn] = newQuantity;
      
      // Refresh the display
      paginateBooks(allBooks);
      
      showMessage('✅ Cart updated!', 'success');
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update cart');
    }
    
  } catch (error) {
    console.error('❌ Update cart error:', error);
    showMessage('Failed: ' + error.message, 'error');
  }
}

async function removeFromCart(isbn) {
  try {
    if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
      return;
    }
    
    // First ensure cart exists
    const cartExists = await ensureCartExists();
    if (!cartExists) {
      showMessage('❌ Cart not available', 'error');
      return;
    }
    
    console.log(`Removing book ${isbn} from cart...`);
    
    // Remove item by setting quantity to 0 (deletes it)
    const response = await window.TokenManager.fetchWithAuth(
      `http://localhost:8080/api/customer/cart/item?isbn=${isbn}&quantity=0`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      // Update local cart state
      delete cartItems[isbn];
      
      // Refresh the display
      paginateBooks(allBooks);
      
      showMessage('✅ Item removed from cart!', 'success');
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove from cart');
    }
    
  } catch (error) {
    console.error('❌ Remove from cart error:', error);
    showMessage('Failed: ' + error.message, 'error');
  }
}

// ============================================
// 7. PAGINATION
// ============================================
function paginateBooks(bookArray) {
  const totalPages = Math.ceil(bookArray.length / pageSize);
  const pageInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".page-btn.prev");
  const nextBtn = document.querySelector(".page-btn.next");
  
  if (bookArray.length === 0) {
    if (pageInfo) pageInfo.textContent = "Page 0 of 0";
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    displayBooks([]);
    return;
  }
  
  if (currentPage > totalPages) currentPage = totalPages;
  
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = bookArray.slice(start, end);
  
  displayBooks(pageItems);
  
  if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

// ============================================
// 8. SEARCH
// ============================================
async function searchBooks() {
  if (!checkAuth()) return;
  
  try {
    showLoading(true);
    currentPage = 1;
    
    // Get search values
    const title = document.getElementById("titleSearch").value.trim();
    const isbn = document.getElementById("isbnSearch").value.trim();
    const category = document.getElementById("categoryFilter").value;
    const author = document.getElementById("authorSearch").value.trim();
    const publisher = document.getElementById("publisherSearch").value.trim();
    
    // Build URL
    let url = 'http://localhost:8080/api/books/search?';
    const params = [];
    
    if (title) params.push(`title=${encodeURIComponent(title)}`);
    if (isbn) params.push(`isbn=${encodeURIComponent(isbn)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (author) params.push(`author=${encodeURIComponent(author)}`);
    if (publisher) params.push(`publisher=${encodeURIComponent(publisher)}`);
    
    url += params.join('&');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    allBooks = await response.json();
    paginateBooks(allBooks);
    
  } catch (error) {
    console.error('❌ Search error:', error);
    showMessage('Search failed.', 'error');
  } finally {
    showLoading(false);
  }
}

// ============================================
// 9. UI HELPERS
// ============================================
function showLoading(isLoading) {
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.disabled = isLoading;
    searchBtn.textContent = isLoading ? 'Searching...' : 'Search';
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
      padding: 15px;
      border-radius: 5px;
      z-index: 1000;
      color: white;
      font-weight: bold;
      display: none;
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
  }, 3000);
}

// ============================================
// 10. DEBUG FUNCTION
// ============================================
async function debugCartCreation() {
  console.log('=== DEBUG: Cart Creation ===');
  
  if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
    console.log('❌ Not logged in');
    return;
  }
  
  // Test GET cart
  console.log('Testing GET /api/customer/cart...');
  try {
    const getResponse = await window.TokenManager.fetchWithAuth(
      'http://localhost:8080/api/customer/cart',
      { method: 'GET' }
    );
    console.log('GET Status:', getResponse.status);
    
    if (getResponse.ok) {
      const cart = await getResponse.json();
      console.log('Cart exists:', cart);
    } else if (getResponse.status === 404) {
      console.log('Cart does not exist (404)');
      
      // Test POST cart
      console.log('Testing POST /api/customer/cart...');
      const postResponse = await window.TokenManager.fetchWithAuth(
        'http://localhost:8080/api/customer/cart',
        { method: 'POST' }
      );
      console.log('POST Status:', postResponse.status);
      
      if (postResponse.ok) {
        console.log('✅ Cart created successfully');
      } else {
        const error = await postResponse.json();
        console.error('❌ POST failed:', error);
      }
    }
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

// ============================================
// 11. INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('📚 Books page loaded');
  
  // Setup search button
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", searchBooks);
  }
  
  // Setup pagination
  const prevBtn = document.querySelector(".page-btn.prev");
  const nextBtn = document.querySelector(".page-btn.next");
  
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        paginateBooks(allBooks);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(allBooks.length / pageSize);
      if (currentPage < totalPages) {
        currentPage++;
        paginateBooks(allBooks);
      }
    });
  }
  
  // Enter key support
  const inputs = ['titleSearch', 'isbnSearch', 'authorSearch', 'publisherSearch'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          searchBooks();
        }
      });
    }
  });
  
  // Category filter
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.addEventListener('change', searchBooks);
  }
  
  // Debug button (temporary)
  const debugBtn = document.createElement('button');
  debugBtn.textContent = 'Debug Cart';
  debugBtn.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #ff9800;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    z-index: 1000;
  `;
  debugBtn.addEventListener('click', debugCartCreation);
  document.body.appendChild(debugBtn);
  
  // Load books
  fetchAllBooks();
});

// Add CSS for cart display
const style = document.createElement('style');
style.textContent = `
  .in-cart {
    font-weight: bold;
    color: #4CAF50;
    margin: 5px 0;
    text-align: center;
  }
  
  .cart-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
  }
  
  .cart-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .cart-btn {
    width: 35px;
    height: 35px;
    border: none;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
  }
  
  .cart-btn.add {
    background-color: #4CAF50;
    color: white;
  }
  
  .cart-btn.add:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  .cart-btn.add:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .cart-btn.remove {
    background-color: #f44336;
    color: white;
  }
  
  .cart-btn.remove:hover {
    background-color: #d32f2f;
  }
  
  .cart-quantity {
    font-size: 18px;
    font-weight: bold;
    min-width: 30px;
    text-align: center;
  }
  
  .edit-book-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #FFA726, #FB8C00);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    margin-top: 10px;
    transition: all 0.3s ease;
  }
  
  .edit-book-btn:hover {
    background: linear-gradient(135deg, #FB8C00, #F57C00);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 167, 38, 0.4);
  }
  
  .edit-book-btn:active {
    transform: translateY(0);
  }
`;
document.head.appendChild(style);