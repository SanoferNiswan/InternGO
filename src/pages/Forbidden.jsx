import React from "react";
import { Link } from "react-router-dom";

const Forbidden = () => { 
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-2">Access Forbidden</h2>
      <p className="text-gray-600 mt-2">
        You do not have permission to access this page.
      </p>
      <Link
        to="/dashboard"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Forbidden;
