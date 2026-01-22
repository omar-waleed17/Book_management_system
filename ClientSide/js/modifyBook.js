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
    console.log('📚 Loaded book data:', currentBook);
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
  
  // Store publisherId for later use
  currentBook = {
    ...book,
    publisherId: book.publisherId || book.publisher_id
  };
  
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
  document.getElementById('threshold').value = book.thresholdQuantity || book.threshold || 0;
  document.getElementById('publicationYear').value = book.publicationYear || '';
  document.getElementById('quantityInStock').value = book.quantityInStock || 0;
  
  // Show current image if available
  const coverImage = book.imgPath || book.img_path;
  if (coverImage) {
    const imgContainer = document.getElementById('currentImageContainer');
    const img = document.getElementById('currentImage');
    img.src = coverImage;
    img.onerror = function() {
      this.src = '../images/bookcover.jpg';
    };
    imgContainer.style.display = 'block';
  }
}

// ============================================
// 4. INITIALIZE ON DOM LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Get ISBN for URL
    const isbn = document.getElementById('isbn').value.trim();
    
    // Parse authors (comma-separated string to array)
    const authorsStr = document.getElementById('author').value.trim();
    const authorsArray = authorsStr.split(',').map(a => a.trim()).filter(a => a.length > 0);
    
    if (authorsArray.length === 0) {
      alert('At least one author is required');
      return;
    }
    
    // Validate ISBN format (must be 13 digits)
    if (!/^\d{13}$/.test(isbn)) {
      alert(`Invalid ISBN format: "${isbn}"\nISBN must be exactly 13 digits.`);
      return;
    }
    
    // Validate publisherId exists
    if (!currentBook.publisherId) {
      alert('Publisher ID is missing. Cannot update book.');
      return;
    }
    
    // Build request body matching BookRequest DTO
    const requestBody = {
      isbn: isbn,
      title: document.getElementById('bookName').value.trim(),
      publisherId: currentBook.publisherId,
      publicationYear: parseInt(document.getElementById('publicationYear').value),
      sellingPrice: parseFloat(document.getElementById('price').value),
      category: document.getElementById('genre').value,
      quantityInStock: parseInt(document.getElementById('quantityInStock').value),
      thresholdQuantity: parseInt(document.getElementById('threshold').value),
      authors: authorsArray
    };
    
    // Log request for debugging
    console.log('📤 Sending update request:', {
      url: `http://localhost:8080/api/admin/books/${isbn}`,
      body: requestBody
    });
    
    try {
      const submitBtn = form.querySelector('.book-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = '💾 Saving...';
      
      const response = await window.TokenManager.fetchWithAuth(
        `http://localhost:8080/api/admin/books/${encodeURIComponent(isbn)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );
      
      if (response.ok) {
        alert('✅ Book updated successfully!');
        window.location.href = 'AdminBooks.html';
      } else {
        const errorData = await response.json();
        console.error('❌ Server error response:', errorData);
        throw new Error(errorData.message || 'Failed to update book');
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
