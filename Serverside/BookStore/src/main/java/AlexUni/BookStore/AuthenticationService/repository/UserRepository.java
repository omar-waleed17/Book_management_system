package AlexUni.BookStore.AuthenticationService.repository;

import AlexUni.BookStore.AuthenticationService.entity.User;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

  @Autowired private JdbcTemplate jdbcTemplate;

  private final RowMapper<User> userRowMapper =
      new RowMapper<User>() {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
          User user = new User();
          user.setUserId(rs.getInt("user_id"));
          user.setUsername(rs.getString("username"));
          user.setPassword(rs.getString("hashed_password"));
          user.setFirstName(rs.getString("fname"));
          user.setLastName(rs.getString("lname"));
          user.setEmail(rs.getString("email"));
          user.setPhoneNumber(rs.getString("phone_num"));
          user.setShippingAddress(rs.getString("shipping_address"));
          user.setRole(rs.getString("role"));
          return user;
        }
      };

  public Optional<User> findByUsername(String username) {
    String sql = "SELECT * FROM users WHERE username = ?";
    try {
      User user = jdbcTemplate.queryForObject(sql, userRowMapper, username);
      return Optional.ofNullable(user);
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public Optional<User> findByEmail(String email) {
    String sql = "SELECT * FROM users WHERE email = ?";
    try {
      User user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
      return Optional.ofNullable(user);
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public Optional<User> findById(Integer userId) {
    String sql = "SELECT * FROM users WHERE user_id = ?";
    try {
      User user = jdbcTemplate.queryForObject(sql, userRowMapper, userId);
      return Optional.ofNullable(user);
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public boolean existsByUsername(String username) {
    String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
    return count != null && count > 0;
  }

  public boolean existsByEmail(String email) {
    String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
    return count != null && count > 0;
  }

  public int save(User user) {
    String sql =
        "INSERT INTO users(username, hashed_password, fname, lname, email, "
            + "phone_num, shipping_address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    return jdbcTemplate.update(
        sql,
        user.getUsername(),
        user.getPassword(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail(),
        user.getPhoneNumber(),
        user.getShippingAddress(),
        user.getRole());
  }

  public int update(User user) {
    String sql =
        "UPDATE users SET password = ?, first_name = ?, last_name = ?, "
            + "email = ?, phone_number = ?, shipping_address = ? WHERE user_id = ?";
    return jdbcTemplate.update(
        sql,
        user.getPassword(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail(),
        user.getPhoneNumber(),
        user.getShippingAddress(),
        user.getUserId());
  }
}
