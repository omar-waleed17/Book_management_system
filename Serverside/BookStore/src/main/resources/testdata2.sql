-- ============================================
-- INSERT DATA IN TOPOLOGICAL ORDER
-- ============================================

-- 1. AUTHORS (no dependencies)
INSERT INTO author (name) VALUES
('J.K. Rowling'),
('George Orwell'),
('Harper Lee'),
('F. Scott Fitzgerald'),
('Jane Austen'),
('Mark Twain'),
('Ernest Hemingway'),
('Agatha Christie');

-- 2. PUBLISHERS (no dependencies)
INSERT INTO publisher (pub_name, address, pub_phone_num) VALUES
('Bloomsbury Publishing', '50 Bedford Square, London', '+44-20-7631-5600'),
('Penguin Books', '80 Strand, London', '+44-20-7010-3000'),
('HarperCollins', '195 Broadway, New York', '+1-212-207-7000'),
('Simon & Schuster', '1230 Avenue of the Americas, New York', '+1-212-698-7000'),
('Random House', '1745 Broadway, New York', '+1-212-782-9000');

-- 3. USERS (no dependencies)
-- Password for all users: 'Admin123' (BCrypt hashed)
INSERT INTO users (username, hashed_password, email, fname, lname, phone_num, shipping_address, role) VALUES
('mazenAdmin1', '$2a$10$rN7ZjGx6KHvHxOBJGVjEQOqP4nP8VGo.LJTqEJYJvJLCqQYPn5z5W', 'mazen.admin1@bookstore.com', 'Mazen', 'Admin', '555-0101', '456 Admin Blvd', 'ADMIN'),
('admin', '$2a$10$rN7ZjGx6KHvHxOBJGVjEQOqP4nP8VGo.LJTqEJYJvJLCqQYPn5z5W', 'admin@bookstore.com', 'Admin', 'User', '123-456-7890', '123 Admin St', 'ADMIN'),
('john_doe', '$2a$10$rN7ZjGx6KHvHxOBJGVjEQOqP4nP8VGo.LJTqEJYJvJLCqQYPn5z5W', 'john@email.com', 'John', 'Doe', '234-567-8901', '456 Oak Ave', 'CUSTOMER'),
('jane_smith', '$2a$10$rN7ZjGx6KHvHxOBJGVjEQOqP4nP8VGo.LJTqEJYJvJLCqQYPn5z5W', 'jane@email.com', 'Jane', 'Smith', '345-678-9012', '789 Maple Dr', 'CUSTOMER'),
('bob_wilson', '$2a$10$rN7ZjGx6KHvHxOBJGVjEQOqP4nP8VGo.LJTqEJYJvJLCqQYPn5z5W', 'bob@email.com', 'Bob', 'Wilson', '456-789-0123', '321 Pine Rd', 'CUSTOMER');




-- 4. BOOKS (depends on publisher)
-- Note: ISBNs are 13 digits, categories must be: Science, Art, Religion, History, Geography
INSERT INTO book (isbn, title, publication_year, selling_price, category, threshold, quantity, pub_id, img_path) VALUES
('9780747532699', 'Harry Potter and the Philosopher''s Stone', 1997, 29.99, 'Art', 10, 50, 1, '../images/harry_potter_1.jpg'),
('9780452284234', '1984', 1949, 19.99, 'Science', 15, 75, 2, '../images/1984.jpg'),
('9780061120084', 'To Kill a Mockingbird', 1960, 24.99, 'History', 12, 60, 3, '../images/mockingbird.jpg'),
('9780743273565', 'The Great Gatsby', 1925, 22.99, 'History', 10, 45, 4, '../images/gatsby.jpg'),
('9780141439518', 'Pride and Prejudice', 1813, 18.99, 'Art', 15, 80, 2, '../images/pride_prejudice.jpg'),
('9780486400776', 'Adventures of Huckleberry Finn', 1884, 21.99, 'History', 10, 55, 5, '../images/huck_finn.jpg'),
('9780684801223', 'The Old Man and the Sea', 1952, 16.99, 'Art', 12, 70, 4, '../images/old_man_sea.jpg'),
('9780062073488', 'Murder on the Orient Express', 1934, 23.99, 'Art', 10, 40, 3, '../images/orient_express.jpg');

-- 5. AUTHORED_BY (depends on author and book)
INSERT INTO authored_by (isbn, author_id) VALUES
('9780747532699', 1),
('9780452284234', 2),
('9780061120084', 3),
('9780743273565', 4),
('9780141439518', 5),
('9780486400776', 6),
('9780684801223', 7),
('9780062073488', 8);

-- 6. REFRESH_TOKENS (optional - depends on users)
-- Uncomment if needed for testing
-- INSERT INTO refresh_tokens (token, expiry_date, user_id) VALUES
-- ('sample_token_admin_1', DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
-- ('sample_token_admin_2', DATE_ADD(NOW(), INTERVAL 7 DAY), 2),
-- ('sample_token_john', DATE_ADD(NOW(), INTERVAL 7 DAY), 3);

-- 7. SHOPPING_CART (depends on users)
INSERT INTO shopping_cart (user_id) VALUES
(3),
(4),
(5);

-- 8. ORDERS (depends on users)
INSERT INTO orders (order_date, total_price, credit_card_number, cc_expiry_date, user_id) VALUES
('2024-12-01 10:30:00', 52.98, '4532123456789012', '2026-12-31', 3),
('2024-12-05 14:15:00', 44.98, '5412345678901234', '2027-06-30', 4),
('2024-12-10 09:45:00', 38.98, '3712345678901234', '2026-08-31', 5);

-- 9. CART_DETAILS (depends on shopping_cart and book)
INSERT INTO cart_details (cart_id, isbn, quantity) VALUES
(1, '9780747532699', 1),
(1, '9780452284234', 2),
(2, '9780141439518', 3),
(2, '9780061120084', 1),
(3, '9780684801223', 2),
(3, '9780062073488', 1);

-- 10. ORDER_DETAILS (depends on orders and book)
INSERT INTO order_details (order_id, isbn, quantity, unit_price) VALUES
(1, '9780747532699', 1, 29.99),
(1, '9780452284234', 1, 19.99),
(2, '9780141439518', 2, 18.99),
(2, '9780684801223', 1, 16.99),
(3, '9780061120084', 1, 24.99),
(3, '9780743273565', 1, 22.99);

-- 11. RESTOCK_ORDER (depends on users and book)
-- Status must be: 'Pending' or 'Confirmed'
INSERT INTO restock_order (order_date, quantity, status, user_id, isbn) VALUES
('2024-11-20 08:00:00', 30, 'Confirmed', 1, '9780747532699'),
('2024-11-22 10:30:00', 25, 'Confirmed', 2, '9780452284234'),
('2024-12-15 14:00:00', 20, 'Pending', 1, '9780062073488'),
('2024-12-18 09:15:00', 15, 'Pending', 2, '9780743273565');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT COUNT(*) AS authors FROM author;
SELECT COUNT(*) AS publishers FROM publisher;
SELECT COUNT(*) AS users FROM users;
SELECT COUNT(*) AS books FROM book;
SELECT COUNT(*) AS authored_by FROM authored_by;
SELECT COUNT(*) AS carts FROM shopping_cart;
SELECT COUNT(*) AS orders FROM orders;
SELECT COUNT(*) AS cart_items FROM cart_details;
SELECT COUNT(*) AS order_items FROM order_details;
SELECT COUNT(*) AS restock_orders FROM restock_order;