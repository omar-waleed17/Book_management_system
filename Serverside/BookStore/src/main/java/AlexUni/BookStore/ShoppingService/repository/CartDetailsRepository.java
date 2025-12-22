package AlexUni.BookStore.ShoppingService.repository;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
}
