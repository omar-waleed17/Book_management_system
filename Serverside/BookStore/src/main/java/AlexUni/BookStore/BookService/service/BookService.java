package AlexUni.BookStore.BookService.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AlexUni.BookStore.BookService.entity.Book;
import AlexUni.BookStore.BookService.exceptions.BookNotFoundException;
import AlexUni.BookStore.BookService.repository.BookRepository;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;
    
    public List<Book> loadBooksByAdvancedSearch(String isbn, String title, String category, String author, String publisher) {
        return bookRepository.findByAdvancedSearch(isbn, title, category, author, publisher);
    }
    
    public Book loadBookByISBN(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
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
    public Book createBook(Book book) {
        int rowsAffected = bookRepository.saveBook(book);
        if (rowsAffected > 0) {
            return book; // Return the saved book
        }
        throw new RuntimeException("Failed to insert book");
    }
    
    public Book updateBook(Book book) {
        int rowsAffected = bookRepository.modifyBook(book);
        if (rowsAffected == 0) {
            throw new BookNotFoundException("Cannot update. Book not found: " + book.getIsbn());
        }
        return book;
    }

    
}
