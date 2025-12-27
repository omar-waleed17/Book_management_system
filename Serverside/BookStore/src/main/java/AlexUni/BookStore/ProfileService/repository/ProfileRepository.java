package AlexUni.BookStore.ProfileService.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import AlexUni.BookStore.AuthenticationService.entity.User;

@Repository
public class ProfileRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = // row mapper class to map row elements into a user class
    new RowMapper<User>() {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setUserId(rs.getInt("user_id"));
            user.setUsername(rs.getString("username"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("hashed_password"));
            user.setFirstName(rs.getString("fname"));
            user.setLastName(rs.getString("lname"));
            user.setPhoneNumber(rs.getString("phone_num"));
            user.setShippingAddress(rs.getString("shipping_address"));
            user.setRole(rs.getString("role"));
            return user;
        }
    };
            

    public Optional<User> findByUsername(String userName) {
        String sqlString = "SELECT * FROM users WHERE username = ?";
        try {
            User user = jdbcTemplate.queryForObject(sqlString, userRowMapper, userName);
            return Optional.of(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty(); // service must handle unwrapping
        }
    }


    public int modifyProfile(User user) {
        String sqlString = "UPDATE users SET email = ?, fname = ?, lname = ?, phone_num = ?, shipping_address = ?, hashed_password = ? WHERE username = ?";
        return jdbcTemplate.update(sqlString, user.getEmail(), 
        user.getFirstName(), user.getLastName(), user.getPhoneNumber(),
         user.getShippingAddress(), user.getPassword(), user.getUsername());
    }
    
}
