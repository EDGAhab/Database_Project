import React, { useState } from "react";

const NaturalLanguageSearch = () => {
  const [query, setQuery] = useState("");
  const [sqlCommand, setSqlCommand] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer `, // Replace with your OpenAI API key
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that translates natural language queries into SQL queries. Use the following database structure to generate SQL commands:\n\nEntities and Attributes:\n\nUsers:\n- UserID: Primary key.\n- Name: User's full name.\n- Email: User's email address.\n- PasswordHash: Encrypted password for secure login.\n- CreatedAt: Timestamp when the user account was created.\n\nAccounts:\n- AccountID: Primary key.\n- UserID: Foreign key linking to the Users entity.\n- AccountName: Descriptive name of the account (e.g., 'Savings Account').\n- AccountType: Type of account (e.g., Bank, Credit Card, Wallet, Investment).\n- Balance: Current balance in the account.\n- Currency: Currency type.\n- CreatedAt: Timestamp when the account was added.\n\nCategories:\n- CategoryID: Primary key.\n- Name: Name of the category.\n- Description: Optional description of the category.\n\nTransactions:\n- TransactionID: Primary key.\n- AccountID: Foreign key linking to the Accounts entity.\n- CategoryID: Foreign key linking to the Categories entity.\n- Amount: Transaction amount.\n- TransactionType: Type of transaction.\n- TransactionDate: Date of the transaction.\n- Description: Optional description of the transaction.\n- CreatedAt: Timestamp when the transaction was added.\n\nBudgets:\n- BudgetID: Primary key.\n- UserID: Foreign key linking to the Users entity.\n- CategoryID: Foreign key linking to the Categories entity.\n- BudgetAmount: Budgeted amount for a specific category.\n- StartDate: Start date for the budget period.\n- EndDate: End date for the budget period.\n- CreatedAt: Timestamp when the budget was created.\n\nSavingsGoals:\n- GoalID: Primary key.\n- UserID: Foreign key linking to the Users entity.\n- GoalName: Name of the savings goal.\n- TargetAmount: Total amount the user aims to save.\n- CurrentAmount: Amount saved so far.\n- Deadline: Target date for achieving the savings goal.\n- CreatedAt: Timestamp when the savings goal was added.\n\nInvestments:\n- InvestmentID: Primary key.\n- UserID: Foreign key linking to the Users entity.\n- InvestmentType: Type of investment.\n- InitialValue: Value of the investment at the time of purchase.\n- CurrentValue: Current value of the investment.\n- PurchaseDate: Date the investment was purchased.\n- Notes: Optional notes about the investment.\n- CreatedAt: Timestamp when the investment was added.\n\nReports:\n- ReportID: Primary key.\n- UserID: Foreign key linking to the Users entity.\n- ReportName: Descriptive name of the report.\n- ReportPeriod: Time period covered by the report.\n- GeneratedAt: Timestamp when the report was generated.\n- ReportData: Serialized or textual representation of the report contents.\n\nAuditLogs:\n- LogID: Primary key.\n- UserID: Foreign key linking to the Users entity.\n- ActionType: Type of action (e.g., Insert, Update, Delete).\n- TableName: Name of the affected table.\n- RecordID: ID of the affected record.\n- ActionTimestamp: Timestamp when the action occurred.\n\nTransactionTags:\n- TagID: Primary key.\n- Name: Name of the tag.\n- Description: Optional description of the tag.\n\nRelationships:\n- Users ↔ Accounts: One-to-many.\n- Accounts ↔ Transactions: One-to-many.\n- Categories ↔ Transactions: One-to-many.\n- Users ↔ Budgets: One-to-many.\n- Users ↔ SavingsGoals: One-to-many.\n- Users ↔ Investments: One-to-many.\n- Users ↔ Reports: One-to-many.\n- Users ↔ AuditLogs: One-to-many.\n- Tags ↔ Transactions: Many-to-many.`,
            },
            { role: "user", content: `Generate an SQL command for the query: "${query}". Only output the SQL command.` },
          ],
          max_tokens: 200,
        }),
      });

      const gptData = await gptResponse.json();
      const generatedSQL = gptData.choices[0].message.content.trim();
      setSqlCommand(generatedSQL);

      const backendResponse = await fetch("http://localhost:5000/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: generatedSQL }),
      });

      const backendData = await backendResponse.json();

      if (backendResponse.ok) {
        if (Array.isArray(backendData) && backendData.length > 0) {
          setResults(backendData); // Save results as an array
        } else {
          setResults("empty");
        }
      } else {
        setError(backendData.error || "Failed to process the SQL query.");
      }
    } catch (err) {
      setError("An error occurred during the process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Natural Language Search</h2>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Enter your query (e.g., 'Show me expenses on groceries')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-3 border rounded-md w-96"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300"
        >
          Search
        </button>
      </div>
      {loading && <p className="text-center text-blue-600 mt-4">Processing your query...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      {sqlCommand && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-md w-3/4">
          <p className="text-gray-800 font-mono text-sm">Generated SQL Command:</p>
          <pre className="text-blue-600 mt-2">{sqlCommand}</pre>
        </div>
      )}
      {results === "empty" && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-md w-3/4">
          <p className="text-gray-800 text-center">This query can't be processed in our database.</p>
        </div>
      )}
      {Array.isArray(results) && results.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-md w-3/4">
          <p className="text-gray-800 font-mono text-sm mb-4">Results:</p>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-4 py-2 bg-blue-200 text-gray-800">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-4 py-2 text-center text-gray-700"
                    >
                      {value !== null ? value : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NaturalLanguageSearch;
