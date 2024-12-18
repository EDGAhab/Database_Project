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
      // Step 1: Generate SQL with GPT-4 API
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
              content: "You are a helpful assistant that translates natural language queries into SQL queries.",
            },
            { role: "user", content: `Generate an SQL command for the query: "${query}".` },
          ],
          max_tokens: 100,
        }),
      });

      const gptData = await gptResponse.json();
      const generatedSQL = gptData.choices[0].message.content.trim();
      setSqlCommand(generatedSQL);

      // Step 2: Pass the SQL to the backend
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
