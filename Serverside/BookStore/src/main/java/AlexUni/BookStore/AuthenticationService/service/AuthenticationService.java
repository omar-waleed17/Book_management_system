package AlexUni.BookStore.AuthenticationService.service;

import AlexUni.BookStore.AuthenticationService.dto.JwtResponse;
import AlexUni.BookStore.AuthenticationService.dto.LoginRequest;
import AlexUni.BookStore.AuthenticationService.dto.SignupRequest;

/** AuthenticationService */
public interface AuthenticationService {
  JwtResponse login(LoginRequest loginRequest);

  void signup(SignupRequest signupRequest);

  JwtResponse refreshAccessToken(String refreshToken);

  void logout(String refreshToken);
}
