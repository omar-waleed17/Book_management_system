package AlexUni.BookStore.AuthenticationService.repository;

import java.sql.Timestamp;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RefreshTokenRepository {

  @Autowired private JdbcTemplate jdbcTemplate;

  public int saveRefreshToken(Integer userId, String token, Date expiryDate) {
    String sql = "INSERT INTO refresh_tokens (user_id, token, expiry_date) VALUES (?, ?, ?)";
    return jdbcTemplate.update(sql, userId, token, new Timestamp(expiryDate.getTime()));
  }

  public boolean validateRefreshToken(String token) {
    String sql = "SELECT COUNT(*) FROM refresh_tokens WHERE token = ? AND expiry_date > NOW()";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, token);
    return count != null && count > 0;
  }

  public Integer getUserIdByRefreshToken(String token) {
    String sql = "SELECT user_id FROM refresh_tokens WHERE token = ? AND expiry_date > NOW()";
    try {
      return jdbcTemplate.queryForObject(sql, Integer.class, token);
    } catch (EmptyResultDataAccessException e) {
      return null;
    }
  }

  public int deleteRefreshToken(String token) {
    String sql = "DELETE FROM refresh_tokens WHERE token = ?";
    return jdbcTemplate.update(sql, token);
  }

  public int deleteExpiredTokens() {
    String sql = "DELETE FROM refresh_tokens WHERE expiry_date < NOW()";
    return jdbcTemplate.update(sql);
  }

  public int deleteAllUserTokens(Integer userId) {
    String sql = "DELETE FROM refresh_tokens WHERE user_id = ?";
    return jdbcTemplate.update(sql, userId);
  }
}
