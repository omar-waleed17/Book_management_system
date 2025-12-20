package AlexUni.BookStore.AuthenticationService.service.impl;

import AlexUni.BookStore.AuthenticationService.dto.JwtResponse;
import AlexUni.BookStore.AuthenticationService.dto.LoginRequest;
import AlexUni.BookStore.AuthenticationService.dto.SignupRequest;
import AlexUni.BookStore.AuthenticationService.entity.User;
import AlexUni.BookStore.AuthenticationService.jwt.JwtUtil;
import AlexUni.BookStore.AuthenticationService.repository.RefreshTokenRepository;
import AlexUni.BookStore.AuthenticationService.repository.UserRepository;
import AlexUni.BookStore.AuthenticationService.service.AuthenticationService;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
  private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
  @Autowired private UserRepository userRepository;

  @Autowired private RefreshTokenRepository refreshTokenRepository;

  @Autowired private PasswordEncoder passwordEncoder;

  @Autowired private AuthenticationManager authenticationManager;

  @Autowired private JwtUtil tokenProvider;

  @Value("${app.jwt.refresh-token-expiration-ms}")
  private long refreshTokenExpirationMs;

  @Transactional
  @Override
  public JwtResponse login(LoginRequest loginRequest) {
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getUsername(), loginRequest.getPassword()));

      SecurityContextHolder.getContext().setAuthentication(authentication);

      String accessToken = tokenProvider.generateAccessToken(authentication);
      String refreshToken = tokenProvider.generateRefreshToken();

      // Save refresh token to database
      User user =
          userRepository
              .findByUsername(loginRequest.getUsername())
              .orElseThrow(() -> new RuntimeException("User not found"));

      Date now = new Date();
      Date expiryDate = new Date(now.getTime() + refreshTokenExpirationMs);
      refreshTokenRepository.saveRefreshToken(user.getUserId(), refreshToken, expiryDate);

      return new JwtResponse(accessToken, refreshToken, user.getUsername(), user.getRole());
    } catch (BadCredentialsException e) {
      logger.error("Bad credentials for username: {}", loginRequest.getUsername());
      throw e;
    } catch (Exception e) {
      logger.error(
          "Login failed for username: {} - Error: {}",
          loginRequest.getUsername(),
          e.getMessage(),
          e);
      throw e;
    }
  }

  @Transactional
  @Override
  public void signup(SignupRequest signupRequest) {
    if (userRepository.existsByUsername(signupRequest.getUsername())) {
      throw new RuntimeException("Username is already taken");
    }

    if (userRepository.existsByEmail(signupRequest.getEmail())) {
      throw new RuntimeException("Email is already in use");
    }

    User user = new User();
    user.setUsername(signupRequest.getUsername());
    user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
    user.setFirstName(signupRequest.getFirstName());
    user.setLastName(signupRequest.getLastName());
    user.setEmail(signupRequest.getEmail());
    user.setPhoneNumber(signupRequest.getPhoneNumber());
    user.setShippingAddress(signupRequest.getShippingAddress());
    user.setRole("CUSTOMER");

    userRepository.save(user);
  }

  @Transactional
  @Override
  public JwtResponse refreshAccessToken(String refreshToken) {
    if (!refreshTokenRepository.validateRefreshToken(refreshToken)) {
      throw new RuntimeException("Invalid or expired refresh token");
    }

    Integer userId = refreshTokenRepository.getUserIdByRefreshToken(refreshToken);
    if (userId == null) {
      throw new RuntimeException("Refresh token not found");
    }

    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    String newAccessToken = tokenProvider.generateAccessToken(user.getUsername());

    return new JwtResponse(newAccessToken, refreshToken, user.getUsername(), user.getRole());
  }

  @Transactional
  @Override
  public void logout(String refreshToken) {
    refreshTokenRepository.deleteRefreshToken(refreshToken);
  }
}
