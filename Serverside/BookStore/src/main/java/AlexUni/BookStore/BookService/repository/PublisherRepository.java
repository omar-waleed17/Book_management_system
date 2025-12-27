package AlexUni.BookStore.BookService.repository;

import AlexUni.BookStore.BookService.entity.Publisher;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

/** PublisherRepository */
@Repository
public class PublisherRepository {

  @Autowired private JdbcTemplate jdbcTemplate;

  private final RowMapper<Publisher> publisherRowMapper =
      new RowMapper<Publisher>() {
        @Override
        public Publisher mapRow(ResultSet rs, int rowNum) throws SQLException {
          Publisher publisher = new Publisher();
          publisher.setPublisherId(rs.getInt("pub_id"));
          publisher.setName(rs.getString("pub_name"));
          publisher.setAddress(rs.getString("address"));
          publisher.setTelephone(rs.getString("pub_phone_num"));
          return publisher;
        }
      };

  public Optional<Publisher> findById(Integer publisherId) {
    String sql = "SELECT * FROM publisher WHERE pub_id= ?";
    try {
      Publisher publisher = jdbcTemplate.queryForObject(sql, publisherRowMapper, publisherId);
      return Optional.ofNullable(publisher);
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public List<Publisher> findAll() {
    String sql = "SELECT * FROM publisher";
    return jdbcTemplate.query(sql, publisherRowMapper);
  }

  public boolean exists(Integer publisherId) {
    String sql = "SELECT COUNT(*) FROM publisher WHERE pub_id= ?";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, publisherId);
    return count != null && count > 0;
  }
}
