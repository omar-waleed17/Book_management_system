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
    private final RowMapper<ShoppingCart> shoppingCartRowMapper = new RowMapper<ShoppingCart>() {
        @Override
        public ShoppingCart mapRow(ResultSet rs, int rowNum) throws SQLException {
            ShoppingCart shopingCart = new ShoppingCart();
            // shopingCart.setUserId(rs.getInt("user_id")); // TODO: dont need userId ?
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
        // Check if there are any rows before processing
        if (!rs.next()) {
            return shoppingCart; // Return empty cart if no items
        }
        do { // for each row add its content (isbn and quantity) to the items
            CartDetails item = new CartDetails();
            item.setIsbn(rs.getString("isbn"));
            item.setQuantity(rs.getInt("quantity"));
            item.setMaxQuantity(rs.getInt("maxQuantity"));
            item.setImgPath(rs.getString("img_path"));
            item.setTitle(rs.getString("title"));
            item.setUnitPrice(rs.getDouble("selling_price"));
            shoppingCart.getItems().add(item);
        } while (rs.next());

        return shoppingCart;
    };

    public Optional<ShoppingCart> findAllCartDetails(String username) {

        String sqlString = "SELECT sc.cart_id, cd.isbn, cd.quantity, b.quantity AS maxQuantity, b.selling_price, b.img_path, b.title "
                + //
                "FROM shopping_cart sc JOIN cart_details cd ON sc.cart_id = cd.cart_id " + //
                "JOIN users u ON sc.user_id = u.user_id " + //
                "JOIN book b ON b.isbn = cd.isbn WHERE u.username = ?"; // userId obtained from access token
        try {
            ShoppingCart shoppingCart = jdbcTemplate.query(sqlString, cartExtractor, username);
            return Optional.ofNullable(shoppingCart);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty(); // service must handle unwrapping
        }
    }

    public Optional<Integer> createCartForUser(String userName) {
        String sqlString = "REPLACE INTO shopping_cart (user_id) SELECT u.user_id FROM users u WHERE u.username=?"; // replace
                                                                                                                    // if
                                                                                                                    // exists
        try {
            int rowsAffected = jdbcTemplate.update(sqlString, userName);
            return Optional.of(rowsAffected);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<Integer> deleteCartByUsername(String username) {
        String sqlString = "DELETE FROM shopping_cart WHERE user_id = (SELECT user_id FROM users WHERE username = ?)";
        try {
            int rowsAffected = jdbcTemplate.update(sqlString, username);
            return Optional.of(rowsAffected);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

}
