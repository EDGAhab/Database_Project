import React, { useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [savingGoal, setSavingGoal] = useState("");
  const [savingAmount, setSavingAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const [data, setData] = useState([]); // Financial analysis data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);

  // Fetch financial analysis data
  const fetchFinancialAnalysis = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/financial-analysis/1");
      setData(response.data);
      setError(null);
      setShowUploadSection(false);
      setShowEditForm(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show Upload Section
  const handleShowUpload = () => {
    setShowUploadSection(true);
    setShowEditForm(false);
    setData([]);
  };

  // Show Edit Form
  const handleShowEditForm = () => {
    setShowEditForm(true);
    setShowUploadSection(false);
    setData([]);
    setResponseMessage("");
  };

  // Submit Edit Form
  const handleSubmit = async () => {
    try {
      const userId = 1; // Placeholder UserID
      const response = await axios.post("http://localhost:5000/update-goals", {
        UserID: userId,
        GoalName: savingGoal,
        TargetAmount: savingAmount,
        Deadline: deadline,
      });
      setResponseMessage(response.data.message || "Savings goal updated successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseMessage("Failed to update goal. Please try again.");
    }
  };

  const calculateProgress = (balance, targetAmount) => {
    if (!targetAmount || targetAmount <= 0) return 0;
    return Math.min(100, ((balance / targetAmount) * 100).toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-gray-800 flex flex-col">
      {/* Top Navigation */}
      <div className="flex justify-between items-center px-12 py-4">
        <img src="jhu.png" alt="Website Logo" className="h-24 w-24" />
        <h1 className="text-5xl font-bold text-blue-700 drop-shadow-lg">
          Personal Finance Tracker
        </h1>
        <div className="flex flex-col items-center">
          <img
            src="icon.png"
            alt="User Icon"
            className="h-20 w-20 rounded-full border-2 border-gray-300"
          />
          <span className="text-lg font-semibold text-gray-700 mt-1">User1</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center mt-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={fetchFinancialAnalysis}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Personal Finance Analysis
          </button>
          <button
            onClick={handleShowEditForm}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Edit Personal Information
          </button>
          <button
            onClick={handleShowUpload}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Upload Your Finance Report
          </button>
        </div>
      </div>

      {/* Edit Personal Information Form */}
      {showEditForm && (
        <div className="bg-white p-8 rounded-lg shadow-md w-96 mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
            Edit Savings Goals
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Saving Goal Name"
              value={savingGoal}
              onChange={e => setSavingGoal(e.target.value)}
              className="p-3 border rounded-md"
            />
            <input
              type="number"
              placeholder="Saving Amount"
              value={savingAmount}
              onChange={e => setSavingAmount(e.target.value)}
              className="p-3 border rounded-md"
            />
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="p-3 border rounded-md"
            />
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold transition-all duration-300"
            >
              Submit
            </button>
            {responseMessage && (
              <p className="text-center text-blue-600 font-semibold mt-2">
                {responseMessage}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Upload Section */}
      {showUploadSection && (
        <div className="flex justify-center items-center mt-8">
          <button className="bg-white text-blue-600 font-semibold text-2xl py-8 px-16 rounded-xl shadow-lg border-2 border-blue-300 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            Upload
          </button>
        </div>
      )}

      {/* Financial Analysis Table */}
      {loading && <p className="text-center text-blue-600 mt-4">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      {data.length > 0 && (
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

          {/* Progress Bars */}
          <div className="mt-8">
            {data.map((row, index) => {
              const progress = calculateProgress(row.Balance, row.TargetAmount);
              return row.GoalName && row.TargetAmount ? (
                <div key={index} className="mb-6">
                  <p className="text-lg font-semibold text-blue-700 mb-2 text-center">
                    Goal: {row.GoalName} (${row.TargetAmount})
                  </p>
                  <div className="w-3/4 bg-gray-200 rounded-full h-6 mx-auto">
                    <div
                      className="h-6 rounded-full bg-green-500 text-xs text-white flex items-center justify-center"
                      style={{ width: `${progress}%` }}
                    >
                      {progress}%
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
