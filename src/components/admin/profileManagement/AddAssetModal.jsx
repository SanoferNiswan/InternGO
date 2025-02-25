import React, { useState } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddAssetModal = ({
  isAssetModalOpen,
  setIsAssetModalOpen,
  userId,
  refresh,
}) => {
  const { token } = useSelector((state) => state.auth);
  const [assetType, setAssetType] = useState("");
  const [assetName, setAssetName] = useState("");
  const [givenOn, setGivenOn] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "api/users/create/assets",
        {
          userId: userId,
          assetType,
          assetName,
          givenOn,
        }
      );
      toast.success("asset added successfully");
      setIsAssetModalOpen(false);
      refresh();
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  if (!isAssetModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-1/3 p-6 rounded-lg">
        <h2 className="text-xl mb-4">Add New Asset</h2>

        <div className="mb-4">
          <label htmlFor="assetType" className="block mb-2">
            Asset Type
          </label>
          <input
            type="text"
            id="assetType"
            className="w-full p-2 border rounded"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="assetName" className="block mb-2">
            Asset Name
          </label>
          <input
            type="text"
            id="assetName"
            className="w-full p-2 border rounded"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="givenOn" className="block mb-2">
            Given On
          </label>
          <input
            type="date"
            id="givenOn"
            className="w-full p-2 border rounded"
            value={givenOn}
            max={new Date().toISOString().split("T")[0]} 
            onChange={(e) => setGivenOn(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <button
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
            onClick={() => setIsAssetModalOpen(false)} // Close the modal
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;
