package AlexUni.BookStore.AdminService.repository;

import AlexUni.BookStore.AdminService.entity.PublisherOrder;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class PublisherOrderRepository {

  @Autowired private JdbcTemplate jdbcTemplate;

  private final RowMapper<PublisherOrder> orderRowMapper =
      new RowMapper<PublisherOrder>() {
        @Override
        public PublisherOrder mapRow(ResultSet rs, int rowNum) throws SQLException {
          PublisherOrder order = new PublisherOrder();
          // Updated to match new PK 'restock_order_id'
          order.setOrderId(rs.getInt("restock_order_id"));
          order.setIsbn(rs.getString("isbn"));
          order.setQuantity(rs.getInt("quantity"));
          order.setOrderDate(rs.getTimestamp("order_date").toLocalDateTime());
          order.setStatus(rs.getString("status"));

          // 'pub_id' is fetched via the JOIN in the query below
          order.setPublisherId(rs.getInt("pub_id"));
          return order;
        }
      };

  public List<PublisherOrder> findPendingOrders() {
    // Joined with 'book' table to get the pub_id, as it's no longer in the order table
    String sql =
        """
        SELECT r.*, b.pub_id
        FROM restock_order r
        JOIN book b ON r.isbn = b.isbn
        WHERE r.status = 'Pending'
        ORDER BY r.order_date DESC
        """;
    return jdbcTemplate.query(sql, orderRowMapper);
  }

  public List<PublisherOrder> findByIsbn(String isbn) {
    String sql =
        """
        SELECT r.*, b.pub_id
        FROM restock_order r
        JOIN book b ON r.isbn = b.isbn
        WHERE r.isbn = ?
        ORDER BY r.order_date DESC
        """;
    return jdbcTemplate.query(sql, orderRowMapper, isbn);
  }

  public int confirmOrder(Integer orderId) {
    // Removed 'confirmed_date = NOW()' as that column does not exist in the new schema.
    // Your MySQL trigger 'confirm_restock_order' will handle the stock update automatically.
    String sql = "UPDATE restock_order SET status = 'Confirmed' WHERE restock_order_id = ?";
    return jdbcTemplate.update(sql, orderId);
  }

  public Integer getOrderQuantity(Integer orderId) {
    String sql = "SELECT quantity FROM restock_order WHERE restock_order_id = ?";
    return jdbcTemplate.queryForObject(sql, Integer.class, orderId);
  }

  public String getOrderIsbn(Integer orderId) {
    String sql = "SELECT isbn FROM restock_order WHERE restock_order_id = ?";
    return jdbcTemplate.queryForObject(sql, String.class, orderId);
  }

  public int countOrdersForBook(String isbn) {
    String sql = "SELECT COUNT(*) FROM restock_order WHERE isbn = ?";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, isbn);
    return count != null ? count : 0;
  }
}
