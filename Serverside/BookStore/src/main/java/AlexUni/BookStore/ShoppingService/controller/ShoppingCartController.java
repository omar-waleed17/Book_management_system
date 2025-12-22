package AlexUni.BookStore.ShoppingService.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import AlexUni.BookStore.ShoppingService.entity.ShoppingCart;
import AlexUni.BookStore.ShoppingService.service.ShoppingCartService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("api/customer")
public class ShoppingCartController {
    
    @Autowired
    private ShoppingCartService shoppingCartService;
    
    @GetMapping("/cart")
    public ResponseEntity<?> getCart() { 
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        String username = authentication.getName();
        try {
            ShoppingCart shoppingCart = shoppingCartService.loadAllCartContent(username); // userId obtained from acess token
            return ResponseEntity.ok(shoppingCart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/cart/item")
    public ResponseEntity<?> addItemToCart(@RequestParam String isbn, @RequestParam int quantity) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        String username = authentication.getName();
        try {
            int rowsAffected = shoppingCartService.saveItemToCart(username, isbn, quantity); // userId obtained from acess token
            return ResponseEntity.ok(rowsAffected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cart")
    public ResponseEntity<?> createNewCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        String username = authentication.getName();
        try {
            int rowsAffected = shoppingCartService.saveCartForUser(username); // userId obtained from acess token
            return ResponseEntity.ok(rowsAffected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cart")
    public ResponseEntity<?> deleteCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        String username = authentication.getName();
        try {
            int rowsAffected = shoppingCartService.deleteCart(username);
            return ResponseEntity.ok(rowsAffected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }    
    }
    
    
}
