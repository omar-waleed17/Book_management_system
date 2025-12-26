package AlexUni.BookStore.ShoppingService.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import AlexUni.BookStore.BookService.repository.BookRepository;
import AlexUni.BookStore.ShoppingService.entity.CartDetails;
import AlexUni.BookStore.ShoppingService.entity.Order;
import AlexUni.BookStore.ShoppingService.repository.OrderProcessingRepository;

@Service
public class OrderProcessingSerivce {

    @Autowired
    private ShoppingCartService shoppingCartService;
    @Autowired
    private OrderProcessingRepository orderProcessingRepository;
    @Autowired
    private BookRepository bookRepository;

    private boolean validateCard(String cnn, String exp, String cvv, String amount) {
        if (cnn.length() == 16 && exp.length() == 7 ){
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");
            try {
                YearMonth expDate = YearMonth.parse(exp, formatter);
                YearMonth today = YearMonth.now();
                if (expDate.isAfter(today)) {
                    return true;
                } else {
                    return false;
                }
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid expiry date format");
            }
        }
        return false;
    }

    private void insertCartToOrder(String userName, String cnn, String exp, List<CartDetails> orderDetails) {

        double totalPrice = shoppingCartService.calculateTotalPrice(orderDetails);
        // Insert order and get generated order ID
        int orderId = orderProcessingRepository.insertCartToOrder(userName, totalPrice, cnn, exp);
        // Insert order details
        orderProcessingRepository.insertOrderDetails(orderId, orderDetails);

    }

    private String convertDateFormat(String exp) {
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("MM/yyyy");
        YearMonth yearMonth = YearMonth.parse(exp, inputFormatter);
        LocalDate fullDate = yearMonth.atDay(1);
        String formattedDate = fullDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
        return formattedDate;
    }

    @Transactional
    public int processOrder(String userName, String cnn, String exp, String cvv, String amount) {
        if (!validateCard(cnn, exp, cvv, amount)) {
            throw new IllegalArgumentException("Invalid card details");
        }
        exp = convertDateFormat(exp);
        List<CartDetails> orderDetails = shoppingCartService.loadAllCartContent(userName).getCartDetails();
        // Check stock availability
        checkStockAvailability(orderDetails);
        // Insert order and order details
        insertCartToOrder(userName, cnn, exp, orderDetails);
        // Update stock levels
        updateStockLevels(orderDetails);
        // clear shopping cart
        int rowsAffected = shoppingCartService.saveCartForUser(userName);
        return rowsAffected;
    }

    private void checkStockAvailability(List<CartDetails> orderDetails) { // can be done direclty in sql with when clause
        for (CartDetails item : orderDetails) {
            int availableStock = bookRepository.getStockQuantity(item.getIsbn());
            if (availableStock < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + item.getIsbn() + ". Available: " + availableStock + ", Requested: " + item.getQuantity());
        }
        }
    }

    private void updateStockLevels(List<CartDetails> orderDetails) {
        bookRepository.updateBookStock(orderDetails);
    }

    public List<Order> getOrdersForUser(String userName) {
        return orderProcessingRepository.getOrdersByUsername(userName);
    }
    
}
