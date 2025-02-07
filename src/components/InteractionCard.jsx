import React from "react";
import { FaEdit, FaCalendar, FaClock, FaHourglassHalf } from "react-icons/fa";
import { useSelector } from "react-redux";

const InteractionCard = ({ interaction }) => {
  const { role } = useSelector((state) => state.auth);
  return (
    <div
      key={interaction.id}
      className="p-4 rounded-lg bg-gray-50 shadow-gray-400 shadow-lg flex flex-col gap-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              interaction.interactionStatus === "PENDING"
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          ></div>
          <span className="font-medium text-lg">{interaction.name}</span>
        </div>

        {role == "Admins" && interaction.interactionStatus === "PENDING" && (
          <label className="flex items-center cursor-pointer text-gray-600">
            <span className="mr-2">schedule (off) </span>
            <input
              type="checkbox"
              className="hidden"
              checked={interaction.isToggled}
              onChange={() => handleToggle(interaction.id)}
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full flex items-center p-1 transition-all">
              <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"></div>
            </div>
          </label>
        )}
      </div>

      <div>
        <table className="w-full p-1">
          <tbody>
            {/* Header Row */}
            <tr className="flex justify-between">
              <td className="flex-1 text-center font-normal text-gray-500">
                Intern
              </td>
              <td className="flex-1 text-center font-normal text-gray-500">
                Mentor
              </td>
              <td className="flex-1 text-center font-normal text-gray-500">
                Interviewer
              </td>
            </tr>
            {/* Data Row */}
            <tr className="flex justify-between">
              <td className="flex-1 text-center">
                {interaction.assignedIntern}
              </td>
              <td className="flex-1 text-center">
                {interaction.assignedMentor}
              </td>
              <td className="flex-1 text-center">
                {interaction.assignedInterviewer}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Date, Time, Duration with Icons */}
      <div className=" text-sm text-gray-600 flex flex-wrap justify-between">
        <div className="flex items-center gap-2">
          <FaCalendar className="text-blue-500" />{" "}
          <span>{interaction.date.split("T")[0]}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-yellow-500" />{" "}
          <span>{interaction.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaHourglassHalf className="text-orange-500" />{" "}
          <span>{interaction.duration}</span>
        </div>
      </div>

      {role == "Admins" && (
        <div className="flex justify-end">
          <button className="text-blue-500 hover:text-blue-600">
            <FaEdit className="text-lg" />
          </button>
        </div>
      )}

      {role == "Mentors" && interaction.interactionStatus=="PENDING" && (
        <div className="flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg text-white">
            Give Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractionCard;
