package AlexUni.BookStore.ShoppingService.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import AlexUni.BookStore.ShoppingService.entity.CartDetails;

@Repository
public class OrderProcessingRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

	public int insertCartToOrder(String userName, double totalPrice, String cnn, String exp) {
		String sqlString = "INSERT INTO orders (user_id, total_price, credit_card_number, cc_expiry_date) " +
                           "VALUES ((SELECT user_id FROM users WHERE username = ?), ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        try {
            jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sqlString, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, userName);
            ps.setDouble(2, totalPrice);
            ps.setString(3, cnn);
            ps.setString(4, exp);
            return ps;
        }, keyHolder);
        } catch (Exception e) {
            throw new RuntimeException("Error inserting order: " + e.getMessage());
        }
        // Retrieve the generated ID
        Number key = keyHolder.getKey();
        if (key != null) {
            return key.intValue();
        }
        throw new RuntimeException("Failed to retrieve generated order ID.");
    }

    public void insertOrderDetails(int orderId, List<CartDetails> orderDetails) {
    String sql = "INSERT INTO order_details (order_id, isbn, quantity, unit_price) VALUES (?, ?, ?, ?)";

    jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
        @Override
        public void setValues(PreparedStatement ps, int i) throws SQLException {
            CartDetails item = orderDetails.get(i);
            ps.setInt(1, orderId);
            ps.setString(2, item.getIsbn());
            ps.setInt(3, item.getQuantity());
            ps.setDouble(4, item.getUnitprice());
        }
        @Override
        public int getBatchSize() {
            return orderDetails.size();
        }
        });
    }
}
