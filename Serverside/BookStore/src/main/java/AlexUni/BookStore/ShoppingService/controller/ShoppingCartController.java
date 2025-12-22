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

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("api/customer")
public class ShoppingCartController {
    
    @Autowired
    private ShoppingCartService shoppingCartService;
    @Autowired

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
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
}
