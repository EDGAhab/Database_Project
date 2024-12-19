-- PFtracker (Personal Finance Tracker) Database Schema
-- This database manages personal financial data including transactions, accounts, budgets, and investments

-- Initialize database
-- CREATE DATABASE PFtracker;
-- USE PFtracker;

-- Users table: Stores basic user information and authentication details
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,    -- Email used as unique identifier for login
    PasswordHash VARCHAR(255) NOT NULL,    -- Stores hashed password for security
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample user data
INSERT INTO Users (Name, Email, PasswordHash) VALUES ('Alexander Johnson', 'alexander.johnson@gmail.com', '2s');

-- Categories table: Defines transaction categories for expense tracking
CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT
);

-- Default categories for expense classification
INSERT INTO Categories (Name, Description)
VALUES 
    ('Food', 'Food expense'),
    ('Apparel', 'Clothes expense'),
    ('Transportation', 'Transport expense'),
    ('Household', 'Misc. home expenses'),
    ('Other', 'Other expenses');

-- Accounts table: Tracks different types of financial accounts
CREATE TABLE Accounts (
    AccountID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    AccountName VARCHAR(255) NOT NULL,
    AccountType ENUM('Bank', 'Credit Card', 'Wallet', 'Investment') NOT NULL,  -- Restricts account types
    Balance DECIMAL(15, 2) DEFAULT 0.00,   -- Supports large amounts with 2 decimal places
    Currency CHAR(3) NOT NULL,             -- ISO currency code (e.g., 'INR', 'USD')
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE  -- Removes accounts when user is deleted
);

-- Transactions table: Records all financial transactions
CREATE TABLE Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    AccountID INT NOT NULL,
    CategoryID INT NOT NULL,
    Amount DECIMAL(15, 2) NOT NULL,
    TransactionType ENUM('Credit', 'Debit') NOT NULL,  -- Distinguishes between income and expenses
    TransactionDate DATE NOT NULL,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON DELETE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
);

-- Index for optimizing date-based transaction queries
CREATE INDEX idx_transaction_date ON Transactions(TransactionDate);

-- Store UserID for sample data insertion
SET @alexander_id := (SELECT UserID FROM Users WHERE Name = 'Alexander Johnson' LIMIT 1);

-- Sample accounts data with different types and initial balances
INSERT INTO Accounts (UserID, AccountName, AccountType, Balance, Currency) VALUES 
(
    @alexander_id, 
    'Personal Savings', 
    'Bank', 
    50000.00, 
    'INR'
),
-- ... [Additional account insertions]

-- Budgets table: Tracks spending limits by category
CREATE TABLE Budgets (
    BudgetID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    CategoryID INT NOT NULL,
    BudgetAmount DECIMAL(15, 2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
);

-- SavingsGoals table: Tracks progress towards financial goals
CREATE TABLE SavingsGoals (
    GoalID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    GoalName VARCHAR(255) NOT NULL,
    TargetAmount DECIMAL(15, 2) NOT NULL,
    CurrentAmount DECIMAL(15, 2) DEFAULT 0.00,
    Deadline DATE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Get category IDs for sample data
SET @food_category_id := (SELECT CategoryID FROM Categories WHERE Name = 'Food' LIMIT 1);
SET @transport_category_id := (SELECT CategoryID FROM Categories WHERE Name = 'Transportation' LIMIT 1);
SET @apparel_category_id := (SELECT CategoryID FROM Categories WHERE Name = 'Apparel' LIMIT 1);

-- Sample budget data for different categories
INSERT INTO Budgets (UserID, CategoryID, BudgetAmount, StartDate, EndDate) VALUES 
-- ... [Budget insertions]

-- Sample savings goals with progress tracking
INSERT INTO SavingsGoals (UserID, GoalName, TargetAmount, CurrentAmount, Deadline) VALUES 
-- ... [Savings goals insertions]

-- Investments table: Tracks investment portfolio
CREATE TABLE Investments (
    InvestmentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    InvestmentType VARCHAR(255) NOT NULL,
    InitialValue DECIMAL(15, 2) NOT NULL,
    CurrentValue DECIMAL(15, 2),
    PurchaseDate DATE NOT NULL,
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Add stock symbol column for equity investments
ALTER TABLE Investments ADD COLUMN StockSymbol VARCHAR(10);

-- Sample investment data
INSERT INTO Investments 
    (UserID, InvestmentType, InitialValue, CurrentValue, PurchaseDate, Notes, StockSymbol) 
VALUES 
    (1, 'Stock', 10000.00, 10000.00, '2024-12-01', 'Purchased Apple shares', 'AAPL');

-- Views for common reports and analytics

-- UserBalances: Aggregates total balance across all accounts
CREATE VIEW UserBalances AS
SELECT 
    u.UserID,
    u.Name AS UserName,
    SUM(a.Balance) AS TotalBalance
FROM 
    Users u
JOIN 
    Accounts a ON u.UserID = a.UserID
GROUP BY 
    u.UserID, u.Name;

-- CategorySpending: Analyzes spending patterns by category
CREATE VIEW CategorySpending AS
SELECT 
    u.UserID,
    u.Name AS UserName,
    c.Name AS CategoryName,
    SUM(t.Amount) AS TotalSpent
FROM 
    Users u
JOIN 
    Accounts a ON u.UserID = a.UserID
JOIN 
    Transactions t ON a.AccountID = t.AccountID
JOIN 
    Categories c ON t.CategoryID = c.CategoryID
WHERE 
    t.TransactionType = 'Expense'
GROUP BY 
    u.UserID, u.Name, c.Name;

-- SavingsProgress: Tracks progress towards savings goals
CREATE VIEW SavingsProgress AS
SELECT 
    u.UserID,
    u.Name AS UserName,
    sg.GoalName,
    sg.TargetAmount,
    sg.CurrentAmount,
    ROUND((sg.CurrentAmount / sg.TargetAmount) * 100, 2) AS ProgressPercentage,
    sg.Deadline
FROM 
    Users u
JOIN 
    SavingsGoals sg ON u.UserID = sg.UserID;

-- MonthlyTransactions: Summarizes monthly financial activity
CREATE VIEW MonthlyTransactions AS
SELECT 
    u.UserID,
    u.Name AS UserName,
    DATE_FORMAT(t.TransactionDate, '%Y-%m') AS MonthYear,
    SUM(CASE WHEN t.TransactionType = 'Debit' THEN t.Amount ELSE 0 END) AS TotalDebits,
    SUM(CASE WHEN t.TransactionType = 'Credit' THEN t.Amount ELSE 0 END) AS TotalCredits
FROM 
    Users u
JOIN 
    Accounts a ON u.UserID = a.UserID
JOIN 
    Transactions t ON a.AccountID = t.AccountID
GROUP BY 
    u.UserID, u.Name, DATE_FORMAT(t.TransactionDate, '%Y-%m');

-- Stored procedure for generating monthly reports
DELIMITER $$
CREATE PROCEDURE GetMonthlyReport (
    IN p_UserID INT,
    IN p_MonthYear VARCHAR(7)  -- Format: 'YYYY-MM'
)
BEGIN
    -- Generates a summary of income and expenses by category for a specific month
    SELECT 
        c.Name AS Category,
        SUM(CASE WHEN t.TransactionType = 'Expense' THEN t.Amount ELSE 0 END) AS TotalSpent,
        SUM(CASE WHEN t.TransactionType = 'Income' THEN t.Amount ELSE 0 END) AS TotalIncome
    FROM 
        Transactions t
    JOIN 
        Accounts a ON t.AccountID = a.AccountID
    JOIN 
        Categories c ON t.CategoryID = c.CategoryID
    WHERE 
        a.UserID = p_UserID
        AND DATE_FORMAT(t.TransactionDate, '%Y-%m') = p_MonthYear
    GROUP BY 
        c.Name;
END$$
DELIMITER ;