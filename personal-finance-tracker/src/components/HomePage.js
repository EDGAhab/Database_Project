import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import ButtonsGroup from "./ButtonsGroup";
import EditForm from "./EditForm";
import UploadSection from "./UploadSection";
import AnalysisTable from "./AnalysisTable";
import NaturalLanguageSearch from "./NaturalLanguageSearch";

const HomePage = () => {
  const [activeSection, setActiveSection] = useState(null); // Keeps track of the active section
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFinancialAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/financial-analysis/1");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-gray-800 flex flex-col">
      <NavigationBar />
      <ButtonsGroup setActiveSection={setActiveSection} />
      {activeSection === "analysis" && (
        <AnalysisTable
          fetchFinancialAnalysis={fetchFinancialAnalysis}
          data={data}
          loading={loading}
          error={error}
        />
      )}
      {activeSection === "editForm" && <EditForm />}
      {activeSection === "search" && <NaturalLanguageSearch />}
    </div>
  );
};

export default HomePage;
