// Set current year as max for publication year
const currentYear = new Date().getFullYear();
document.getElementById('publicationYear').setAttribute('max', currentYear);

// Update file name display when file is selected
document.getElementById('bookImage').addEventListener('change', function(e) {
  const file = e.target.files[0];
  
  if (file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please select only JPG, JPEG, or PNG images.');
      e.target.value = '';
      document.querySelector('.file-name').textContent = 'No file chosen';
      return;
    }
    
    // Validate file size (optional: max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB.');
      e.target.value = '';
      document.querySelector('.file-name').textContent = 'No file chosen';
      return;
    }
    
    document.querySelector('.file-name').textContent = file.name;
  } else {
    document.querySelector('.file-name').textContent = 'No file chosen';
  }
});

// Restore form data from sessionStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedFormData = sessionStorage.getItem('createBookFormData');
  if (savedFormData) {
    const formData = JSON.parse(savedFormData);
    const form = document.querySelector('.book-form');
    
    if (formData.isbn) form.isbn.value = formData.isbn;
    if (formData.bookName) form.bookName.value = formData.bookName;
    if (formData.author) form.author.value = formData.author;
    if (formData.publisher) form.publisher.value = formData.publisher;
    if (formData.price) form.price.value = formData.price;
    if (formData.genre) form.genre.value = formData.genre;
    if (formData.threshold) form.threshold.value = formData.threshold;
    if (formData.publicationYear) form.publicationYear.value = formData.publicationYear;
  }
});

// Save form data to sessionStorage as user types (except file input)
document.querySelector('.book-form').addEventListener('input', (e) => {
  if (e.target.type !== 'file') {
    const form = e.currentTarget;
    const formData = {
      isbn: form.isbn.value,
      bookName: form.bookName.value,
      author: form.author.value,
      publisher: form.publisher.value,
      price: form.price.value,
      genre: form.genre.value,
      threshold: form.threshold.value,
      publicationYear: form.publicationYear.value
    };
    sessionStorage.setItem('createBookFormData', JSON.stringify(formData));
  }
});

// Handle form submission
document.querySelector('.book-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const imageFile = form.bookImage.files[0];
  
  // Additional validation on submit
  if (!imageFile) {
    alert('Please select a book image.');
    return;
  }
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(imageFile.type)) {
    alert('Only JPG, JPEG, and PNG images are allowed.');
    return;
  }
  
  // Convert image to base64 for localStorage
  let imageBase64 = '';
  if (imageFile) {
    imageBase64 = await convertToBase64(imageFile);
  }

  const bookData = {
    isbn: form.isbn.value.trim(),
    bookName: form.bookName.value.trim(),
    author: form.author.value.trim(),
    publisher: form.publisher.value.trim(),
    price: parseFloat(form.price.value),
    image: imageBase64,
    genre: form.genre.value,
    threshold: parseInt(form.threshold.value),
    publicationYear: parseInt(form.publicationYear.value)
  };

  // Validation
  if (bookData.isbn.length < 10 || bookData.isbn.length > 13) {
    alert('ISBN must be between 10 and 13 characters.');
    return;
  }

  if (bookData.price <= 0) {
    alert('Price must be greater than 0.');
    return;
  }

  if (bookData.publicationYear < 1890 || bookData.publicationYear > currentYear) {
    alert(`Publication year must be between 1890 and ${currentYear}.`);
    return;
  }

  if (bookData.threshold < 0) {
    alert('Threshold cannot be negative.');
    return;
  }

  // Save to localStorage (can be modified to send to backend)
  let books = JSON.parse(localStorage.getItem('books')) || [];
  
  // Check if ISBN already exists
  if (books.some(book => book.isbn === bookData.isbn)) {
    alert('A book with this ISBN already exists.');
    return;
  }

  books.push(bookData);
  localStorage.setItem('books', JSON.stringify(books));

  // Clear sessionStorage after successful submission
  sessionStorage.removeItem('createBookFormData');

  alert('Book added successfully!');
  form.reset();
  document.querySelector('.file-name').textContent = 'No file chosen';
});

// Helper function to convert file to base64
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
