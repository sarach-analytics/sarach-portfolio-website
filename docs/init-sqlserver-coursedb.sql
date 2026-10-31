-- =============================================================
-- SQL Course Database - SQL Server Version
-- =============================================================
-- Script Purpose:
--     This script creates a SQL Server database named 'CourseDB' for the
--     SQL for BI Analysis course. It includes sample data that aligns
--     with all course lessons, practice exercises, and quiz questions.
--
--     The database contains the Products, Customers, and Orders tables
--     used throughout the BASIC I and BASIC II lessons.
--
-- WARNING:
--     Running this script will drop the entire 'CourseDB' database if it exists,
--     permanently deleting all data within it. Proceed with caution and ensure you
--     have proper backups before executing this script.
-- =============================================================

-- Drop database if exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'CourseDB')
BEGIN
    ALTER DATABASE CourseDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CourseDB;
END
GO

-- Create database
CREATE DATABASE CourseDB;
GO

USE CourseDB;
GO

-- ======================================================
-- Table: Products
-- ======================================================
-- Used in: BASIC I lessons (Lessons 10-16)
-- Exercises: SELECT, WHERE, filtering, sorting, string functions
-- Quiz: BASIC I questions
-- ======================================================

IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;
IF OBJECT_ID('Customers', 'U') IS NOT NULL DROP TABLE Customers;
IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;
IF OBJECT_ID('Inventory', 'U') IS NOT NULL DROP TABLE Inventory;
GO

CREATE TABLE Products (
    product_id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    rating DECIMAL(3, 2),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- Insert sample data for practice exercises and quizzes
INSERT INTO Products (product_name, category, price, stock, rating) VALUES
-- Electronics Category (BASIC I - Exercise 1, 2, 3)
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
('Professional Camera', 'Electronics', 1499.99, 4, 4.9),
('Limited Edition Watch', 'Electronics', 899.99, 5, 4.9),

-- Clothing Category (BASIC I - Exercise 3, 5)
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
('Designer Sunglasses', 'Clothing', 199.99, 7, 4.8),

-- Books Category (BASIC I - Exercise 3, Quiz)
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
('Rare Book Collection', 'Books', 299.99, 3, 5.0),

-- Home & Garden Category (BASIC I - Exercise 4, 6)
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
('Artisan Coffee Beans', 'Home & Garden', 29.99, 8, 4.7),

-- Sports & Outdoors Category (BASIC II - JOINs, Aggregates)
('Yoga Mat', 'Sports & Outdoors', 29.99, 250, 4.5),
('Dumbbell Set', 'Sports & Outdoors', 89.99, 80, 4.7),
('Camping Tent', 'Sports & Outdoors', 159.99, 45, 4.6),
('Hiking Backpack', 'Sports & Outdoors', 79.99, 65, 4.5),
('Basketball', 'Sports & Outdoors', 24.99, 120, 4.4),
('Swimming Goggles', 'Sports & Outdoors', 19.99, 150, 4.3),
('Bicycle Helmet', 'Sports & Outdoors', 49.99, 90, 4.6),
('Fitness Tracker', 'Sports & Outdoors', 129.99, 100, 4.7),
('Tennis Racket', 'Sports & Outdoors', 89.99, 55, 4.5),
('Water Bottle', 'Sports & Outdoors', 14.99, 300, 4.4);
GO

-- ======================================================
-- Table: Customers
-- ======================================================
-- Used in: BASIC II lessons (Lessons 18-25)
-- Exercises: JOINs, Logical Operators, Aggregates
-- Quiz: BASIC II questions
-- ======================================================

CREATE TABLE Customers (
    customer_id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(50),
    country VARCHAR(50),
    join_date DATE,
    customer_score INT,
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- Insert customers data (BASIC II - JOINs exercises)
INSERT INTO Customers (first_name, last_name, email, phone, city, country, join_date, customer_score) VALUES
('John', 'Smith', 'john.smith@email.com', '555-0101', 'New York', 'USA', '2024-01-15', 850),
('Emma', 'Johnson', 'emma.j@email.com', '555-0102', 'London', 'UK', '2024-02-20', 920),
('Michael', 'Williams', 'michael.w@email.com', '555-0103', 'Toronto', 'Canada', '2024-03-10', 780),
('Sophia', 'Brown', 'sophia.b@email.com', '555-0104', 'Sydney', 'Australia', '2024-01-25', 890),
('James', 'Jones', 'james.jones@email.com', '555-0105', 'Los Angeles', 'USA', '2024-04-05', 950),
('Maria', 'Garcia', 'maria.garcia@email.com', '555-0106', 'Madrid', 'Spain', '2024-02-14', 810),
('David', 'Martinez', 'david.m@email.com', '555-0107', 'Mexico City', 'Mexico', '2024-05-01', 720),
('Lisa', 'Anderson', 'lisa.a@email.com', '555-0108', 'Chicago', 'USA', '2024-03-18', 880),
('Robert', 'Taylor', 'robert.t@email.com', '555-0109', 'Berlin', 'Germany', NULL, 750),
('Jennifer', 'Thomas', 'jennifer.th@email.com', '555-0110', 'Paris', 'France', '2024-06-12', 900),
('William', 'Moore', 'william.m@email.com', '555-0111', 'Tokyo', 'Japan', '2024-01-30', 870),
('Sarah', 'Jackson', 'sarah.j@email.com', '555-0112', 'Singapore', 'Singapore', '2024-04-22', 930),
('Daniel', 'White', 'daniel.w@email.com', '555-0113', 'Dubai', 'UAE', '2024-05-15', 800),
('Emily', 'Harris', 'emily.h@email.com', '555-0114', 'Vancouver', 'Canada', '2024-02-28', 910),
('Matthew', 'Martin', 'matthew.m@email.com', '555-0115', 'Melbourne', 'Australia', '2024-03-05', 760);
GO

-- ======================================================
-- Table: Orders
-- ======================================================
-- Used in: BASIC II lessons (Lessons 18-25)
-- Exercises: JOINs, Aggregates, GROUP BY, Date Functions
-- Quiz: BASIC II questions
-- ======================================================

CREATE TABLE Orders (
    order_id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    customer_id INT,
    product_id INT,
    quantity INT NOT NULL,
    order_date DATE NOT NULL,
    ship_date DATE,
    order_status VARCHAR(20) DEFAULT 'Pending',
    total_amount DECIMAL(10, 2),
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL,
    CONSTRAINT FK_Orders_Products FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE SET NULL
);
GO

-- Insert orders data (BASIC II - JOINs, Aggregates, Date Functions)
INSERT INTO Orders (customer_id, product_id, quantity, order_date, ship_date, order_status, total_amount) VALUES
-- January 2025 Orders (Date Functions exercise)
(1, 2, 1, '2025-01-15', '2025-01-18', 'Delivered', 699.99),
(1, 11, 2, '2025-01-20', '2025-01-23', 'Delivered', 39.98),
(2, 21, 1, '2025-01-22', '2025-01-25', 'Delivered', 34.99),
(3, 15, 1, '2025-01-10', '2025-01-13', 'Delivered', 89.99),
(4, 7, 1, '2025-01-25', '2025-01-28', 'Delivered', 499.99),
(5, 31, 3, '2025-01-18', '2025-01-21', 'Delivered', 104.97),

-- February 2025 Orders (Aggregates exercise)
(1, 41, 1, '2025-02-05', '2025-02-08', 'Delivered', 79.99),
(2, 3, 1, '2025-02-10', '2025-02-13', 'Delivered', 1299.99),
(3, 12, 2, '2025-02-15', '2025-02-18', 'Delivered', 89.98),
(4, 22, 1, '2025-02-20', '2025-02-23', 'Delivered', 34.99),
(5, 4, 1, '2025-02-12', '2025-02-15', 'Delivered', 45.50),
(6, 25, 2, '2025-02-25', '2025-02-28', 'Delivered', 69.98),

-- March 2025 Orders (GROUP BY exercise)
(7, 13, 1, '2025-03-05', '2025-03-08', 'Delivered', 19.99),
(8, 18, 1, '2025-03-10', '2025-03-13', 'Delivered', 199.99),
(9, 6, 1, '2025-03-15', '2025-03-18', 'Delivered', 399.99),
(10, 33, 1, '2025-03-20', '2025-03-23', 'Delivered', 79.99),
(11, 45, 2, '2025-03-12', '2025-03-15', 'Delivered', 49.98),
(12, 23, 1, '2025-03-25', '2025-03-28', 'Delivered', 34.99),

-- April 2025 Orders (JOINs exercise)
(1, 8, 3, '2025-04-05', '2025-04-08', 'Shipped', 38.97),
(2, 14, 1, '2025-04-10', '2025-04-13', 'Shipped', 49.99),
(3, 27, 2, '2025-04-15', '2025-04-18', 'Shipped', 109.98),
(4, 32, 1, '2025-04-20', '2025-04-23', 'Shipped', 129.99),
(5, 17, 1, '2025-04-12', NULL, 'Processing', 89.99),
(6, 42, 1, '2025-04-25', NULL, 'Processing', 89.99),

-- May 2025 Orders (AND/OR operators exercise)
(7, 9, 1, '2025-05-05', NULL, 'Pending', 79.99),
(8, 20, 1, '2025-05-10', NULL, 'Pending', 55.00),
(9, 34, 2, '2025-05-15', NULL, 'Pending', 259.98),
(10, 48, 3, '2025-05-20', NULL, 'Pending', 44.97),
(11, 5, 1, '2025-05-12', NULL, 'Pending', 249.99),
(12, 26, 1, '2025-05-25', NULL, 'Pending', 54.99),

-- June 2025 Orders (HAVING clause exercise)
(13, 16, 1, '2025-06-05', NULL, 'Pending', 39.99),
(14, 30, 1, '2025-06-10', NULL, 'Pending', 45.99),
(15, 37, 1, '2025-06-15', NULL, 'Pending', 249.99),
(1, 10, 2, '2025-06-20', NULL, 'Pending', 69.98),
(2, 24, 1, '2025-06-12', NULL, 'Pending', 44.99),
(3, 50, 5, '2025-06-25', NULL, 'Pending', 74.95),

-- Additional orders for aggregate practice
(1, 1, 1, '2025-06-28', NULL, 'Pending', 89.99),
(2, 19, 2, '2025-06-29', NULL, 'Pending', 399.98),
(3, 35, 1, '2025-06-30', NULL, 'Pending', 159.99);
GO

-- ======================================================
-- Inventory Table (Simple table for Lesson 2 example)
-- ======================================================

CREATE TABLE Inventory (
    product_id INT NOT NULL PRIMARY KEY,
    product_name VARCHAR(100),
    price DECIMAL(10, 2),
    quantity INT
);
GO

INSERT INTO Inventory (product_id, product_name, price, quantity) VALUES
(1, 'Laptop', 999.99, 45),
(2, 'Mouse', 25.50, 150),
(3, 'Keyboard', 75.00, 80);
GO

-- ======================================================
-- Verification Queries
-- ======================================================
-- Run these queries to verify the database setup

PRINT 'Database Setup Complete!';
GO

SELECT 'Total Products:' AS Info, COUNT(*) AS Count FROM Products;
SELECT 'Total Customers:' AS Info, COUNT(*) AS Count FROM Customers;
SELECT 'Total Orders:' AS Info, COUNT(*) AS Count FROM Orders;
GO

-- Verify Products by Category
SELECT
    category,
    COUNT(*) AS product_count,
    ROUND(AVG(price), 2) AS avg_price,
    MIN(price) AS min_price,
    MAX(price) AS max_price
FROM Products
GROUP BY category
ORDER BY product_count DESC;
GO

-- Verify Orders by Status
SELECT
    order_status,
    COUNT(*) AS order_count,
    ROUND(SUM(total_amount), 2) AS total_revenue
FROM Orders
GROUP BY order_status
ORDER BY order_count DESC;
GO

-- Verify Orders by Month (Date Functions practice)
SELECT
    FORMAT(order_date, 'yyyy-MM') AS order_month,
    COUNT(*) AS order_count,
    ROUND(SUM(total_amount), 2) AS monthly_revenue
FROM Orders
GROUP BY FORMAT(order_date, 'yyyy-MM')
ORDER BY order_month;
GO

-- Check for low stock items (Exercise 4 practice)
SELECT
    product_name,
    stock,
    price
FROM Products
WHERE stock < 10
ORDER BY stock ASC;
GO

-- =====================================================
-- Practice Query Examples (Based on Course Exercises)
-- =====================================================

-- BASIC I - Exercise 1: Basic SELECT
-- SELECT product_name, price FROM Products;

-- BASIC I - Exercise 2: Filtering with WHERE
-- SELECT product_name, category, price FROM Products WHERE price > 100 ORDER BY price DESC;

-- BASIC I - Exercise 3: Using IN Operator
-- SELECT product_name, category, price FROM Products WHERE category IN ('Electronics', 'Books', 'Clothing') ORDER BY category;

-- BASIC I - Exercise 4: Price Range with BETWEEN
-- SELECT product_name, price FROM Products WHERE price BETWEEN 50 AND 150 ORDER BY price;

-- BASIC I - Exercise 5: Pattern Matching with LIKE
-- SELECT product_name, price FROM Products WHERE product_name LIKE 'Pro%' ORDER BY product_name;

-- BASIC I - Exercise 6: Top Rated Products
-- SELECT TOP 5 product_name, rating, price FROM Products ORDER BY rating DESC;

-- BASIC I - Exercise 7: String Functions
-- SELECT TOP 10 UPPER(product_name) AS name_upper, LEN(product_name) AS name_length, price FROM Products ORDER BY name_length DESC;

-- BASIC I - Challenge Exercise
-- SELECT product_name, price, rating FROM Products WHERE category = 'Electronics' AND price BETWEEN 40 AND 100 AND rating >= 4.4 AND (product_name LIKE '%Wireless%' OR product_name LIKE '%Bluetooth%') ORDER BY rating DESC;

-- BASIC II - INNER JOIN Example
-- SELECT o.order_id, c.first_name, c.last_name, p.product_name, o.quantity, o.total_amount FROM Orders o INNER JOIN Customers c ON o.customer_id = c.customer_id INNER JOIN Products p ON o.product_id = p.product_id WHERE o.order_status = 'Delivered' ORDER BY o.order_date DESC;

-- BASIC II - LEFT JOIN Example
-- SELECT c.first_name, c.last_name, COUNT(o.order_id) AS total_orders FROM Customers c LEFT JOIN Orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY total_orders DESC;

-- BASIC II - Aggregate Functions
-- SELECT category, COUNT(*) AS product_count, AVG(price) AS avg_price, MIN(price) AS min_price, MAX(price) AS max_price FROM Products GROUP BY category;

-- BASIC II - GROUP BY with HAVING
-- SELECT c.customer_id, c.first_name, c.last_name, COUNT(o.order_id) AS order_count, SUM(o.total_amount) AS total_spent FROM Customers c INNER JOIN Orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name, c.last_name HAVING SUM(o.total_amount) > 200 ORDER BY total_spent DESC;

-- BASIC II - Date Functions (SQL Server syntax)
-- SELECT order_id, order_date, YEAR(order_date) AS order_year, MONTH(order_date) AS order_month, DAY(order_date) AS order_day FROM Orders WHERE order_date >= '2025-01-01' ORDER BY order_date DESC;

-- =====================================================
-- End of CourseDB Setup
-- =====================================================

PRINT '✓ CourseDB setup complete!';
PRINT 'You can now practice with the Products, Customers, Orders, and Inventory tables.';
PRINT 'Refer to the course lessons and exercises for practice queries.';
GO
