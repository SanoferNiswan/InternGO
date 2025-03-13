import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

const DownloadModal = ({ onClose, years, batches }) => {
  const { token } = useSelector((state) => state.auth);
  const [year, setYear] = useState("2025");
  const [batch, setBatch] = useState("Batch 1");

  const downloadReport = async () => {
    if (!year || !batch) {
      toast.error("Please select both Year and Batch.");
      return;
    }   

    const today = new Date().toISOString().split("T")[0];

    try {
      const response = await axios.get("/api/feedbacks/download", {
        params: { token, year, batch },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${batch} - ${year} AnalyticsReport ${today}.xlsx`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Downloaded successfully");
    } catch (error) {
        console.log(error.response);
      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-50">
        <h2 className="text-lg font-semibold mb-4 text-center">Download Report</h2>

        <label className="block mb-2">Select Year:</label>
        <select
          className="w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none border border-blue-500 rounded-lg mb-4"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {years.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>

        <label className="block mb-2">Select Batch:</label>
        <select
          className="w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none border border-blue-500  rounded-lg mb-4"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="">Select Batch</option>
          {batches.map((bt) => (
            <option key={bt} value={bt}>
              {bt}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={downloadReport}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
