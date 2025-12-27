USE bookstore;

-- 1. Publishers
INSERT INTO publisher (pub_name, address, pub_phone_num) VALUES 
('TechPress', '123 Tech Street, Silicon Valley, CA', '555-0101'),
('HistoryHouse', '456 Old Road, London, UK', '555-0102'),
('NovelPress', '789 Story Lane, New York, NY', '555-0103'),
('ScienceDirect', '101 Lab Ave, Boston, MA', '555-0104'),
('GeoWorld', '202 Map St, Sydney, AU', '555-0105');

-- 2. Authors
INSERT INTO author (name) VALUES 
('Jane Doe'),
('John Smith'),
('Alice Brown'),
('David Green'),
('Robert Clean Code');

-- 3. Books
-- Categories: 'Science', 'Art', 'Religion', 'History', 'Geography'
INSERT INTO book (isbn, title, publication_year, selling_price, category, threshold, quantity, pub_id, img_path) VALUES 
('9781234567890', 'The Art of Coding', 2022, 29.99, 'Science', 10, 50, 1, '../images/bookcover.jpg'),
('9782345678901', 'History of Alexandria', 2021, 19.99, 'History', 5, 20, 2, '../images/bookcover2.jpg'),
('9783456789012', 'Fictional Dreams', 2020, 14.99, 'Art', 8, 15, 3, '../images/bookcover3.jpg'),
('9784567890123', 'Advanced Physics', 2023, 49.99, 'Science', 12, 30, 4, '../images/bookcover4.jpg'),
('9785678901234', 'World Geography', 2019, 24.99, 'Geography', 10, 25, 5, '../images/bookcover5.jpg'),
('9786789012345', 'Modern Religion', 2021, 18.50, 'Religion', 5, 40, 3, '../images/bookcover6.jpg');

-- 4. Authored_By
INSERT INTO authored_by (isbn, author_id) VALUES 
('9781234567890', 1), -- Jane Doe wrote The Art of Coding
('9782345678901', 2),
('9783456789012', 3),
('9784567890123', 4),
('9785678901234', 1),
('9786789012345', 5);

-- 5. Users
-- Passwords are minimal placeholders. In a real app, these should be BCrypt hashes.
-- 'password123' hashed with BCrypt (cost 10) -> $2a$10$Dow.Q/L/yA5s0.tr1.bK.e.8A.A.X.X.X.X.X.X.X (This is just an example, might need real generation)
-- For now, using a potential placeholder or allowing the app to handle registration.
-- Assuming the app might have a way to handle this, or user can update it. 
-- Role: 'ADMIN', 'CUSTOMER'

INSERT INTO users (username, hashed_password, email, fname, lname, phone_num, shipping_address, role) VALUES 
('adminUser', '$2a$10$ngWtkKZ8IH7Zzw.9io9dCuY3eULKf6toF2i6w3krAC6MvvXdWgorG', 'admin@bookstore.com', 'Admin', 'User', '1234567890', 'Admin HQ', 'ADMIN'),
('customerOne', '$2a$10$ngWtkKZ8IH7Zzw.9io9dCuY3eULKf6toF2i6w3krAC6MvvXdWgorG', 'customer@gmail.com', 'John', 'Doe', '0987654321', '123 Customer Lane', 'CUSTOMER');

-- 6. Shopping Cart (One per user)
INSERT INTO shopping_cart (user_id) VALUES 
(1), -- Admin's cart (though admins usually don't buy)
(2); -- Customer's cart

-- 7. Cart Details
INSERT INTO cart_details (cart_id, isbn, quantity) VALUES 
(2, '9781234567890', 1),
(2, '9785678901234', 2);

-- 8. Orders
INSERT INTO orders (order_date, total_price, credit_card_number, cc_expiry_date, user_id) VALUES 
(NOW(), 79.97, '1234567812345678', '2025-12-31', 2);

-- 9. Order Details
INSERT INTO order_details (order_id, isbn, quantity, unit_price) VALUES 
(1, '9781234567890', 1, 29.99),
(1, '9785678901234', 2, 24.99);

-- 10. Restock Orders (Trigger usually handles this, but adding manual one for testing)
INSERT INTO restock_order (order_date, quantity, status, user_id, isbn) VALUES 
(NOW(), 50, 'Pending', 1, '9783456789012');
