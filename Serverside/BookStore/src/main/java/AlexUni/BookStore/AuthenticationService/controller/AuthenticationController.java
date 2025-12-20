package AlexUni.BookStore.AuthenticationService.controller;

import AlexUni.BookStore.AuthenticationService.dto.ApiResponse;
import AlexUni.BookStore.AuthenticationService.dto.JwtResponse;
import AlexUni.BookStore.AuthenticationService.dto.LoginRequest;
import AlexUni.BookStore.AuthenticationService.dto.RefreshTokenRequest;
import AlexUni.BookStore.AuthenticationService.dto.SignupRequest;
import AlexUni.BookStore.AuthenticationService.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

  @Autowired private AuthenticationService authService;

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
    try {
      JwtResponse jwtResponse = authService.login(loginRequest);
      return ResponseEntity.ok(jwtResponse);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new ApiResponse(false, "Invalid username or password"));
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
    try {
      authService.signup(signupRequest);
      return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
    }
  }

  @PostMapping("/refresh")
  public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
    try {
      JwtResponse jwtResponse = authService.refreshAccessToken(request.getRefreshToken());
      return ResponseEntity.ok(jwtResponse);
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new ApiResponse(false, e.getMessage()));
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(@Valid @RequestBody RefreshTokenRequest request) {
    try {
      authService.logout(request.getRefreshToken());
      return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(new ApiResponse(false, "Logout failed"));
    }
  }
}
