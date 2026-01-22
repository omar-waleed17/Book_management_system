package AlexUni.BookStore.AdminService.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** BookRequest */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {
  @NotBlank(message = "ISBN is required")
  @Pattern(regexp = "^\\d{13}$", message = "ISBN must be 13 digits")
  private String isbn;

  @NotBlank(message = "Title is required")
  private String title;

  @NotNull(message = "Publisher ID is required")
  private Integer publisherId;

  private Integer publicationYear;

  @NotNull(message = "Price is required")
  @DecimalMin(value = "0.01", message = "Price must be greater than 0")
  private double sellingPrice;

  @NotBlank(message = "Category is required")
  @Pattern(regexp = "Science|Art|Religion|History|Geography", message = "Invalid category")
  private String category;

  @NotNull(message = "Quantity is required")
  @Min(value = 0, message = "Quantity cannot be negative")
  private Integer quantityInStock;

  @NotNull(message = "Threshold is required")
  @Min(value = 0, message = "Threshold cannot be negative")
  private Integer thresholdQuantity;

  @NotEmpty(message = "At least one author is required")
  private List<String> authors;
}
