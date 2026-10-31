-- =====================================================
-- SQL Course - Sample Database Setup
-- =====================================================
-- This file creates sample databases used in the course examples
-- Run this file in your SQL environment to set up practice data

-- =====================================================
-- Chapter 1: Introduction to Databases
-- =====================================================

-- Simple Inventory Table (used in Lesson 2)
CREATE TABLE IF NOT EXISTS Inventory (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100),
    price DECIMAL(10, 2),
    quantity INT
);

INSERT INTO Inventory (product_id, product_name, price, quantity) VALUES
(1, 'Laptop', 999.99, 45),
(2, 'Mouse', 25.50, 150),
(3, 'Keyboard', 75.00, 80);

-- =====================================================
-- Chapter 2: Basic SELECT Queries
-- =====================================================

-- E-commerce Products Table (used in Lesson 10 Practice Exercises)
CREATE TABLE IF NOT EXISTS Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    rating DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for practice exercises
INSERT INTO Products (product_name, category, price, stock, rating) VALUES
-- Electronics
('Wireless Headphones', 'Electronics', 89.99, 125, 4.5),
('Smartphone', 'Electronics', 699.99, 50, 4.7),
('Laptop Pro 15', 'Electronics', 1299.99, 30, 4.8),
('Bluetooth Speaker', 'Electronics', 45.50, 200, 4.3),
('Smart Watch', 'Electronics', 249.99, 75, 4.6),
('Tablet 10-inch', 'Electronics', 399.99, 60, 4.4),
('Gaming Console', 'Electronics', 499.99, 40, 4.9),
('USB-C Cable', 'Electronics', 12.99, 500, 4.2),
('Webcam HD', 'Electronics', 79.99, 85, 4.5),
('Portable Charger', 'Electronics', 34.99, 150, 4.4),

-- Clothing
('Cotton T-Shirt', 'Clothing', 19.99, 300, 4.3),
('Denim Jeans', 'Clothing', 49.99, 150, 4.5),
('Summer Dress', 'Clothing', 39.99, 80, 4.6),
('Hoodie Sweatshirt', 'Clothing', 45.00, 120, 4.4),
('Running Shoes', 'Clothing', 89.99, 95, 4.7),
('Leather Jacket', 'Clothing', 199.99, 25, 4.8),
('Casual Sneakers', 'Clothing', 65.00, 110, 4.5),
('Wool Sweater', 'Clothing', 55.00, 70, 4.6),
('Polo Shirt', 'Clothing', 29.99, 180, 4.3),
('Winter Coat', 'Clothing', 149.99, 40, 4.7),

-- Books
('Learn SQL: The Complete Guide', 'Books', 34.99, 200, 4.9),
('JavaScript for Beginners', 'Books', 29.99, 150, 4.7),
('Python Programming Mastery', 'Books', 39.99, 180, 4.8),
('Web Development Bootcamp', 'Books', 44.99, 120, 4.6),
('Data Science Handbook', 'Books', 49.99, 90, 4.7),
('Machine Learning Basics', 'Books', 54.99, 75, 4.8),
('React Development Guide', 'Books', 32.99, 140, 4.5),
('Database Design Principles', 'Books', 42.99, 110, 4.6),
('Cloud Computing Essentials', 'Books', 37.99, 95, 4.4),
('Cybersecurity Fundamentals', 'Books', 45.99, 85, 4.7),

-- Home & Garden
('Coffee Maker', 'Home & Garden', 79.99, 60, 4.5),
('Blender Pro', 'Home & Garden', 129.99, 45, 4.6),
('Garden Tool Set', 'Home & Garden', 89.99, 35, 4.4),
('Air Purifier', 'Home & Garden', 199.99, 50, 4.7),
('LED Desk Lamp', 'Home & Garden', 34.99, 150, 4.3),
('Kitchen Knife Set', 'Home & Garden', 119.99, 70, 4.8),
('Vacuum Cleaner', 'Home & Garden', 249.99, 40, 4.6),
('Indoor Plant Pot', 'Home & Garden', 15.99, 200, 4.2),
('Bath Towel Set', 'Home & Garden', 29.99, 180, 4.4),
('Wall Clock', 'Home & Garden', 24.99, 100, 4.3),

-- Sports & Outdoors
('Yoga Mat', 'Sports & Outdoors', 29.99, 250, 4.5),
('Dumbbell Set', 'Sports & Outdoors', 89.99, 80, 4.7),
('Camping Tent', 'Sports & Outdoors', 159.99, 45, 4.6),
('Hiking Backpack', 'Sports & Outdoors', 79.99, 65, 4.5),
('Basketball', 'Sports & Outdoors', 24.99, 120, 4.4),
('Swimming Goggles', 'Sports & Outdoors', 19.99, 150, 4.3),
('Bicycle Helmet', 'Sports & Outdoors', 49.99, 90, 4.6),
('Fitness Tracker', 'Sports & Outdoors', 129.99, 100, 4.7),
('Tennis Racket', 'Sports & Outdoors', 89.99, 55, 4.5),
('Water Bottle', 'Sports & Outdoors', 14.99, 300, 4.4),

-- Low stock items for Exercise 4
('Rare Book Collection', 'Books', 299.99, 3, 5.0),
('Limited Edition Watch', 'Electronics', 899.99, 5, 4.9),
('Designer Sunglasses', 'Clothing', 199.99, 7, 4.8),
('Artisan Coffee Beans', 'Home & Garden', 29.99, 8, 4.7),
('Professional Camera', 'Electronics', 1499.99, 4, 4.9);

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check total records
SELECT 'Total Products' AS Info, COUNT(*) AS Count FROM Products;

-- Check products by category
SELECT category, COUNT(*) AS product_count
FROM Products
GROUP BY category
ORDER BY product_count DESC;

-- Check price range
SELECT
    MIN(price) AS lowest_price,
    MAX(price) AS highest_price,
    AVG(price) AS average_price
FROM Products;

-- Check stock levels
SELECT
    COUNT(CASE WHEN stock < 10 THEN 1 END) AS low_stock_items,
    COUNT(CASE WHEN stock >= 10 AND stock < 100 THEN 1 END) AS medium_stock_items,
    COUNT(CASE WHEN stock >= 100 THEN 1 END) AS high_stock_items
FROM Products;

-- =====================================================
-- Practice Query Examples (Answers to Exercises)
-- =====================================================

-- Exercise 1: Find All Electronics
-- SELECT * FROM Products WHERE category = 'Electronics';

-- Exercise 2: Premium Products
-- SELECT product_name, price FROM Products WHERE price > 500 ORDER BY price DESC;

-- Exercise 3: Top Rated Books
-- SELECT product_name, rating FROM Products WHERE category = 'Books' ORDER BY rating DESC LIMIT 5;

-- Exercise 4: Low Stock Alert
-- SELECT product_name, stock FROM Products WHERE stock < 10 ORDER BY stock ASC;

-- Exercise 5: Affordable Clothing
-- SELECT product_name, price FROM Products WHERE category = 'Clothing' AND price >= 20 AND price <= 50 ORDER BY price ASC;

-- Exercise 6: Pagination - Products Catalog
-- SELECT product_name, price FROM Products ORDER BY product_id LIMIT 10 OFFSET 20;

-- Challenge Exercise: Featured Products
-- SELECT product_name, price, rating, stock FROM Products
-- WHERE category = 'Electronics' AND stock > 0 AND price > 100
-- ORDER BY rating DESC LIMIT 3;

-- =====================================================
-- Additional Practice Data (Optional)
-- =====================================================

-- Customers Table (for future chapters)
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(50),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Customers (first_name, last_name, email, phone, city, country) VALUES
('John', 'Smith', 'john.smith@email.com', '555-0101', 'New York', 'USA'),
('Emma', 'Johnson', 'emma.j@email.com', '555-0102', 'London', 'UK'),
('Michael', 'Williams', 'michael.w@email.com', '555-0103', 'Toronto', 'Canada'),
('Sophia', 'Brown', 'sophia.b@email.com', '555-0104', 'Sydney', 'Australia'),
('James', 'Jones', 'james.jones@email.com', '555-0105', 'Los Angeles', 'USA');

-- Orders Table (for future chapters)
CREATE TABLE IF NOT EXISTS Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    product_id INT,
    quantity INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

INSERT INTO Orders (customer_id, product_id, quantity, status) VALUES
(1, 2, 1, 'Completed'),
(1, 11, 2, 'Completed'),
(2, 21, 1, 'Shipped'),
(3, 15, 1, 'Completed'),
(4, 7, 1, 'Pending'),
(5, 31, 3, 'Completed'),
(1, 41, 1, 'Shipped'),
(2, 3, 1, 'Completed'),
(3, 12, 2, 'Pending'),
(4, 22, 1, 'Completed');

-- =====================================================
-- End of Sample Database Setup
-- =====================================================

SELECT '✓ Database setup complete!' AS Status;
SELECT 'You can now practice with the Products, Customers, and Orders tables.' AS Message;
