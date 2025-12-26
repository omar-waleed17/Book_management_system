package AlexUni.BookStore.ShoppingService.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDetails {
    // private int cartId;
    private String isbn;
    private String title;
    private int quantity;   
    private int maxQuantity;
    private String imgPath ;
    private double unitprice;
}
