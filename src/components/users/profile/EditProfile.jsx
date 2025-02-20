import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../redux/slices/authSlice";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../../FloatingInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const { userId, token, name, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    personalEmail: "",
    phone_no: "",
    gender: "",
    bloodGroup: "",
    dateOfBirth: "",
    currentAddress: "",
    permanentAddress: "",
    education: {
      college: "",
      degree: "",
      batch: "",
    },
    bankDetails: {
      bankName: "",
      branch: "",
      IFSC: "",
      accountNumber: "",
    },
    skills: [],
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.data;

        setFormData((prev) => ({
          ...prev,
          personalEmail: userData.personalEmail || "",
          phone_no: userData.phone_no || "",
          gender: userData.gender || "",
          bloodGroup: userData.bloodGroup || "",
          dateOfBirth: userData.dateOfBirth?.split("T")[0] || "",
          currentAddress: userData.currentAddress || "",
          permanentAddress: userData.permanentAddress || "",
          education: {
            college: userData.education?.college || "",
            degree: userData.education?.degree || "",
            batch: userData.education?.batch || "",
          },
          bankDetails: {
            bankName: userData.bankDetails?.bankName || "",
            branch: userData.bankDetails?.branch || "",
            IFSC: userData.bankDetails?.IFSC || "",
            accountNumber: userData.bankDetails?.accountNumber || "",
          },
          skills: userData.skills || [],
        }));

        if (userData.profilePhoto) {
          setProfilePhoto(userData.profilePhoto);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProfilePhoto(reader.result);
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "skills") {
      setFormData((prev) => ({
        ...prev,
        skills: value,
      }));
    } else if (name.includes("education") || name.includes("bankDetails")) {
      const [parentKey, childKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6789]\d{9}$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const inputRegex = /^[A-Za-z.-\s]{3,}$/;
    const branchRegex = /^[A-Za-z\s-]{3,}$/;
    const accountNumberRegex = /^[0-9]{6,18}$/;

    if (formData.bankDetails.accountNumber) {
      if (!accountNumberRegex.test(formData.bankDetails.accountNumber)) {
        toast.error("Enter a valid account number (6-18 digits).");
        return;
      }
    }

    if (formData.personalEmail && !emailRegex.test(formData.personalEmail)) {
      toast.error("Invalid email address");
      return false;
    }

    if (formData.phone_no && !phoneRegex.test(formData.phone_no)) {
      toast.error("Invalid phone number");
      return false;
    }

    if (
      formData.bankDetails.IFSC &&
      !ifscRegex.test(formData.bankDetails.IFSC)
    ) {
      toast.error("Invalid IFSC code");
      return false;
    }

    if (
      formData.bankDetails.bankName &&
      !inputRegex.test(formData.bankDetails.bankName)
    ) {
      toast.error("Invalid Bank Name (Only letters and spaces, min 3 chars)");
      return false;
    }

    if (
      formData.bankDetails.branch &&
      !branchRegex.test(formData.bankDetails.branch)
    ) {
      toast.error("Invalid Branch Name (Min 3 chars, letters only allowed)");
      return false;
    }

    if (
      formData.education.college &&
      !inputRegex.test(formData.education.college)
    ) {
      toast.error("College should contains alphabets only");
      return false;
    }

    if (
      formData.education.degree &&
      !inputRegex.test(formData.education.degree)
    ) {
      toast.error("Degree should contains alphabets only");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "object" && !Array.isArray(formData[key])) {
        Object.keys(formData[key]).forEach((subKey) => {
          if (formData[key][subKey]) {
            updatedData[key] = {
              ...updatedData[key],
              [subKey]: formData[key][subKey],
            };
          }
        });
      } else if (key === "skills") {
        updatedData[key] =
          typeof formData.skills === "string"
            ? formData.skills.split(",").map((skill) => skill.trim())
            : formData.skills;
      } else if (formData[key]) {
        updatedData[key] = formData[key];
      }
    });

    if (newProfilePhoto) {
      updatedData.profilePhoto = newProfilePhoto;
    }

    try {
      const response = await axios.patch(
        `/api/users/update/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setAuth({ profilePhoto: response.data.data.data.profilePhoto }));
      toast.success("Profile updated successfully");
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold ml-2 text-blue-600">
            {name} Profile
          </h1>
          <div className="relative">
            <label
              htmlFor="profilePhoto"
              className="relative cursor-pointer group"
            >
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300 shadow-md group-hover:shadow-lg">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Upload</span>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-bold mb-2">Personal Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput
              id="personalEmail"
              label="Personal Email"
              name="personalEmail"
              value={formData.personalEmail}
              onChange={handleChange}
            />
            <FloatingInput
              id="phone_no"
              label="Phone Number"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
            />
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="" disabled>
                  Select Blood Group
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <FloatingInput
              id="dateOfBirth"
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            <FloatingInput
              id="currentAddress"
              label="Current Address"
              name="currentAddress"
              value={formData.currentAddress}
              onChange={handleChange}
            />
            <FloatingInput
              id="permanentAddress"
              label="Permanent Address"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-bold mb-2">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput
              id="college"
              label="College"
              name="education.college"
              value={formData.education.college}
              onChange={handleChange}
            />
            <FloatingInput
              id="degree"
              label="Degree"
              name="education.degree"
              value={formData.education.degree}
              onChange={handleChange}
            />
            <FloatingInput
              id="batch"
              label="Education Batch"
              placeholder="eg:2021-2025"
              name="education.batch"
              value={formData.education.batch}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Bank Details Section */}
        {role == "Interns" && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-bold mb-2">Bank Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingInput
                id="bankName"
                label="Bank Name"
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
              />
              <FloatingInput
                id="branch"
                label="Branch"
                name="bankDetails.branch"
                value={formData.bankDetails.branch}
                onChange={handleChange}
              />
              <FloatingInput
                id="IFSC"
                label="IFSC Code"
                name="bankDetails.IFSC"
                value={formData.bankDetails.IFSC}
                onChange={handleChange}
              />
              <FloatingInput
                id="accountNumber"
                label="Account Number"
                name="bankDetails.accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Skills Section */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-bold mb-2">Skills (comma separated)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput
              name="skills"
              label="skills"
              value={
                Array.isArray(formData.skills)
                  ? formData.skills.join(", ")
                  : formData.skills
              }
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
