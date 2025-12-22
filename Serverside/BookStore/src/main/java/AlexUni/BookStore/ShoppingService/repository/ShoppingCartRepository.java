package AlexUni.BookStore.ShoppingService.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import AlexUni.BookStore.ShoppingService.entity.ShoppingCart;
import AlexUni.BookStore.ShoppingService.entity.CartDetails;

@Repository
public class ShoppingCartRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private final RowMapper<ShoppingCart> shoppingCartRowMapper =
    new RowMapper<ShoppingCart>() {
        @Override
        public ShoppingCart mapRow(ResultSet rs, int rowNum) throws SQLException{
            ShoppingCart shopingCart = new ShoppingCart();
            // shopingCart.setUserId(rs.getInt("user_id")); //  TODO: dont need userId ?
            // shopingCart.setCartId(rs.getInt("cart_id"));
            // If there's a book in this row, add it to the list
            String isbn = rs.getString("isbn");
            if (isbn != null) {
                CartDetails item = new CartDetails();
                item.setIsbn(isbn);
                item.setQuantity(rs.getInt("quantity"));
                shopingCart.getItems().add(item);
            }
            return shopingCart;
        }
    };

    private final ResultSetExtractor<ShoppingCart> cartExtractor = rs -> {
    ShoppingCart shoppingCart = new ShoppingCart();
    rs.next();
    // shoppingCart.setCartId(rs.getInt("cart_id"));
    do{ // for each row add its content (isbn and quantity) to the items
        CartDetails item = new CartDetails();
        item.setIsbn(rs.getString("isbn"));
        item.setQuantity(rs.getInt("quantity"));
        shoppingCart.getItems().add(item);
    } while (rs.next());

    return shoppingCart;
    };

    public Optional<ShoppingCart> findAllCartDetails(String username) {
        
        String sqlString = "SELECT cart_id,isbn,quantity FROM shopping_cart NATURAL JOIN cart_details NATURAL JOIN users WHERE username = ?"; // userId obtained from access token
        try {
            ShoppingCart shoppingCart = jdbcTemplate.query(sqlString, cartExtractor, username);
            return Optional.ofNullable(shoppingCart);
        } catch (EmptyResultDataAccessException e) {
             return Optional.empty(); // service must handle unwrapping
        }
    }

    
}
