const NavigationBar = () => (
    <div className="flex justify-between items-center px-12 py-4">
      <img src="jhu.png" alt="Website Logo" className="h-24 w-24" />
      <h1 className="text-5xl font-bold text-blue-700 drop-shadow-lg">Personal Finance Tracker</h1>
      <div className="flex flex-col items-center">
        <img
          src="icon.png"
          alt="User Icon"
          className="h-20 w-20 rounded-full border-2 border-gray-300"
        />
        <span className="text-lg font-semibold text-gray-700 mt-1">User1</span>
      </div>
    </div>
  );
  
  export default NavigationBar;
  