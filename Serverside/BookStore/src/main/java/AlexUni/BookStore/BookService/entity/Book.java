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
    private Integer publicationYear;
    private Double sellingPrice;
    private String category;
    private Integer threshold;
    private Integer quantityInStock;
    private Integer publisherId;
}
