package AlexUni.BookStore.BookService.service;

import AlexUni.BookStore.AdminService.dto.BookRequest;
import AlexUni.BookStore.AdminService.entity.PublisherOrder;
import AlexUni.BookStore.AdminService.repository.PublisherOrderRepository;
import AlexUni.BookStore.BookService.entity.Book;
import AlexUni.BookStore.BookService.exceptions.BookNotFoundException;
import AlexUni.BookStore.BookService.repository.BookRepository;
import AlexUni.BookStore.BookService.repository.PublisherRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {
  @Autowired private BookRepository bookRepository;
  @Autowired private PublisherRepository publisherRepository;
  @Autowired private PublisherOrderRepository publisherOrderRepository;

  public List<Book> loadBooksByAdvancedSearch(
      String isbn, String title, String category, String author, String publisher) {
    return bookRepository.findByAdvancedSearch(isbn, title, category, author, publisher);
  }

  public Book loadBookByISBN(String isbn) {
    Book book =
        bookRepository
            .findByIsbn(isbn)
            .orElseThrow(() -> new BookNotFoundException("Book with ISBN " + isbn + " not found!"));
    return book;
  }

  public List<Book> loadAllBooks() {
    List<Book> books = bookRepository.findAllBooks();
    return books;
  }

  public List<Book> loadBookByTitle(String title) {
    return bookRepository.findByTitle(title);
  }

  public List<Book> loadBookByCategory(String category) {
    return bookRepository.findByCategory(category);
  }

  public List<Book> loadBookByAuthor(String author) {
    return bookRepository.findByAuthor(author);
  }

  public List<Book> loadBookByPublisher(String publisher) {
    return bookRepository.findByPublisher(publisher);
  }

  // admin role methods
  @Transactional
  public void addBook(BookRequest bookRequest) {
    if (bookRepository.exists(bookRequest.getIsbn())) {
      throw new RuntimeException("Book with this ISBN already exists");
    }

    if (!publisherRepository.exists(bookRequest.getPublisherId())) {
      throw new RuntimeException("Publisher not found");
    }

    Book book = new Book();
    book.setIsbn(bookRequest.getIsbn());
    book.setTitle(bookRequest.getTitle());
    book.setPublisherId(bookRequest.getPublisherId());
    book.setPublicationYear(bookRequest.getPublicationYear());
    book.setSellingPrice(bookRequest.getSellingPrice());
    ;
    book.setCategory(bookRequest.getCategory());
    book.setQuantityInStock(bookRequest.getQuantityInStock());
    book.setThresholdQuantity(bookRequest.getThresholdQuantity());

    bookRepository.save(book);

    // Add authors
    for (String authorName : bookRequest.getAuthors()) {
      Integer authorId = bookRepository.findOrCreateAuthor(authorName);
      bookRepository.addBookAuthor(bookRequest.getIsbn(), authorId);
    }
  }

  @Transactional
  public void updateBook(String isbn, BookRequest bookRequest) {
    Book existingBook =
        bookRepository.findByIsbn(isbn).orElseThrow(() -> new RuntimeException("Book not found"));

    if (!publisherRepository.exists(bookRequest.getPublisherId())) {
      throw new RuntimeException("Publisher not found");
    }

    existingBook.setTitle(bookRequest.getTitle());
    existingBook.setPublisherId(bookRequest.getPublisherId());
    existingBook.setPublicationYear(bookRequest.getPublicationYear());
    existingBook.setSellingPrice(bookRequest.getSellingPrice());
    existingBook.setCategory(bookRequest.getCategory());
    existingBook.setQuantityInStock(bookRequest.getQuantityInStock());
    existingBook.setThresholdQuantity(bookRequest.getThresholdQuantity());

    bookRepository.update(existingBook);

    // Update authors
    bookRepository.removeBookAuthors(isbn);
    for (String authorName : bookRequest.getAuthors()) {
      Integer authorId = bookRepository.findOrCreateAuthor(authorName);
      bookRepository.addBookAuthor(isbn, authorId);
    }
  }

  @Transactional
  public void confirmOrder(Integer orderId) {
    String isbn = publisherOrderRepository.getOrderIsbn(orderId);
    Integer quantity = publisherOrderRepository.getOrderQuantity(orderId);

    if (isbn == null || quantity == null) {
      throw new RuntimeException("Order not found");
    }

    bookRepository.increaseQuantity(isbn, quantity);

    // Confirm the order
    publisherOrderRepository.confirmOrder(orderId);
  }

  public List<Book> searchByTitle(String title) {
    return bookRepository.findByTitle(title);
  }

  public List<Book> findByCategory(String category) {
    return bookRepository.findByCategory(category);
  }

  public List<Book> findByAuthor(String author) {
    return bookRepository.findByAuthor(author);
  }

  public List<Book> findByPublisher(String publisher) {
    return bookRepository.findByPublisher(publisher);
  }

  public List<PublisherOrder> getPendingOrders() {
    return publisherOrderRepository.findPendingOrders();
  }

  public int getOrderCountForBook(String isbn) {
    return publisherOrderRepository.countOrdersForBook(isbn);
  }
}
