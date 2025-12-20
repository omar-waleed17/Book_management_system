package AlexUni.BookStore.BookService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import AlexUni.BookStore.BookService.entity.Book;
import AlexUni.BookStore.BookService.service.BookService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;
    // TODO create dto later

    @GetMapping("")
    public ResponseEntity<?> getBooks() { 
        try {
            List<Book> books = bookService.loadAllBooks();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{isbn}")
    public ResponseEntity<?> getBooksByIsbn(@PathVariable String isbn) {
        try {
            Book book = bookService.loadBookByISBN(isbn);
            return ResponseEntity.ok(book);
        } catch (Exception e) { // BookNotFoundException
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search/title")
    public ResponseEntity<?> getBooksByTitle(@RequestParam String title) {
        try {
            List<Book> books = bookService.loadBookByTitle(title);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search/category")
    public ResponseEntity<?> getBooksByCategory(@RequestParam String category) {
        try {
            List<Book> books = bookService.loadBookByCategory(category);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search/author")
    public ResponseEntity<?> getBooksByAuthor(@RequestParam String author) {
        try {
            List<Book> books = bookService.loadBookByAuthor(author);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search/publisher")
    public ResponseEntity<?> getBooksByPublisher(@RequestParam String publisher) {
        try {
            List<Book> books = bookService.loadBookByPublisher(publisher);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // @PostMapping("path")
    // public String postNewBook(@RequestBody String entity) {
    //     //TODO: process POST request
        
    //     return entity;
    // }

    // @PostMapping("path")
    // public String UpdateExistingBook(@RequestBody String entity) {
    //     //TODO: process POST request
        
    //     return entity;
    // }
    
    
}

