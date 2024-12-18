const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Feilian990725", // Add your password if applicable
  database: "finance_track", // Ensure correct database name
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Route for Personal Financial Analysis
app.get("/financial-analysis/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT 
        u.UserID,
        u.Name AS UserName,
        a.AccountName,
        a.AccountType,
        a.Balance,
        t.TransactionDate,
        t.TransactionType,
        t.Amount AS TransactionAmount,
        sg.GoalName,
        sg.TargetAmount
    FROM Users u
    LEFT JOIN Accounts a ON u.UserID = a.UserID
    LEFT JOIN Transactions t ON a.AccountID = t.AccountID
    LEFT JOIN SavingsGoals sg ON u.UserID = sg.UserID
    WHERE u.UserID = ?;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching financial analysis:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});


// Update SavingsGoals
app.post("/update-goals", (req, res) => {
  const { UserID, GoalName, TargetAmount, Deadline } = req.body;

  if (!UserID || !GoalName || !TargetAmount || !Deadline) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `
    INSERT INTO SavingsGoals (UserID, GoalName, TargetAmount, Deadline)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE TargetAmount = VALUES(TargetAmount), Deadline = VALUES(Deadline)
  `;

  db.query(query, [UserID, GoalName, TargetAmount, Deadline], (err, results) => {
    if (err) {
      console.error("Error updating goals:", err);
      return res.status(500).json({ error: "Database update failed." });
    }
    res.json({ success: true, message: "Savings goal updated successfully." });
  });
});

// Route to execute a custom SQL query
app.post("/execute-sql", (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ error: "No SQL query provided." });
  }

  // Execute the provided SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Failed to execute SQL query." });
    }
    if (results.length === 0) {
      return res.status(200).json({ message: "This query can't be processed in our database." });
    }
    res.status(200).json(results);
  });
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
