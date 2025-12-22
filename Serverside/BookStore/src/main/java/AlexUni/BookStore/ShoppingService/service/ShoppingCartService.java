package AlexUni.BookStore.ShoppingService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AlexUni.BookStore.ShoppingService.entity.ShoppingCart;
import AlexUni.BookStore.ShoppingService.repository.ShoppingCartRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class ShoppingCartService {
    @Autowired
    private ShoppingCartRepository shoppingCartRepository;
    
    public ShoppingCart loadAllCartContent(String userName) {
        ShoppingCart shoppingCart = shoppingCartRepository.findAllCartDetails(userName).orElseThrow(() -> new UsernameNotFoundException("User not found: " + userName));
        return shoppingCart;
    }
}
