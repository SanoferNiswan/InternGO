import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';
import { FaRegEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import EditProfileModal from './EditProfileModal';  
import AddAssetModal from '../admin/AddAssetModal';

const Profile = ({ userId, token }) => {
  const { role, userId: id } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('Basic_Info');
  const [isProfilePhotoModalOpen, setIsProfilePhotoModalOpen] = useState(false); 
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);  
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);  
  const [error, setError] = useState(null);

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
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('You are restricted from accessing this page.');
      } else {
        setError('Error fetching profile data');
      }
    }
  };

  const handleEdit = async (assetId, newDate) => {
    if (newDate) {
      try {
        const response = await axios.patch(
          `/api/users/update/asset/${assetId}`,
          { returnedOn: newDate },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 201) {
          alert("Returned On date updated successfully!");
          updateReturnedOn(assetId, newDate); 
        } else {
          alert("Failed to update the Returned On date.");
        }
      } catch (error) {
        console.error("Error updating asset:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };
  

  const toggleEdit = (assetId, isEditing) => {
    setProfileData((prev) => ({
      ...prev,
      assets: prev.assets.map((asset) =>
        asset.id === assetId ? { ...asset, editing: isEditing } : asset
      ),
    }));
  };
  
  const updateReturnedOn = (assetId, newDate) => {
    setProfileData((prev) => ({
      ...prev,
      assets: prev.assets.map((asset) =>
        asset.id === assetId ? { ...asset, returnedOn: newDate, editing: false } : asset
      ),
    }));
  };
    

  const renderTabContent = () => {
    if (error) return <p className="text-red-600 text-center">{error}</p>;
    if (!profileData) return <p>Loading...</p>;

    const renderField = (title, value) => (
      <div className="mb-4">
        <span className="font-bold text-gray-600 text-sm inline-block w-36">{title}:</span>
        <span className="text-lg">{value || '---'}</span>
      </div>
    );

    switch (activeTab) {
      case 'Basic_Info':
        return (
          <div className='flex flex-row'>
            <div className='mt-2'> 
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              {renderField('DOB', new Date(profileData.dateOfBirth)?.toLocaleDateString() || '---')}
              {renderField('Personal mail',profileData.personalEmail)}
              {renderField('Gender', profileData.gender)}
              {renderField('Blood Group', profileData.bloodGroup)}
              {renderField('Phone', profileData.phone_no)}
              {renderField('Current Address', profileData.currentAddress)}
              {renderField('Permanent Address', profileData.permanentAddress)}
            </div>

            <div className='ml-14 mt-1'>
              <div className='flex'>
                <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
                {role === 'Admins' && id !== userId && (
                  <button
                  className="py-0 px-4 h-6 mt-1 ml-6 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
                  onClick={() => setIsEditProfileModalOpen(true)}
                >
                  Edit 
                </button>
                )}
              </div>
              {renderField('Emp ID', profileData.employeeId)}
              {renderField('Email', profileData.email)}
              {renderField('Designation', profileData.designation)}
              {renderField('Batch', profileData.batch)}
              {renderField('Year', profileData.year)}
              {renderField('Phase', profileData.phase)}
              {renderField('Joining Date', new Date(profileData.dateOfJoining)?.toLocaleDateString())}
              {renderField('Status', profileData.status)}
            </div>
          </div>
        );
      case 'education':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            {renderField('College', profileData.education?.college)}
            {renderField('Degree', profileData.education?.degree)}
            {renderField('Batch', profileData.education?.batch)}
          </div>
        );
      case 'bankDetails':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
            {renderField('Bank', profileData.bankDetails?.bankName)}
            {renderField('Branch', profileData.bankDetails?.branch)}
            {renderField('IFSC', profileData.bankDetails?.IFSC)}
            {renderField('Account No', profileData.bankDetails?.accountNumber)}
          </div>
        );
      case 'skill':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
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
                : '---'}
            </div>
          </div>
        );
        case 'assets':
          return (
            <div className='flex flex-col'>
              <h2 className="text-xl font-semibold mb-4">Assets</h2>
              {profileData.assets?.length ? (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Asset ID</th>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Asset Type</th>
                      <th className="border border-gray-300 px-4 py-2">Provided On</th>
                      <th className="border border-gray-300 px-4 py-2">Returned On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileData.assets.map((asset) => (
                      <tr key={asset.id}>
                        <td className="border border-gray-300 px-4 py-2">{asset.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{asset.assetName}</td>
                        <td className="border border-gray-300 px-4 py-2">{asset.assetType}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(asset.givenOn).toISOString().split('T')[0]}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 flex items-center space-x-2">
                          {asset.editing ? (
                            <>
                              <input
                                type="date"
                                defaultValue={new Date(asset.returnedOn || new Date()).toISOString().split('T')[0]}
                                className="border border-gray-300 rounded px-2 py-1"
                                onChange={(e) => (asset.newReturnedOn = e.target.value)}
                              />
                              <button
                                className="text-blue-500"
                                onClick={() =>
                                  handleEdit(asset.id, asset.newReturnedOn).then(() =>
                                    updateReturnedOn(asset.id, asset.newReturnedOn)
                                  )
                                }
                              >
                                Save
                              </button>
                              <button
                                className="text-red-500"
                                onClick={() => toggleEdit(asset.id, false)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              {asset.returnedOn
                                ? new Date(asset.returnedOn).toISOString().split('T')[0]
                                : 'Not Returned'}
                              {role === 'Admins' && userId !== id && (
                                <button
                                  className="text-gray-500 hover:text-blue-500"
                                  onClick={() => toggleEdit(asset.id, true)}
                                >
                                  ✏️
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                '---'
              )}
              {role === 'Admins' && userId !== id && (
                <button
                  className="mt-3 ml-64 w-1/5 items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  onClick={()=>setIsAssetModalOpen(true)}
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

  return (
    <div className="flex h-screen bg-gray-50">
        {profileData && (
        <div className="w-1/5 bg-white shadow-lg p-4">
          <div className="flex flex-col items-center">
            <img
              src={profileData.profilePhoto || 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4 cursor-pointer"
              onClick={() => setIsProfilePhotoModalOpen(true)}
            />
            <h1 className="text-lg font-bold">{profileData.name}</h1>
            <p className="text-sm text-gray-500">{profileData.designation}</p>
            <div className="w-full bg-gray-200 rounded-full mt-4">
              <div
                className="bg-green-500 text-xs font-medium text-black text-center p-0.5 leading-none rounded-full"
                style={{ width: `${profileData.profilePercentage || 0}%` }}
              >
                {profileData.profilePercentage || 0}%
              </div>
            </div>
            <div className="mt-4 w-full text-left">
              <h2 className="text-md font-semibold mb-2">Contact</h2>
              <div className="flex items-center gap-2 mb-1">
                <FaPhone className="text-gray-500" />
                <span>{profileData.phone_no || '---'}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <FaRegEnvelope className="text-gray-500" />
                <span>{profileData.email || '---'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" />
                <span>{profileData.permanentAddress || '---'}</span>
              </div>
              <div className='mt-5'>
              <span className="font-semibold mb-4">Skills</span>
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
                : '---'}
            </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex space-x-4 mb-10">
          {['Basic_Info', 'education', 'bankDetails', 'skill', 'assets'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {renderTabContent()}
      </div>

      {isProfilePhotoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Profile Photo</h2>
            <div className="flex justify-center">
              <img
                src={profileData.profilePhoto} 
                alt="Profile"
                className="rounded-lg max-h-[300px] max-w-[300px] object-cover"
              />
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
              onClick={() => setIsProfilePhotoModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && ( 
        <EditProfileModal
          profileData={profileData}
          setIsEditProfileModalOpen = {setIsEditProfileModalOpen}
          userId={userId}
          token={token}
          onClose={() => setIsEditProfileModalOpen(false)}
        />
      )}

      {
        isAssetModalOpen &&
        <AddAssetModal 
        isAssetModalOpen={isAssetModalOpen} 
        setIsAssetModalOpen={setIsAssetModalOpen} 
        userId={userId}  
      />
      }
    </div>
  );
};

export default Profile;
