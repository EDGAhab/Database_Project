import React, { useEffect, useState } from "react";

const AnalysisTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/financial-analysis/1");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialAnalysis();
  }, []); // Runs only when the component is mounted

  if (loading) {
    return <p className="text-center text-blue-600 mt-4">Loading financial data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-4">{error}</p>;
  }

  if (data.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No financial data available.</p>;
  }

  return (
    <div className="overflow-x-auto mx-auto mt-4 w-11/12">
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-2 px-4 border">Account Name</th>
            <th className="py-2 px-4 border">Account Type</th>
            <th className="py-2 px-4 border">Balance</th>
            <th className="py-2 px-4 border">Goal Name</th>
            <th className="py-2 px-4 border">Target Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border text-center">{row.AccountName || "N/A"}</td>
              <td className="py-2 px-4 border text-center">{row.AccountType || "N/A"}</td>
              <td className="py-2 px-4 border text-center">${row.Balance || "0.00"}</td>
              <td className="py-2 px-4 border text-center">{row.GoalName || "N/A"}</td>
              <td className="py-2 px-4 border text-center">${row.TargetAmount || "0.00"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8">
        {data.map((row, index) =>
          row.GoalName && row.TargetAmount ? (
            <div key={index} className="mb-6">
              <p className="text-lg font-semibold text-blue-700 mb-2 text-center">
                Goal: {row.GoalName} (${row.TargetAmount})
              </p>
              <div className="w-3/4 bg-gray-200 rounded-full h-6 mx-auto">
                <div
                  className="h-6 rounded-full bg-green-500 text-xs text-white flex items-center justify-center"
                  style={{
                    width: `${Math.min(100, ((row.Balance / row.TargetAmount) * 100).toFixed(2))}%`,
                  }}
                >
                  {Math.min(100, ((row.Balance / row.TargetAmount) * 100).toFixed(2))}%
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default AnalysisTable;
