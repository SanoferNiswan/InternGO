import React, { useState } from "react";
import axios from "../../../api/axios";

const EditProfileModal = ({
  profileData,
  setIsEditProfileModalOpen,
  userId,
  token,
}) => {
  const [formData, setFormData] = useState({
    employeeId: profileData.employeeId,
    batch: profileData.batch,
    year: profileData.year,
    phase: profileData.phase,
    dateOfJoining: new Date(profileData.dateOfJoining)
      .toISOString()
      .split("T")[0],
    status: profileData.status,
    designation: profileData.designation,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name == "year" ? Number(value) : value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.patch(
        `/api/users/update/${userId}`,
        {
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully");
      setIsEditProfileModalOpen(false);
      const handleSaveChanges = async () => {
        try {
          await axios.patch(
            `/api/users/update/${userId}`,
            {
              ...formData,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          alert("Profile updated successfully");
          setIsEditProfileModalOpen(false);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      };
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-4 relative w-1/2 h-3/4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => setIsEditProfileModalOpen(false)}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        {/* Input Fields */}

        <div className="mb-4">
          <label className="block mb-2">Employee Id</label>
          <input
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Designation</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="testing">Testing</option>
            <option value="devops">DevOps</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value={2026}>Select Year</option>
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Batch</label>
          <select
            name="batch"
            value={formData.batch}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Batch</option>
            <option value="Batch 1">Batch 1</option>
            <option value="Batch 2">Batch 2</option>
            <option value="Batch 3">Batch 3</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Phase</label>
          <select
            name="phase"
            value={formData.phase}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Phase</option>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
            <option value="Phase 3">Phase 3</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="NOT_ACTIVE">NOT ACTIVE</option>
            <option value="EXAMINATION">EXAMINATION</option>
            <option value="LEAVE">LEAVE</option>
            <option value="SHADOWING">SHADOWING</option>
            <option value="DEPLOYED">DEPLOYED</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Date of Joining</label>
          <input
            name="dateOfJoining"
            type="date"
            defaultValue={
              new Date(formData.dateOfJoining || new Date())
                .toISOString()
                .split("T")[0]
            }
            className="border border-gray-300 rounded px-2 py-1"
            onChange={handleInputChange}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsEditProfileModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
