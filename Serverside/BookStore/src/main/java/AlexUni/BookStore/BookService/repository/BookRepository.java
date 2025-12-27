package AlexUni.BookStore.BookService.repository;

import AlexUni.BookStore.BookService.entity.Book;
import AlexUni.BookStore.ShoppingService.entity.CartDetails;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class BookRepository {
  @Autowired
  private JdbcTemplate jdbcTemplate;

  private final RowMapper<Book> bookRowMapper = // row mapper class to map row elemnts into a book class
      new RowMapper<Book>() {
        @Override
        public Book mapRow(ResultSet rs, int rowNum) throws SQLException {
          Book book = new Book();
          book.setIsbn(rs.getString("isbn"));
          book.setTitle(rs.getString("title"));
          book.setCategory(rs.getString("category"));
          book.setSellingPrice(rs.getDouble("selling_price"));
          book.setQuantityInStock(rs.getInt("quantity"));
          book.setThresholdQuantity(rs.getInt("threshold"));
          book.setPublicationYear(rs.getInt("publication_year"));
          book.setPublisherId(rs.getInt("pub_id"));
          book.setPublisherName(rs.getString("pub_name"));
          book.setImgPath(rs.getString("img_path"));
          book.setAuthors(Arrays.asList(rs.getString("author_list").split(", ")));
          return book;
        }
      };

  // old
  public Optional<Book> findByIsbn(
      String isbn) { // when returning we wrap the object in a Optional object and unrap at service
    String sqlString = "SELECT b.*, GROUP_CONCAT(DISTINCT CONCAT(a.fname, ' ', a.lname) SEPARATOR ', ') AS"
        + " author_list FROM book b NATURAL JOIN authored_by ab NATURAL JOIN author a WHERE"
        + " b.isbn = ? GROUP BY b.isbn";
    try {
      Book book = jdbcTemplate.queryForObject(sqlString, bookRowMapper, isbn);
      return Optional.ofNullable(book); // service must handle unwrapping
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty(); // service must handle unwrapping
    }
  }

  public List<Book> findAllBooks() { // old
    String sqlString = "SELECT * FROM book";
    return jdbcTemplate.query(sqlString, bookRowMapper); // knows to return empty list if empty
  }

  public List<Book> findByTitle(String title) { // old
    String sqlString = "SELECT * FROM book WHERE title LIKE ?";
    String searchPattern = "%" + title + "%";
    return jdbcTemplate.query(sqlString, bookRowMapper, searchPattern);
  }

  public List<Book> findByCategory(String category) { // old
    String sqlString = "SELECT * FROM book WHERE category = ?";
    return jdbcTemplate.query(sqlString, bookRowMapper, category);
  }

  public List<Book> findByAuthor(String authorName) { // old
    String sqlString = "SELECT b.*, GROUP_CONCAT(CONCAT(a.fname, ' ', a.lname) SEPARATOR ', ') AS author_list FROM"
        + " book AS b NATURAL JOIN authored_by AS ab NATURAL JOIN author AS a WHERE a.fname"
        + " LIKE ? OR a.lname LIKE ? GROUP BY b.isbn";
    String searchPattern = "%" + authorName + "%";
    return jdbcTemplate.query(sqlString, bookRowMapper, searchPattern, searchPattern);
  }

  public List<Book> findByPublisher(String publisherName) { // old
    String sqlString = "SELECT b.* FROM book AS b NATURAL JOIN publisher AS p WHERE p.pub_name LIKE ?";
    String searchPattern = "%" + publisherName + "%";
    return jdbcTemplate.query(sqlString, bookRowMapper, searchPattern);
  }

  // only this matters
  public List<Book> findByAdvancedSearch(
      String isbn,
      String title,
      String category,
      String author,
      String publisher) { // this does everything ///
    String sqlString =
        "SELECT b.*, p.pub_name, GROUP_CONCAT(DISTINCT CONCAT(a.fname, ' ', a.lname) SEPARATOR ', ') AS"
            + " author_list FROM book b NATURAL JOIN publisher p NATURAL JOIN authored_by ab"
            + " NATURAL JOIN author a WHERE b.isbn IN (SELECT ab2.isbn FROM book b2 NATURAL JOIN"
            + " publisher p2 NATURAL JOIN authored_by ab2 NATURAL JOIN author a2 WHERE p2.pub_name"
            + " LIKE ? AND (a2.fname LIKE ? OR a2.lname LIKE ?) AND b2.title LIKE ? AND b2.category"
            + " LIKE ? AND b2.isbn LIKE ?) GROUP BY b.isbn";
    String searchPatternPublisher = "%" + publisher + "%";
    String searchPatternAuthor = "%" + author + "%";
    String searchPatternTitle = "%" + title + "%";
    String searchPatternCategory = "%" + category + "%";
    String searchPatternIsbn = "%" + isbn + "%";
    return jdbcTemplate.query(
        sqlString,
        bookRowMapper,
        searchPatternPublisher,
        searchPatternAuthor,
        searchPatternAuthor,
        searchPatternTitle,
        searchPatternCategory,
        searchPatternIsbn);
  }

  public int save(Book book) {
    String sqlString = "INSERT INTO book (isbn, title, publication_year, selling_price, category, threshold,"
        + " quantity, pub_id, img_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    return jdbcTemplate.update(
        sqlString,
        book.getIsbn(),
        book.getTitle(),
        book.getPublicationYear(),
        book.getSellingPrice(),
        book.getCategory(),
        book.getThresholdQuantity(),
        book.getQuantityInStock(),
        book.getPublisherId(),
        book.getImgPath());
  }

  public int update(Book book) {
    String sqlString = "UPDATE book SET title = ?, publication_year = ?, selling_price = ?, category = ?,"
        + " threshold = ?, quantity = ?, pub_id = ?, img_path = ? WHERE isbn = ?";
    return jdbcTemplate.update(
        sqlString,
        book.getTitle(),
        book.getPublicationYear(),
        book.getSellingPrice(),
        book.getCategory(),
        book.getThresholdQuantity(),
        book.getQuantityInStock(),
        book.getPublisherId(),
        book.getImgPath(),
        book.getIsbn());
  }

  public boolean exists(String isbn) {
    String sql = "SELECT COUNT(*) FROM book WHERE isbn = ?";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, isbn);
    return count != null && count > 0;
  }

  public Integer findOrCreateAuthor(String authorName) {
    String selectSql = "SELECT author_id FROM author WHERE name = ?";
    try {
      return jdbcTemplate.queryForObject(selectSql, Integer.class, authorName);
    } catch (EmptyResultDataAccessException e) {
      String insertSql = "INSERT INTO author (name) VALUES (?)";
      jdbcTemplate.update(insertSql, authorName);
      return jdbcTemplate.queryForObject(selectSql, Integer.class, authorName);
    }
  }

  public int addBookAuthor(String isbn, Integer authorId) {
    String sql = "INSERT INTO authored_by(isbn, author_id) VALUES (?, ?)";
    return jdbcTemplate.update(sql, isbn, authorId);
  }

  public int removeBookAuthors(String isbn) {
    String sql = "DELETE FROM authored_by WHERE isbn = ?";
    return jdbcTemplate.update(sql, isbn);
  }

  public List<String> getBookAuthors(String isbn) {
    String sql = "SELECT a.name FROM author a "
        + "INNER JOIN authored_by ba ON a.author_id = ba.author_id "
        + "WHERE ba.isbn = ?";
    return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("name"), isbn);
  }

  public int updateQuantity(String isbn, int quantity) {
    String sql = "UPDATE book SET quantity= ? WHERE isbn = ?";
    return jdbcTemplate.update(sql, quantity, isbn);
  }

  public int increaseQuantity(String isbn, int quantity) {
    String sql = "UPDATE book SET quantity= quantity + ? WHERE isbn = ?";
    return jdbcTemplate.update(sql, quantity, isbn);
  }

  public void updateBookStock(List<CartDetails> orderDetails) {
    String sql = "UPDATE book SET quantity = quantity - ? WHERE isbn = ?";
    jdbcTemplate.batchUpdate(
        sql,
        new BatchPreparedStatementSetter() {
          @Override
          public void setValues(PreparedStatement ps, int i) throws SQLException {
            CartDetails detail = orderDetails.get(i);
            ps.setInt(1, detail.getQuantity()); // The amount to subtract
            ps.setString(2, detail.getIsbn()); // The target book
          }

          @Override
          public int getBatchSize() {
            return orderDetails.size();
          }
        });
  }

  public int getStockQuantity(String isbn) {
    String sql = "SELECT quantity FROM book WHERE isbn = ?";
    return jdbcTemplate.queryForObject(sql, Integer.class, isbn);
  }
}
