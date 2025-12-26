package AlexUni.BookStore.AdminService.entity;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** PublisherOrder */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublisherOrder {
  private Integer orderId;
  private String isbn;
  private Integer adminIdConfirmed;
  private Integer PublisherId;
  private Integer quantity;
  private LocalDateTime orderDate;
  private String status; // Pending, Confirmed
}
