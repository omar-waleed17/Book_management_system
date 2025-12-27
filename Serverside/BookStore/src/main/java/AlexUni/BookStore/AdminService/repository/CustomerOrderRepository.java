package AlexUni.BookStore.AdminService.repository;

/** customerOrderRepository */
import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import AlexUni.BookStore.AdminService.entity.CustomerOrder;
import AlexUni.BookStore.AdminService.entity.OrderItem;

@Repository
public class CustomerOrderRepository {

  @Autowired private JdbcTemplate jdbcTemplate;

  private final RowMapper<CustomerOrder> orderRowMapper =
      new RowMapper<CustomerOrder>() {
        @Override
        public CustomerOrder mapRow(ResultSet rs, int rowNum) throws SQLException {
          CustomerOrder order = new CustomerOrder();
          order.setOrderId(rs.getInt("order_id"));
          order.setUserId(rs.getInt("user_id"));
          order.setOrderDate(rs.getTimestamp("order_date").toLocalDateTime());
          // Updated column name: total_price
          order.setTotalAmount(rs.getBigDecimal("total_price"));
          order.setCreditCardNumber(rs.getString("credit_card_number"));
          // Updated column name: cc_expiry_date
          order.setCardExpiryDate(rs.getString("cc_expiry_date"));

          // NOTE: The new 'orders' table schema does not have a 'status' column.
          // order.setStatus(rs.getString("status"));
          return order;
        }
      };

  private final RowMapper<OrderItem> orderItemRowMapper =
      new RowMapper<OrderItem>() {
        @Override
        public OrderItem mapRow(ResultSet rs, int rowNum) throws SQLException {
          OrderItem item = new OrderItem();
          // NOTE: 'order_details' uses a composite PK (order_id, isbn), so there is no single
          // 'item_id'.
          // item.setItemId(rs.getInt("item_id"));

          item.setOrderId(rs.getInt("order_id"));
          item.setIsbn(rs.getString("isbn"));
          item.setBookTitle(rs.getString("title")); // Joined from book table
          item.setQuantity(rs.getInt("quantity"));
          // Updated column name: unit_price
          item.setPriceAtPurchase(rs.getBigDecimal("unit_price"));
          return item;
        }
      };

  public Integer createOrder(
      Integer userId, BigDecimal totalAmount, String cardNumber, String expiryDate) {
    // Updated table: orders
    // Updated columns: total_price, cc_expiry_date
    String sql =
        "INSERT INTO orders (user_id, total_price, credit_card_number, cc_expiry_date) "
            + "VALUES (?, ?, ?, ?)";

    KeyHolder keyHolder = new GeneratedKeyHolder();

    jdbcTemplate.update(
        connection -> {
          PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
          ps.setInt(1, userId);
          ps.setBigDecimal(2, totalAmount);
          ps.setString(3, cardNumber);
          ps.setString(4, expiryDate); // Ensure date string format is YYYY-MM-DD
          return ps;
        },
        keyHolder);

    return keyHolder.getKey().intValue();
  }

  public int addOrderItem(Integer orderId, String isbn, Integer quantity, BigDecimal price) {
    // Updated table: order_details
    // Updated column: unit_price
    String sql =
        "INSERT INTO order_details (order_id, isbn, quantity, unit_price) " + "VALUES (?, ?, ?, ?)";
    return jdbcTemplate.update(sql, orderId, isbn, quantity, price);
  }

  public List<CustomerOrder> findByUserId(Integer userId) {
    // Updated table: orders
    String sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC";
    List<CustomerOrder> orders = jdbcTemplate.query(sql, orderRowMapper, userId);

    for (CustomerOrder order : orders) {
      order.setItems(getOrderItems(order.getOrderId()));
    }
    return orders;
  }

  public List<OrderItem> getOrderItems(Integer orderId) {
    // Updated table aliases: order_details (od), book (b)
    String sql =
        "SELECT od.*, b.title "
            + "FROM order_details od "
            + "INNER JOIN book b ON od.isbn = b.isbn "
            + "WHERE od.order_id = ?";
    return jdbcTemplate.query(sql, orderItemRowMapper, orderId);
  }

  // --- Reports ---

  public BigDecimal getTotalSalesLastMonth() {
    // Updated table: orders, column: total_price
    String sql =
        "SELECT COALESCE(SUM(total_price), 0) FROM orders "
            + "WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) "
            + "AND order_date < CURDATE()";
    return jdbcTemplate.queryForObject(sql, BigDecimal.class);
  }

  public BigDecimal getTotalSalesForDate(String date) {
    // Updated table: orders, column: total_price
    String sql = "SELECT COALESCE(SUM(total_price), 0) FROM orders " + "WHERE DATE(order_date) = ?";
    return jdbcTemplate.queryForObject(sql, BigDecimal.class, date);
  }

  public List<Object[]> getTop5Customers() {
    // Updated columns: fname, lname, total_price
    // Updated table: orders
    String sql =
        "SELECT u.user_id, u.username, u.fname, u.lname, "
            + "COALESCE(SUM(o.total_price), 0) as total_spent "
            + "FROM users u "
            + "LEFT JOIN orders o ON u.user_id = o.user_id "
            + "WHERE o.order_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH) "
            + "GROUP BY u.user_id "
            + "ORDER BY total_spent DESC "
            + "LIMIT 5";

    return jdbcTemplate.query(
        sql,
        (rs, rowNum) ->
            new Object[] {
              rs.getInt("user_id"),
              rs.getString("username"),
              rs.getString("fname"),
              rs.getString("lname"),
              rs.getBigDecimal("total_spent")
            });
  }

  public List<Object[]> getTop10SellingBooks() {
    // Updated tables: book, order_details, orders
    String sql =
        "SELECT b.isbn, b.title, COALESCE(SUM(od.quantity), 0) as total_sold "
            + "FROM book b "
            + "LEFT JOIN order_details od ON b.isbn = od.isbn "
            + "LEFT JOIN orders o ON od.order_id = o.order_id "
            + "WHERE o.order_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH) "
            + "GROUP BY b.isbn "
            + "ORDER BY total_sold DESC "
            + "LIMIT 10";

    return jdbcTemplate.query(
        sql,
        (rs, rowNum) ->
            new Object[] {rs.getString("isbn"), rs.getString("title"), rs.getInt("total_sold")});
  }
}
