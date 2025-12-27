// modifyBook.js - Edit Book Page Logic
let currentBook = null;

// ============================================
// 1. GET ISBN FROM URL
// ============================================
function getISBNFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('isbn');
}

// ============================================
// 2. LOAD BOOK DATA
// ============================================
async function loadBookData() {
  const isbn = getISBNFromURL();
  
  if (!isbn) {
    alert('No book ISBN provided!');
    window.location.href = 'AdminBooks.html';
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:8080/api/books/search?isbn=${encodeURIComponent(isbn)}`);
    
    if (!response.ok) {
      throw new Error('Failed to load book data');
    }
    
    const books = await response.json();
    
    if (!books || books.length === 0) {
      throw new Error('Book not found');
    }
    
    currentBook = books[0];
    populateForm(currentBook);
    
  } catch (error) {
    console.error('Error loading book:', error);
    alert('Failed to load book data: ' + error.message);
    window.location.href = 'AdminBooks.html';
  }
}

// ============================================
// 3. POPULATE FORM WITH BOOK DATA
// ============================================
function populateForm(book) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('editBookForm').style.display = 'flex';
  
  // Populate fields
  document.getElementById('isbn').value = book.isbn || '';
  document.getElementById('bookName').value = book.title || '';
  
  // Handle authors (could be array or string)
  let authorStr = '';
  if (Array.isArray(book.authors)) {
    authorStr = book.authors.join(', ');
  } else if (book.authors) {
    authorStr = book.authors;
  }
  document.getElementById('author').value = authorStr;
  
  document.getElementById('publisher').value = book.publisher || '';
  document.getElementById('price').value = book.sellingPrice || 0;
  document.getElementById('genre').value = book.category || '';
  document.getElementById('threshold').value = book.threshold || 0;
  document.getElementById('publicationYear').value = book.publicationYear || '';
  document.getElementById('quantityInStock').value = book.quantityInStock || 0;
  
  // Show current image if available
  const coverImage = book.imgPath || book.img_path;
  if (coverImage) {
    const imgContainer = document.getElementById('currentImageContainer');
    const img = document.getElementById('currentImage');
    img.src = coverImage;
    img.onerror = function() {
      this.src = '../images/default_book.jpg';
    };
    imgContainer.style.display = 'block';
  }
}

// ============================================
// 4. HANDLE FILE INPUT CHANGE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('bookImage');
  const fileName = document.querySelector('.file-name');
  
  if (fileInput && fileName) {
    fileInput.addEventListener('change', function() {
      if (this.files && this.files.length > 0) {
        fileName.textContent = this.files[0].name;
      } else {
        fileName.textContent = 'No file chosen';
      }
    });
  }
  
  // Load book data on page load
  loadBookData();
  
  // Setup form submission
  setupFormSubmit();
});

// ============================================
// 5. SETUP FORM SUBMISSION
// ============================================
function setupFormSubmit() {
  const form = document.getElementById('editBookForm');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
      alert('You must be logged in to edit books');
      window.location.href = '../index.html';
      return;
    }
    
    const formData = new FormData();
    
    // Add form fields
    formData.append('isbn', document.getElementById('isbn').value.trim());
    formData.append('title', document.getElementById('bookName').value.trim());
    formData.append('authors', document.getElementById('author').value.trim());
    formData.append('publisher', document.getElementById('publisher').value.trim());
    formData.append('sellingPrice', parseFloat(document.getElementById('price').value));
    formData.append('category', document.getElementById('genre').value);
    formData.append('threshold', parseInt(document.getElementById('threshold').value));
    formData.append('publicationYear', parseInt(document.getElementById('publicationYear').value));
    formData.append('quantityInStock', parseInt(document.getElementById('quantityInStock').value));
    
    // Add image if changed
    const imageFile = document.getElementById('bookImage').files[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    try {
      const submitBtn = form.querySelector('.book-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = '💾 Saving...';
      
      const response = await window.TokenManager.fetchWithAuth(
        'http://localhost:8080/api/admin/books',
        {
          method: 'PUT',
          body: formData,
          headers: {} // Don't set Content-Type, let browser set it with boundary
        }
      );
      
      if (response.ok) {
        alert('✅ Book updated successfully!');
        window.location.href = 'AdminBooks.html';
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update book');
      }
      
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book: ' + error.message);
      
      const submitBtn = form.querySelector('.book-btn');
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Save Changes';
    }
  });
}

// ============================================
// 6. VALIDATE PUBLICATION YEAR
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const yearInput = document.getElementById('publicationYear');
  if (yearInput) {
    const currentYear = new Date().getFullYear();
    yearInput.setAttribute('max', currentYear);
  }
});
