package AlexUni.BookStore.ShoppingService.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import AlexUni.BookStore.ShoppingService.entity.CartDetails;
import AlexUni.BookStore.ShoppingService.entity.ShoppingCart;
import AlexUni.BookStore.ShoppingService.service.ShoppingCartService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("api/customer")
public class ShoppingCartController {
    
    @Autowired
    private ShoppingCartService shoppingCartService;

    private String authenticateUserGetName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        return authentication.getName();
    }
    
    @GetMapping("/cart")
    public ResponseEntity<?> getCart() { 
        String userName = authenticateUserGetName();
        if (userName == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        try {
            List<CartDetails> items = shoppingCartService.loadAllCartContent(userName).getCartDetails();
            ShoppingCart shoppingCart = shoppingCartService.loadAllCartContent(userName); // userId obtained from acess token
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/cart/item")
    public ResponseEntity<?> addItemToCart(@RequestParam String isbn, @RequestParam int quantity) {
        String userName = authenticateUserGetName();
        if (userName == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        try {
            int rowsAffected = shoppingCartService.saveItemToCart(userName, isbn, quantity); // userId obtained from acess token
            return ResponseEntity.ok(rowsAffected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cart/item")
    public ResponseEntity<?> deleteItemFromCart(@RequestParam String isbn) {
        String userName = authenticateUserGetName();
        if (userName == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        try {
            int rowsAffected = shoppingCartService.deleteItemFromCart(userName, isbn); // userId obtained from acess token
            return ResponseEntity.ok(rowsAffected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/cart/item")
    public ResponseEntity<?> modifyItemInCart(@RequestParam String isbn, @RequestParam int quantity) {
        String userName = authenticateUserGetName();
        if (userName == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated"); 
        try {
            int rowsAffected = shoppingCartService.updateItemInCart(userName, isbn, quantity); // userId obtained from acess token
            return ResponseEntity.ok(rowsAffected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cart")
    public ResponseEntity<?> createNewCart() {
        String userName = authenticateUserGetName();
        if (userName == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        try {
            int rowsAffected = shoppingCartService.saveCartForUser(userName); // userId obtained from acess token
            return ResponseEntity.ok(rowsAffected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cart")
    public ResponseEntity<?> deleteCart() {
        String userName = authenticateUserGetName();
        if (userName == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        try {
            int rowsAffected = shoppingCartService.deleteCart(userName);
            return ResponseEntity.ok(rowsAffected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }    
    }
    
    
}
