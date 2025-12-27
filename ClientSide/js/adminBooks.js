// adminBooks.js - ADMIN BOOK MANAGEMENT (NO CART)
let currentPage = 1;
const pageSize = 10;
let allBooks = [];

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
// 2. FETCH ALL BOOKS
// ============================================
async function fetchAllBooks() {
  if (!checkAuth()) return;
  
  try {
    showLoading(true);
    
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
// 3. DISPLAY BOOKS (ADMIN VIEW)
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
    const coverImage = book.imgPath || book.img_path || '../images/bookCover.jpg';
    const availableStock = book.quantityInStock || 0;
    
    card.innerHTML = `
      <img src="${coverImage}" alt="${book.title}" class="book-cover" onerror="this.src='../images/bookCover.jpg'">
      <div class="book-info">
        <h3 class="book-title">${book.title || 'Untitled'}</h3>
        <p class="book-category">📚 ${book.category || 'Unknown'}</p>
        <p class="book-author">👤 ${authors}</p>
        <p class="book-isbn">🔖 ${book.isbn || 'N/A'}</p>
        <p class="book-price">💰 $${(book.sellingPrice || 0).toFixed(2)}</p>
        <p class="book-stock">📦 ${availableStock} in stock</p>
        <button class="edit-book-btn" data-isbn="${book.isbn}" onclick="window.location.href='modifyBook.html?isbn=${encodeURIComponent(book.isbn)}'">
          ✏️ Modify Book
        </button>
      </div>
    `;
    
    list.appendChild(card);
  });
}

// ============================================
// 4. PAGINATION
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
// 5. SEARCH
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
// 6. UI HELPERS
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
// 7. INITIALIZE
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
  
  // Load books
  fetchAllBooks();
});

// Add CSS for edit button styling
const style = document.createElement('style');
style.textContent = `
  .edit-book-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #6c63ff, #00c6ff);
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
    background: linear-gradient(135deg, #5850e6, #00b3e6);
    box-shadow: 0 4px 12px rgba(108, 99, 255, 0.4);
  }
  
  .edit-book-btn:active {
    transform: scale(0.98);
  }
`;
document.head.appendChild(style); 