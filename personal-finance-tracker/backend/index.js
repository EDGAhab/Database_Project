const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Feilian990725",
  database: "finance_track",
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

app.get("/financial-analysis/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT 
        u.Name AS UserName,
        sg.CurrentAmount,
        sg.GoalName,
        sg.TargetAmount
    FROM Users u
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

app.get("/spending-habits/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT 
        c.Name AS CategoryName,
        IFNULL(SUM(t.Amount), 0) AS TotalSpent,
        MONTH(t.TransactionDate) AS Month
    FROM Transactions t
    LEFT JOIN Categories c ON t.CategoryID = c.CategoryID
    WHERE t.AccountID IN (
        SELECT AccountID FROM Accounts WHERE UserID = ?
    )
    GROUP BY c.Name, MONTH(t.TransactionDate)
    ORDER BY Month, TotalSpent DESC;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching spending habits:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});


app.post("/execute-sql", (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ error: "No SQL query provided." });
  }

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


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
