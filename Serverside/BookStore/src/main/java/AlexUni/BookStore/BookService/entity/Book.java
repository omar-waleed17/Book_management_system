package AlexUni.BookStore.BookService.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    private String isbn;
    private String title;
    private Integer publication_year;
    private Double selling_price;
    private String category;
    private Integer threshold;
    private Integer quantity;
    private Integer pub_id;
}
