package AlexUni.BookStore.ShoppingService.repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import AlexUni.BookStore.BookService.entity.Book;
import AlexUni.BookStore.ShoppingService.entity.CartDetails;
import AlexUni.BookStore.ShoppingService.entity.Order;

@Repository
public class OrderProcessingRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Order> orderRowMapper = // row mapper class to map row elements into an order class
    new RowMapper<Order>() {
        @Override
        public Order mapRow(ResultSet rs, int rowNum) throws SQLException {
            Order order = new Order();
            order.setOrderId(rs.getInt("order_id"));
            order.setCustomerId(rs.getInt("user_id"));
            order.setOrderDate(rs.getString("order_date"));
            order.setTotalAmount(rs.getDouble("total_price"));
            order.setCardNumber(rs.getString("credit_card_number"));
            order.setCardExpiry(rs.getString("cc_expiry_date"));
            String allIsbns = rs.getString("all_isbns");
            if (allIsbns == null) {
                allIsbns = "";
            }
            order.setBookIsbns(Arrays.asList(allIsbns.split(", ")));
            return order;
        }
    };

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
            ps.setDouble(4, item.getUnitPrice());
        }
        @Override
        public int getBatchSize() {
            return orderDetails.size();
        }
        });
    }

    public List<Order> getOrdersByUsername(String userName) {
        String sql = "SELECT o.order_id, o.user_id, o.order_date, o.total_price, o.credit_card_number, " +
                 " o.cc_expiry_date, GROUP_CONCAT(od.isbn SEPARATOR ', ') AS all_isbns " +
                 " FROM orders o JOIN users u ON o.user_id = u.user_id " +
                 " LEFT JOIN order_details od ON o.order_id = od.order_id " + // Added space here
                 " WHERE u.username = ? GROUP BY o.order_id";
        return jdbcTemplate.query(sql, orderRowMapper, userName);
    }
}
