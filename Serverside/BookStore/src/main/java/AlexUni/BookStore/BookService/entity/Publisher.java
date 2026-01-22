package AlexUni.BookStore.BookService.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Publisher */
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Publisher {
  private Integer publisherId;
  private String name;
  private String address;
  private String telephone;
}
