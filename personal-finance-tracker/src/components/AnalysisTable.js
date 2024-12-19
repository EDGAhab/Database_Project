import React, { useEffect, useState } from "react";

const AnalysisTable = () => {
  const [data, setData] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/financial-analysis/1");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSpendingHabits = async () => {
      try {
        const response = await fetch("http://localhost:5000/spending-habits/1");
        if (!response.ok) throw new Error("Failed to fetch spending data");
        const result = await response.json();
        setSpendingData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFinancialAnalysis();
    fetchSpendingHabits();
  }, []);

  if (loading) return <p className="text-center text-blue-600 mt-4">Loading financial data...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="overflow-x-auto mx-auto mt-4 w-11/12">
      {data.map((row, index) => (
        row.GoalName && row.TargetAmount ? (
          <div key={index} className="mb-12"> {/* Increased margin for better spacing */}
            {/* Progress Bar */}
            <p className="text-lg font-semibold text-blue-700 mb-4 text-center"> {/* Adjusted spacing */}
              Goal: {row.GoalName} (${row.TargetAmount})
            </p>
            <div className="w-3/4 bg-gray-200 rounded-full h-6 mx-auto mb-8"> {/* Increased spacing below */}
              <div
                className="h-6 rounded-full bg-green-500 text-xs text-white flex items-center justify-center"
                style={{
                  width: `${Math.min(100, ((row.CurrentAmount / row.TargetAmount) * 100).toFixed(2))}%`,
                }}
              >
                {Math.min(100, ((row.CurrentAmount / row.TargetAmount) * 100).toFixed(2))}%
              </div>
            </div>

            {/* Original Financial Analysis Table */}
            <table className="min-w-full bg-white border rounded-lg shadow-md mb-8"> {/* Adjusted margin for spacing */}
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-2 px-4 border">User Name</th>
                  <th className="py-2 px-4 border">Current Amount</th>
                  <th className="py-2 px-4 border">Goal Name</th>
                  <th className="py-2 px-4 border">Target Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100">
                  <td className="py-2 px-4 border text-center">{row.UserName || "N/A"}</td>
                  <td className="py-2 px-4 border text-center">${row.CurrentAmount || "0.00"}</td>
                  <td className="py-2 px-4 border text-center">{row.GoalName || "N/A"}</td>
                  <td className="py-2 px-4 border text-center">${row.TargetAmount || "0.00"}</td>
                </tr>
              </tbody>
            </table>

            {/* Spending Habits Table */}
            <div className="mt-8"> {/* Added spacing above spending habits */}
              <h3 className="text-center text-blue-600 font-bold">Spending Habits</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow-md">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="py-2 px-4 border text-center">Category</th>
                      <th className="py-2 px-4 border text-center">Spent Amount</th>
                      <th className="py-2 px-4 border text-center">Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spendingData.map((spend, idx) => {
                      const totalSpent = Number(spend.TotalSpent);
                      return (
                        <tr key={idx} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border text-center">
                            {spend.CategoryName || "N/A"}
                          </td>
                          <td className="py-2 px-4 border text-center">
                            ${isNaN(totalSpent) ? "0.00" : totalSpent.toFixed(2)}
                          </td>
                          <td className="py-2 px-4 border text-center">
                            {spend.Month || "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null
      ))}
    </div>
  );
};

export default AnalysisTable;
