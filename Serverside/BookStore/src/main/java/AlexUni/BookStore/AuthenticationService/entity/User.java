package AlexUni.BookStore.AuthenticationService.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
  private Integer userId;
  private String username;
  private String password;
  private String firstName;
  private String lastName;
  private String email;
  private String phoneNumber;
  private String shippingAddress;
  private String role; 
}
