package AlexUni.BookStore.AdminService.controller;

import AlexUni.BookStore.AdminService.dto.BookRequest;
import AlexUni.BookStore.AdminService.entity.PublisherOrder;
import AlexUni.BookStore.AdminService.repository.CustomerOrderRepository;
import AlexUni.BookStore.AuthenticationService.dto.ApiResponse;
import AlexUni.BookStore.BookService.service.BookService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** AdminController */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

  @Autowired private BookService bookService;

  @Autowired private CustomerOrderRepository customerOrderRepository;

  @PostMapping("/books")
  public ResponseEntity<?> addBook(@Valid @RequestBody BookRequest bookRequest) {
    try {
      bookService.addBook(bookRequest);
      return ResponseEntity.ok(new ApiResponse(true, "Book added successfully"));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
    }
  }

  @PutMapping("/books/{isbn}")
  public ResponseEntity<?> updateBook(
      @PathVariable String isbn, @Valid @RequestBody BookRequest bookRequest) {
    try {
      bookService.updateBook(isbn, bookRequest);
      return ResponseEntity.ok(new ApiResponse(true, "Book updated successfully"));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
    }
  }

  @GetMapping("/orders/pending")
  public ResponseEntity<List<PublisherOrder>> getPendingOrders() {
    return ResponseEntity.ok(bookService.getPendingOrders());
  }

  @PostMapping("/orders/{orderId}/confirm")
  public ResponseEntity<?> confirmOrder(@PathVariable Integer orderId) {
    try {
      bookService.confirmOrder(orderId);
      return ResponseEntity.ok(new ApiResponse(true, "Order confirmed successfully"));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
    }
  }

  // Reports
  @GetMapping("/reports/sales/last-month")
  public ResponseEntity<?> getLastMonthSales() {
    Map<String, Object> response = new HashMap<>();
    response.put("totalSales", customerOrderRepository.getTotalSalesLastMonth());
    return ResponseEntity.ok(response);
  }

  @GetMapping("/reports/sales/date")
  public ResponseEntity<?> getSalesByDate(@RequestParam String date) {
    Map<String, Object> response = new HashMap<>();
    response.put("date", date);
    response.put("totalSales", customerOrderRepository.getTotalSalesForDate(date));
    return ResponseEntity.ok(response);
  }

  @GetMapping("/reports/top-customers")
  public ResponseEntity<?> getTop5Customers() {
    return ResponseEntity.ok(customerOrderRepository.getTop5Customers());
  }

  @GetMapping("/reports/top-books")
  public ResponseEntity<?> getTop10SellingBooks() {
    return ResponseEntity.ok(customerOrderRepository.getTop10SellingBooks());
  }
}
