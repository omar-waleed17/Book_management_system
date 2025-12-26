USE bookstore;

CREATE TABLE publisher (
  pub_id INT PRIMARY KEY AUTO_INCREMENT,
  pub_name VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  pub_phone_num VARCHAR(20)
);

CREATE TABLE author (
  author_id INT PRIMARY KEY AUTO_INCREMENT,
  fname VARCHAR(50),
  lname VARCHAR(50)
);

CREATE TABLE book (
  isbn VARCHAR(20) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  publication_year INT,
  selling_price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  threshold INT DEFAULT 10,
  quantity INT DEFAULT 0,
  pub_id INT,
  img_path VARCHAR(250),
  CONSTRAINT fk_book_publisher FOREIGN KEY (pub_id) REFERENCES publisher (pub_id),
  CONSTRAINT check_category CHECK (
    category IN (
      'Science',
      'Art',
      'Religion',
      'History',
      'Geography'
    )
  )
);

CREATE TABLE authored_by (
  isbn VARCHAR(20),
  author_id INT,
  PRIMARY KEY (isbn, author_id),
  CONSTRAINT fk_auth_book FOREIGN KEY (isbn) REFERENCES book (isbn),
  CONSTRAINT fk_auth_author FOREIGN KEY (author_id) REFERENCES author (author_id)
);

CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  fname VARCHAR(50),
  lname VARCHAR(50),
  phone_num VARCHAR(20),
  shipping_address VARCHAR(255),
  role VARCHAR(20) CHECK (role IN ('ADMIN', 'CUSTOMER'))
);

CREATE TABLE refresh_tokens (
  token_id INT PRIMARY KEY AUTO_INCREMENT,
  token VARCHAR(255) NOT NULL,
  expiry_date DATETIME NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE shopping_cart (
  cart_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE cart_details (
  cart_id INT,
  isbn VARCHAR(20),
  quantity INT DEFAULT 1,
  PRIMARY KEY (cart_id, isbn),
  CONSTRAINT fk_cd_cart FOREIGN KEY (cart_id) REFERENCES shopping_cart (cart_id) ON DELETE CASCADE,
  CONSTRAINT fk_cd_book FOREIGN KEY (isbn) REFERENCES book (isbn)
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_price DECIMAL(10, 2),
  credit_card_number VARCHAR(20),
  cc_expiry_date DATE,
  user_id INT NOT NULL,
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_details (
  order_id INT,
  isbn VARCHAR(20),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (order_id, isbn),
  CONSTRAINT fk_od_order FOREIGN KEY (order_id) REFERENCES orders (order_id),
  CONSTRAINT fk_od_book FOREIGN KEY (isbn) REFERENCES book (isbn)
);

CREATE TABLE restock_order (
  restock_order_id INT PRIMARY KEY AUTO_INCREMENT,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  quantity INT NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed')),
  user_id INT,
  isbn VARCHAR(20),
  CONSTRAINT fk_restock_admin FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_restock_book FOREIGN KEY (isbn) REFERENCES book (isbn)
);

DELIMITER //

CREATE TRIGGER prevent_negative_stock BEFORE UPDATE ON book 
FOR EACH ROW 
BEGIN 
  IF NEW.quantity < 0 THEN 
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Error: Stock quantity cannot be negative.';
  END IF;
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER place_restock_order AFTER UPDATE ON book 
FOR EACH ROW 
BEGIN 
  IF OLD.quantity >= OLD.threshold AND NEW.quantity < NEW.threshold THEN
    INSERT INTO restock_order (order_date, quantity, status, isbn, user_id)
    VALUES (NOW(), NEW.threshold * 3, 'Pending', NEW.isbn, NULL);
  END IF;
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER confirm_restock_order AFTER UPDATE ON restock_order 
FOR EACH ROW 
BEGIN 
  IF NEW.status = 'Confirmed' AND OLD.status != 'Confirmed' THEN
    UPDATE book
    SET quantity = quantity + NEW.quantity
    WHERE isbn = NEW.isbn;
  END IF;
END;
//

DELIMITER ;
