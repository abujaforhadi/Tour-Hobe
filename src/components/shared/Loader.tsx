import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative flex items-center justify-center">
        
      
        <div className="w-28 h-28 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>

  
        <span className="absolute text-3xl font-bold text-primary">
          TP
        </span>
      </div>
    </div>
  );
};

export default Loader;
