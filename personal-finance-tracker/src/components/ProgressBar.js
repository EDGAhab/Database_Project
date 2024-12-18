const ProgressBar = ({ goal, balance, target }) => {
    const progress = Math.min(100, ((balance / target) * 100).toFixed(2));
  
    return (
      <div className="mb-6">
        <p className="text-lg font-semibold text-blue-700 mb-2 text-center">
          Goal: {goal} (${target})
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
    );
  };
  
  export default ProgressBar;
  