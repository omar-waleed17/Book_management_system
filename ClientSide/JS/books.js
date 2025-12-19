const books = [
  {
    isbn: "111",
    title: "The Art of Coding",
    authors: ["Jane Doe"],
    publisher: "TechPress",
    year: 2022,
    price: 29.99,
    category: "Science",
    stock: 12,
    cover: "../images/bookcover.jpg"
  },
  {
    isbn: "222",
    title: "History of Alexandria",
    authors: ["John Smith"],
    publisher: "HistoryHouse",
    year: 2021,
    price: 19.99,
    category: "History",
    stock: 5,
    cover: "../images/bookcover2.jpg"
  },
  {
    isbn: "333",
    title: "Fictional Dreams",
    authors: ["Alice Brown"],
    publisher: "NovelPress",
    year: 2020,
    price: 14.99,
    category: "Art",
    stock: 8,
    cover: "../images/bookcover3.jpg"
  },
  {
    isbn: "444",
    title: "Science Explained",
    authors: ["David Green"],
    publisher: "TechPress",
    year: 2019,
    price: 24.99,
    category: "Science",
    stock: 10,
    cover: "../images/bookcover4.jpg"
  },
  {
    isbn: "555",
    title: "Art of Life",
    authors: ["Emily White"],
    publisher: "LifeHouse",
    year: 2023,
    price: 12.99,
    category: "Art",
    stock: 7,
    cover: "../images/bookcover5.jpg"
  },
  {
    isbn: "666",
    title: "Religion & Culture",
    authors: ["Ahmed Ali"],
    publisher: "FaithPress",
    year: 2021,
    price: 18.99,
    category: "Religion",
    stock: 4,
    cover: "../images/bookcover6.jpg"
  },
  {
    isbn: "777",
    title: "World History",
    authors: ["Mary Johnson"],
    publisher: "HistoryHouse",
    year: 2020,
    price: 22.99,
    category: "History",
    stock: 6,
    cover: "../images/bookcover7.jpg"
  },
  {
    isbn: "888",
    title: "Geography Basics",
    authors: ["Sam Lee"],
    publisher: "GeoPress",
    year: 2022,
    price: 15.99,
    category: "Geography",
    stock: 9,
    cover: "../images/bookcover8.jpg"
  },
  {
    isbn: "999",
    title: "Extra Book",
    authors: ["Jane Doe"],
    publisher: "NovelPress",
    year: 2024,
    price: 20.99,
    category: "Science",
    stock: 3,
    cover: "../images/bookcover9.jpg"
  }
];
let currentPage = 1;
const pageSize = 10; 

function displayBooks(bookArray) {
  const list = document.getElementById("booksList");
  list.innerHTML = "";
  bookArray.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p class="category">Category: ${book.category}</p>
      <p class="author">👤 ${book.authors.join(", ")}</p>
      <p class="publisher">🏢 ${book.publisher}</p>
      <p class="isbn">🔖 ISBN: ${book.isbn}</p>
      <p class="price">💲 $${book.price.toFixed(2)}</p>
      <p class="stock">📦 In Stock: ${book.stock}</p>
      <button class="add-cart-btn">Add to Cart</button>
    `;
    list.appendChild(card);
  });
}

function filterBooks() {
  const titleQuery = document.getElementById("titleSearch").value.toLowerCase();
  const isbnQuery = document.getElementById("isbnSearch").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const authorQuery = document.getElementById("authorSearch").value.toLowerCase();
  const publisherQuery = document.getElementById("publisherSearch").value.toLowerCase();

  let filtered = books.filter(book => {
    const matchesTitle = titleQuery ? book.title.toLowerCase().includes(titleQuery) : true;
    const matchesISBN = isbnQuery ? book.isbn.toLowerCase().includes(isbnQuery) : true;
    const matchesCategory = category ? book.category === category : true;
    const matchesAuthor = authorQuery
      ? book.authors.some(a => a.toLowerCase().includes(authorQuery))
      : true;
    const matchesPublisher = publisherQuery
      ? book.publisher.toLowerCase().includes(publisherQuery)
      : true;

    return matchesTitle && matchesISBN && matchesCategory && matchesAuthor && matchesPublisher;
  });

  // If all inputs empty, show all books
  if (!titleQuery && !isbnQuery && !authorQuery && !publisherQuery && !category) {
    filtered = books;
  }

  paginateBooks(filtered);
}

function paginateBooks(bookArray) {
  const totalPages = Math.ceil(bookArray.length / pageSize);

  if (bookArray.length === 0) {
    document.querySelector(".page-info").textContent = "Page 0 of 0";
    document.querySelector(".page-btn.prev").disabled = true;
    document.querySelector(".page-btn.next").disabled = true;
    displayBooks([]);
    return;
  }

  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = bookArray.slice(start, end);

  displayBooks(pageItems);

  document.querySelector(".page-info").textContent =
    `Page ${currentPage} of ${totalPages}`;
  document.querySelector(".page-btn.prev").disabled = currentPage === 1;
  document.querySelector(".page-btn.next").disabled = currentPage === totalPages;
}


document.getElementById("searchBtn").addEventListener("click", () => {
  currentPage = 1;
  filterBooks();
});


document.querySelector(".page-btn.prev").addEventListener("click", () => {
  currentPage--;
  filterBooks();
});

document.querySelector(".page-btn.next").addEventListener("click", () => {
  currentPage++;
  filterBooks();
});

displayBooks([]);
document.querySelector(".page-info").textContent = "Page 0 of 0";
