package AlexUni.BookStore.AdminService.entity;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** OrderItem */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
  private Integer itemId;
  private Integer orderId;
  private String isbn;
  private String bookTitle;
  private Integer quantity;
  private BigDecimal priceAtPurchase;
}
