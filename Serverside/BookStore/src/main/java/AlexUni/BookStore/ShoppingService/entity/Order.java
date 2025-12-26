package AlexUni.BookStore.ShoppingService.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private int orderId;
    private int customerId;
    private String orderDate;
    private double totalAmount;
    private String cardNumber;
    private String cardExpiry;
    private List<String> bookIsbns;
}
