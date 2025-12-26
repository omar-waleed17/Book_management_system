package AlexUni.BookStore.BookService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import AlexUni.BookStore.AuthenticationService.dto.ApiResponse;
import AlexUni.BookStore.BookService.entity.Book;
import AlexUni.BookStore.BookService.service.BookService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;
    // TODO create dto later

    @GetMapping("") // old
    public ResponseEntity<?> getBooks() { 
        try {
            List<Book> books = bookService.loadAllBooks();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search") // this does everything 
    public ResponseEntity<?> getBooksByAdvancedSearch(
        @RequestParam(defaultValue = "") String isbn,
        @RequestParam(defaultValue = "") String title,
        @RequestParam(defaultValue = "") String category,
        @RequestParam(defaultValue = "") String author,
        @RequestParam(defaultValue = "") String publisher
        ) { 
        try {
            List<Book> books = bookService.loadBooksByAdvancedSearch(isbn, title, category, author, publisher);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{isbn}") // old
    public ResponseEntity<?> getBooksByIsbn(@PathVariable String isbn) {
        try {
            Book book = bookService.loadBookByISBN(isbn);
            return ResponseEntity.ok(book);
        } catch (Exception e) { // BookNotFoundException
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

//_________________________________________________________________________________________________

    @GetMapping("/search/title") // old
    public ResponseEntity<?> getBooksByTitle(@RequestParam String title) {
        try {
            List<Book> books = bookService.loadBookByTitle(title);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search/category") // old
    public ResponseEntity<?> getBooksByCategory(@RequestParam String category) {
        try {
            List<Book> books = bookService.loadBookByCategory(category);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search/author") // old
    public ResponseEntity<?> getBooksByAuthor(@RequestParam String author) {
        try {
            List<Book> books = bookService.loadBookByAuthor(author);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search/publisher") // old
    public ResponseEntity<?> getBooksByPublisher(@RequestParam String publisher) {
        try {
            List<Book> books = bookService.loadBookByPublisher(publisher);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    
}

