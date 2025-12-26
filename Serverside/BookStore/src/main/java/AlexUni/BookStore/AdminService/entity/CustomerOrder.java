package AlexUni.BookStore.AdminService.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** CustomerOrder */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CustomerOrder {
  private Integer orderId;
  private Integer userId;
  private LocalDateTime orderDate;
  private BigDecimal totalAmount;
  private String creditCardNumber;
  private String cardExpiryDate;
  private String status;
  private List<OrderItem> items;
}
