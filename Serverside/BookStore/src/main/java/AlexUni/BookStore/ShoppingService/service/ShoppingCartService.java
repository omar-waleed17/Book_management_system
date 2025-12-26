package AlexUni.BookStore.ShoppingService.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AlexUni.BookStore.ShoppingService.entity.CartDetails;
import AlexUni.BookStore.ShoppingService.entity.ShoppingCart;
import AlexUni.BookStore.ShoppingService.repository.CartDetailsRepository;
import AlexUni.BookStore.ShoppingService.repository.ShoppingCartRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class ShoppingCartService {
    @Autowired
    private ShoppingCartRepository shoppingCartRepository;
    @Autowired
    private CartDetailsRepository cartDetailsRepository;
    
    public ShoppingCart loadAllCartContent(String userName) {
        ShoppingCart shoppingCart = shoppingCartRepository.findAllCartDetails(userName).orElseThrow(() -> new UsernameNotFoundException("User not found: " + userName));
        return shoppingCart;
    }

    public int saveCartForUser(String userName) {
        int rowsAffected = shoppingCartRepository.createCartForUser(userName).orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userName));
        return rowsAffected;
    }

    public int saveItemToCart(String userName, String isbn, int quantity) {
        // TODO: check if quantity is available in stock
        int rowsAffected = cartDetailsRepository.addItemToCart(userName, isbn, quantity).orElseThrow(() -> new UsernameNotFoundException("User not found: " + userName));
        return rowsAffected;
    }

    public int deleteCart(String userName) {
        int rowsAffected = shoppingCartRepository.deleteCartByUsername(userName).orElseThrow(() -> new UsernameNotFoundException("User not found: " + userName));
        return rowsAffected;
    }

    public int updateItemInCart(String userName, String isbn, int quantity) {
        // TODO: check if quantity is available in stock
        int rowsAffected = cartDetailsRepository.updateItemToCart(userName, isbn, quantity).orElseThrow(() -> new UsernameNotFoundException("User not found: " + userName));
        return rowsAffected;
    }

    public int deleteItemFromCart(String userName, String isbn) {
        int rowsAffected = cartDetailsRepository.deleteItemFromCart(userName, isbn).orElseThrow(() -> new UsernameNotFoundException("User not found: " + userName));
        return rowsAffected;
    }

    protected double calculateTotalPrice(List<CartDetails> orderDetails) {
        double totalPrice = 0;
        for (CartDetails item : orderDetails) {
            totalPrice += item.getUnitPrice() * item.getQuantity();
        }
        return totalPrice;
    }
}
