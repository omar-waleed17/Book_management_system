package AlexUni.BookStore.ShoppingService.entity;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCart {
    // private int userId;
    // private int cartId;
    @Builder.Default
    private List<CartDetails> items = new ArrayList<>();

    public List<CartDetails> getCartDetails() {
        return items;
    } 
}
