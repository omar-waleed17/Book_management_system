package AlexUni.BookStore.AuthenticationService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class JwtResponse {
  private String accessToken;
  private String refreshToken;
  private String tokenType = "Bearer";
  private String username;
  private String role;

  public JwtResponse(String accessToken, String refreshToken, String username, String role) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.username = username;
    this.role = role;
  }
}
