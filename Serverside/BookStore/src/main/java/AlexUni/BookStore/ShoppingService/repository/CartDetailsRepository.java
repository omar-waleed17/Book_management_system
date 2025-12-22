package AlexUni.BookStore.ShoppingService.repository;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import AlexUni.BookStore.ShoppingService.entity.CartDetails;

@Repository
public class CartDetailsRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private final RowMapper<CartDetails> cartDetailsRowMapper =
    new RowMapper<CartDetails>() {
        @Override
        public CartDetails mapRow(ResultSet rs, int rowNum) throws SQLException{
            CartDetails cart = new CartDetails();
            // cart.setCartId(rs.getInt("cart_id"));
            cart.setIsbn(rs.getString("isbn"));
            cart.setQuantity(rs.getInt("quantity"));
            return cart;
        }
    };

    public List<CartDetails> findAllCartDetails(int cart_id) {
        String sqlString = "SELECT * FROM cart_details WHERE cart_id = ?";
        return jdbcTemplate.query(sqlString, cartDetailsRowMapper);
    }

    public Optional<Integer> addItemToCart(String userName, String isbn, int quantity) {
        String sqlString = "INSERT INTO cart_details (cart_id, isbn, quantity) " + //
                        "SELECT sc.cart_id, ? , ? FROM shopping_cart sc NATURAL JOIN users u " +
                        "WHERE u.username = ?";
        try {
            int rowsAffected = jdbcTemplate.update(sqlString, isbn, quantity, userName);
            return Optional.of(rowsAffected);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }      
    }
}
