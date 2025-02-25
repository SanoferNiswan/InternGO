import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full fixed inset-0 bg-gray-100 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      <div className="text-blue-900 font-bold text-xl mt-4">Loading...</div>
    </div>
  );
};

export default Loader;
