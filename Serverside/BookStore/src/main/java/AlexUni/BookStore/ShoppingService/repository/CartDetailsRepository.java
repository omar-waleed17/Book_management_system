package AlexUni.BookStore.ShoppingService.repository;


import java.sql.ResultSet;
import java.sql.SQLException;
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

    public Optional<Integer> addItemToCart(String userName, String isbn, int quantity) {
        String sqlString = "INSERT INTO cart_details (cart_id, isbn, quantity) " + //
                        "SELECT sc.cart_id, ? , ? FROM shopping_cart sc NATURAL JOIN users u " +
                        "WHERE u.username = ? ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)";
                         // if entry already exists add onto it
        try {
            int rowsAffected = jdbcTemplate.update(sqlString, isbn, quantity, userName);
            return Optional.of(rowsAffected);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }      
    }

    public Optional<Integer> updateItemToCart(String userName, String isbn, int quantity) {
        String sqlString = "UPDATE cart_details cd NATURAL JOIN shopping_cart sc NATURAL JOIN users u " +
                           "SET cd.quantity = ? WHERE u.username = ? AND cd.isbn = ?";
        try {
            int rowsAffected = jdbcTemplate.update(sqlString, quantity, userName, isbn);
            return Optional.of(rowsAffected);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        } 
    }

    public Optional<Integer> deleteItemFromCart(String userName, String isbn) {
        String sqlString = "DELETE cd FROM cart_details cd NATURAL JOIN shopping_cart sc NATURAL JOIN users u " +
                           "WHERE u.username = ? AND cd.isbn = ?";
        try {
            int rowsAffected = jdbcTemplate.update(sqlString, userName, isbn);
            return Optional.of(rowsAffected);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}