package AlexUni.BookStore.AuthenticationService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ApiResponse {
  private boolean success;
  private String message;
  private Object data;

  public ApiResponse(boolean success, String message) {
    this.success = success;
    this.message = message;
  }
}
