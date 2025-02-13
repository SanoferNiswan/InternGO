import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";
import { FaRegEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import EditProfileModal from "../admin/profileManagement/EditProfileModal";
import AddAssetModal from "../admin/profileManagement/AddAssetModal";
import Loader from "../Loader";
import { toast } from "react-toastify";

const Profile = ({ userId, token }) => {
  const { role, userId: id } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState("personal info");
  const [isProfilePhotoModalOpen, setIsProfilePhotoModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && token) {
      fetchProfileData();
    }
  }, [userId, token]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response.data.data);
      setAssets(response.data.data.assets);
      console.log(response.data.data);
      
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError("You are restricted from accessing this page.");
      } else {
        setError("Error fetching profile data");
      }
    } finally {
      setLoading(false);
    }
  };

  const internTab = [
    "personal info",
    "professional info",
    "education",
    "bankDetails",
    "skill",
    "assets",
  ];

  const adminTab = ["personal info", "education"];

  const handleFieldChange = (assetId, field, value) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.id === assetId ? { ...asset, [field]: value } : asset
      )
    );
  };

  const handleUpdate = async (assetId, field, value) => {
    const assetToUpdate = assets.find((asset) => asset.id === assetId);

    if (
      field === "returnedOn" &&
      new Date(value) < new Date(assetToUpdate.givenOn)
    ) {
      toast.error("Returned On date cannot be earlier than Provided On date.");
      return;
    }

    try {
      await axios.patch(
        `/api/users/update/asset/${assetId}`,
        {
          [field]: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.id === assetId ? { ...asset, [field]: value } : asset
        )
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const renderTabContent = () => {
    if (error) return <p className="text-red-600 text-center">{error}</p>;

    const renderField = (title, value) => (
      <div className="flex items-center mb-4 mt-2">
        <span className="font-semibold text-gray-700 text-sm w-40">
          {title}:
        </span>
        <span className="text-base text-gray-900">{value || "—"}</span>
      </div>
    );

    switch (activeTab) {
      case "personal info":
        return (
          <div className="w-full max-w-4xl">
            <h2 className="text-lg font-semibold text-blue-600 mb-4 border-b pb-2">
              Personal Information
            </h2>
            <div className="space-y-3 text-gray-700">
              {renderField(
                "DOB",
                profileData.dateOfBirth
                  ? new Date(profileData.dateOfBirth).toLocaleDateString()
                  : "---"
              )}
              {renderField("Personal mail", profileData.personalEmail)}
              {renderField("Gender", profileData.gender)}
              {renderField("Blood Group", profileData.bloodGroup)}
              {renderField("Phone", profileData.phone_no)}
              {renderField("Current Address", profileData.currentAddress)}
              {renderField("Permanent Address", profileData.permanentAddress)}
            </div>
          </div>
        );

      case "professional info":
        return (
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold text-blue-600">
                Professional Information
              </h2>
              {role === "Admins" && id !== userId && (
                <button
                  className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition"
                  onClick={() => setIsEditProfileModalOpen(true)}
                >
                  Edit
                </button>
              )}
            </div>
            <div className="space-y-3 text-gray-700">
              {renderField("Emp ID", profileData.employeeId)}
              {renderField("Email", profileData.email)}
              {renderField("Designation", profileData.designation)}
              {renderField("Batch", profileData.batch)}
              {renderField("Year", profileData.year)}
              {renderField("Phase", profileData.phase)}
              {renderField(
                "Joining Date",
                profileData.dateOfJoining
                  ? new Date(profileData.dateOfJoining).toLocaleDateString()
                  : "---"
              )}
              {renderField("Status", profileData.status)}
            </div>
          </div>
        );
      case "education":
        return (
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
              Education
            </h2>
            <hr />
            {renderField("College", profileData.education?.college)}
            {renderField("Degree", profileData.education?.degree)}
            {renderField("Batch", profileData.education?.batch)}
          </div>
        );
      case "bankDetails":
        return (
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
              Bank Details
            </h2>
            <hr />
            {renderField("Bank", profileData.bankDetails?.bankName)}
            {renderField("Branch", profileData.bankDetails?.branch)}
            {renderField("IFSC", profileData.bankDetails?.IFSC)}
            {renderField("Account No", profileData.bankDetails?.accountNumber)}
          </div>
        );
      case "skill":
        return (
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.skills?.length
                ? profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))
                : "---"}
            </div>
          </div>
        );
      case "assets":
        return (
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Assets</h2>
            <hr />
            {assets && (
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                    <th className="border border-gray-300 px-4 py-2">
                      Asset ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Asset Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Provided On
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Returned On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="text-gray-900 text-base">
                      <td className="border border-gray-300 px-4 py-2">
                        {asset.id}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={asset.assetName}
                          className="w-full px-3 py-1.5 border rounded text-gray-700"
                          disabled={role !== "Admins"}
                          onChange={(e) =>
                            handleFieldChange(
                              asset.id,
                              "assetName",
                              e.target.value
                            )
                          }
                          onBlur={(e) =>
                            handleUpdate(asset.id, "assetName", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={asset.assetType}
                          className="w-full px-3 py-1.5 border rounded text-gray-700"
                          disabled={role !== "Admins"}
                          onChange={(e) =>
                            handleFieldChange(
                              asset.id,
                              "assetType",
                              e.target.value
                            )
                          }
                          onBlur={(e) =>
                            handleUpdate(asset.id, "assetType", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="date"
                          value={
                            asset.givenOn
                              ? new Date(asset.givenOn)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          className="w-full px-3 py-1.5 border rounded text-gray-700"
                          disabled={role !== "Admins"}
                          onChange={(e) =>
                            handleFieldChange(
                              asset.id,
                              "givenOn",
                              e.target.value
                            )
                          }
                          onBlur={(e) =>
                            handleUpdate(asset.id, "givenOn", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="date"
                          value={
                            asset.returnedOn
                              ? new Date(asset.returnedOn)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          className="w-full px-3 py-1.5 border rounded text-gray-700"
                          disabled={role !== "Admins"}
                          onChange={(e) =>
                            handleFieldChange(
                              asset.id,
                              "returnedOn",
                              e.target.value
                            )
                          }
                          onBlur={(e) =>
                            handleUpdate(asset.id, "returnedOn", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {role === "Admins" && userId !== id && (
              <button
                className="mt-4 ml-auto w-40 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600"
                onClick={() => setIsAssetModalOpen(true)}
              >
                Add Asset
              </button>
            )}
          </div>
        );

      default:
        return <p>Select a tab to view details.</p>;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-white">
      {profileData && (
        <div className="w-full md:w-1/4 h-auto md:h-screen bg-gray-900 text-white shadow-md p-6 rounded-lg">
          <div className="flex flex-col">
            <div className="flex flex-col items-center">
              <img
                src={
                  profileData.profilePhoto ||
                  "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
                }
                onError={(e)=>console.log(e)}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white cursor-pointer bg-white"
                onClick={() => setIsProfilePhotoModalOpen(true)}
              />
              {console.log("photo",profileData.profilePhoto,token)}
              <h1 className="text-lg font-bold">{profileData.name}</h1>
              <p className="text-sm text-gray-200">{profileData.designation}</p>
            </div>

            <div className="w-full bg-white rounded-full mt-4">
              <div
                className="bg-blue-400 text-xs font-medium text-center p-0.5 leading-none rounded-full text-black"
                style={{ width: `${profileData.profilePercentage || 0}%` }}
              >
                {profileData.profilePercentage || 0}%
              </div>
            </div>

            <div className="mt-5 w-full text-left">
              <h2 className="text-md font-semibold mb-2">Contact</h2>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <FaPhone className="text-white opacity-80" />
                  <span>{profileData.phone_no || "---"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaRegEnvelope className="text-white opacity-80" />
                  <span>{profileData.email || "---"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-white opacity-80" />
                  <span className="whitespace-normal">
                    {profileData.permanentAddress || "---"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <span className="font-semibold text-white">Skills</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {profileData.skills?.length
                  ? profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-white text-blue-600 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  : "---"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-gray-50 p-6 flex flex-col h-auto md:h-screen rounded-lg shadow-lg">
        <div className="flex space-x-3 border-b pb-2 overflow-x-auto">
          {((role === "Admins" && userId === id) || role === "Mentors"
            ? adminTab
            : internTab
          ).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setActiveTab(tab);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mt-4">
          {renderTabContent()}
        </div>
      </div>

      {isProfilePhotoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Profile Photo</h2>
            <div className="flex justify-center">
              <img
                src={profileData.profilePhoto}
                alt="Profile"
                className="rounded-lg max-h-[300px] max-w-[300px] object-cover"
              />
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 w-1/2 ml-24 hover:bg-red-600"
              onClick={() => setIsProfilePhotoModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isEditProfileModalOpen && (
        <EditProfileModal
          profileData={profileData}
          setIsEditProfileModalOpen={setIsEditProfileModalOpen}
          userId={userId}
          token={token}
          onClose={() => setIsEditProfileModalOpen(false)}
        />
      )}

      {isAssetModalOpen && (
        <AddAssetModal
          isAssetModalOpen={isAssetModalOpen}
          setIsAssetModalOpen={setIsAssetModalOpen}
          userId={userId}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default Profile;
