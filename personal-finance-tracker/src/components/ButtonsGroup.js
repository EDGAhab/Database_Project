const ButtonsGroup = ({ setActiveSection }) => (
    <div className="flex flex-col items-center mt-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button
          onClick={() => setActiveSection("analysis")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Personal Finance Analysis
        </button>
        <button
          onClick={() => setActiveSection("editForm")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Edit Personal Information
        </button>
        <button
          onClick={() => setActiveSection("search")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Natural Language Search
        </button>
      </div>
    </div>
  );
  
  export default ButtonsGroup;
  