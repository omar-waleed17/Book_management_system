package AlexUni.BookStore.BookService.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import AlexUni.BookStore.BookService.entity.Book;

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
            book.setThreshold(rs.getInt("threshold"));
            book.setPublicationYear(rs.getInt("publication_year"));
            book.setPublisherId(rs.getInt("pub_id"));
            book.setImgPath(rs.getString("img_path"));
            return book;
        }
    };
    
    public Optional<Book> findByIsbn(String isbn) { // when returning we wrap the object in a Optional object and unrap at service
        String sqlString = "SELECT * FROM book WHERE isbn = ?";
        try {
            Book book = jdbcTemplate.queryForObject(sqlString, bookRowMapper, isbn);
            return Optional.ofNullable(book); // service must handle unwrapping
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty(); // service must handle unwrapping
        }
    }
    
    public List<Book> findAllBooks() {
        String sqlString = "SELECT * FROM book";
        return jdbcTemplate.query(sqlString, bookRowMapper); // knows to return empty list if empty
    }
    
    public List<Book> findByTitle(String title) {
    String sqlString = "SELECT * FROM book WHERE title LIKE ?";
    String searchPattern = "%" + title + "%";
        return jdbcTemplate.query(sqlString, bookRowMapper, searchPattern);
    }
    
    public List<Book> findByCategory(String category) {
        String sqlString = "SELECT * FROM book WHERE category = ?";
        return jdbcTemplate.query(sqlString, bookRowMapper, category);
    }
    
    public List<Book> findByAuthor(String authorName) {
        String sqlString = "SELECT b.* FROM book AS b NATURAL JOIN authored_by AS ab NATURAL JOIN author AS a WHERE a.fname LIKE ? OR a.lname LIKE ?";
        String searchPattern = "%" + authorName + "%"; 
        return jdbcTemplate.query(sqlString, bookRowMapper, searchPattern, searchPattern); // we supply searchpattern twice because there are 2 placeholders for the same value
    }
    
    public List<Book> findByPublisher(String publisherName) {
        String sqlString = "SELECT b.* FROM book AS b NATURAL JOIN publisher AS p WHERE p.pub_name LIKE ?";
        String searchPattern = "%" + publisherName + "%";
        return jdbcTemplate.query(sqlString, bookRowMapper, searchPattern);
    }
    
    public List<Book> findByAdvancedSearch(String title, String category, String author, String publisher) { // right now it reutns author data as well but that is not pared into the json
        String sqlString = "SELECT b.*, a.* FROM book AS b NATURAL JOIN publisher AS p NATURAL JOIN authored_by AS ab NATURAL JOIN author AS a " +
                            "WHERE p.pub_name LIKE ? AND (a.fname LIKE ? OR a.lname LIKE ?) AND b.title LIKE ? AND b.category LIKE ?";
        String searchPatternPublisher = "%" + publisher + "%";
        String searchPatternAuthor = "%" + author + "%";
        String searchPatternTitle = "%" + title + "%";
        String searchPatternCategory = "%" + category + "%";
        return jdbcTemplate.query(sqlString, bookRowMapper, searchPatternPublisher, searchPatternAuthor, searchPatternAuthor, searchPatternTitle, searchPatternCategory);
    }

    public int saveBook(Book book) {
        String sqlString = "INSERT INTO book (isbn, title, publication_year, selling_price, category, threshold, quantity, pub_id, img_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sqlString, 
            book.getIsbn(), book.getTitle(), 
            book.getPublicationYear(), book.getSellingPrice(), 
            book.getCategory(), book.getThreshold(), 
            book.getQuantityInStock(), book.getPublisherId());
    }

    public int modifyBook(Book book) {
        String sqlString = "UPDATE book SET title = ?, publication_year = ?, selling_price = ?, category = ?, threshold = ?, quantity = ?, pub_id = ?, img_path = ? WHERE isbn = ?";
        return jdbcTemplate.update(sqlString, 
            book.getTitle(), 
            book.getPublicationYear(), book.getSellingPrice(), 
            book.getCategory(), book.getThreshold(), 
            book.getQuantityInStock(), book.getPublisherId(), book.getImgPath(), book.getIsbn());
    }

    
}
