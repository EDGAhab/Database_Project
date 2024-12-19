import React, { useState } from "react";

const EditForm = () => {
  const [savingGoal, setSavingGoal] = useState("");
  const [savingAmount, setSavingAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/update-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: 1,//
          GoalName: savingGoal,
          TargetAmount: savingAmount,
          Deadline: deadline,
        }),
      });
      const result = await response.json();
      setResponseMessage(result.message || "Savings goal updated successfully!");
    } catch (error) {
      setResponseMessage("Failed to update goal. Please try again.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96 mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Savings Goals</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Saving Goal Name"
          value={savingGoal}
          onChange={(e) => setSavingGoal(e.target.value)}
          className="p-3 border rounded-md"
        />
        <input
          type="number"
          placeholder="Saving Amount"
          value={savingAmount}
          onChange={(e) => setSavingAmount(e.target.value)}
          className="p-3 border rounded-md"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="p-3 border rounded-md"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold transition-all duration-300"
        >
          Submit
        </button>
        {responseMessage && (
          <p className="text-center text-blue-600 font-semibold mt-2">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

export default EditForm;
