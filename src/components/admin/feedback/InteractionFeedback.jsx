import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Loader from "../../Loader";
import EditFeedbackModal from "../../mentor/feedback/EditFeedbackModal";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

const InteractionFeedback = () => {
  const { interactionId } = useParams();
  const { token, role } = useSelector((state) => state.auth);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(
        `api/feedbacks/interaction/${interactionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedback(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (feedback.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg shadow-md">
        <p className="text-gray-500 text-lg font-semibold">
          🚀 No feedback available!
        </p>
      </div>
    );
  }

  const latestFeedback = feedback[0];
  const {
    interaction,
    intern,
    interviewer,
    avg_rating,
    ratings,
    descriptive_feedback,
  } = latestFeedback;

  const radarData = {
    labels: Object.keys(ratings),
    datasets: [
      {
        label: "Skill Ratings",
        data: Object.values(ratings),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  // Function to generate star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Centered Title */}
        <h1 className="font-bold text-2xl text-blue-600 text-center flex-1">
          {interaction.name} Interaction
        </h1>

        {role === "Mentors" && (
          <div className="flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Edit Feedback
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <EditFeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          feedback={latestFeedback}
          refreshData={fetchFeedback}
        />
      )}

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between">
          <p className="text-gray-700">
            Intern: <strong>{intern.name}</strong>
          </p>
          <p className="text-gray-700">
            Interviewer: <strong>{interviewer.name}</strong>
          </p>
          <p className="text-gray-700">
            Mentor: <strong>{interaction.assignedMentor}</strong>
          </p>
        </div>
      </div>

      {/* Radar Chart and Ratings in Two Columns */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        {/* Left: Radar Chart */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-center text-gray-700 mb-2">
            Skill Ratings
          </h2>
          <div className="w-full h-80">
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    min: 0,
                    max: 5,
                    ticks: {
                      stepSize: 1,
                      font: { size: 14, weight: "600" },
                      color: "#333",
                    },
                    pointLabels: {
                      font: { size: 14, weight: "600" },
                      color: "#333",
                    },
                  },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        {/* Right: Ratings with Stars */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-3">
            Ratings Breakdown
          </h2>
          <div className="space-y-2">
            {Object.entries(ratings).map(([skill, rating]) => (
              <div key={skill} className="flex justify-between items-center bg-gray-50 p-2 rounded-md shadow-sm">
                <span className="text-gray-700 font-medium">{skill}</span>
                <div className="flex text-yellow-500">{renderStars(rating)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Rating */}
      <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold text-gray-700">Overall Rating</h2>
        <div className="flex text-2xl mt-2">{renderStars(avg_rating)}</div>
        <p className="text-gray-500 mt-1">
          ({Number.isInteger(avg_rating) ? avg_rating : avg_rating.toFixed(1)} out of 5)
        </p>
      </div>

      {/* Descriptive Feedback */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Descriptive Feedback</h2>
        <p className="text-gray-600 font-sans">{descriptive_feedback}</p>
      </div>
    </div>
  );
};

export default InteractionFeedback;



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "../../../api/axios";
// import { useSelector } from "react-redux";
// import { Radar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import Loader from "../../Loader";
// import EditFeedbackModal from "../../mentor/feedback/EditFeedbackModal";

// ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

// const InteractionFeedback = () => {
//   const { interactionId } = useParams();
//   const { token, role } = useSelector((state) => state.auth);
//   const [feedback, setFeedback] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchFeedback();
//   }, []);

//   const fetchFeedback = async () => {
//     try {
//       const response = await axios.get(
//         `api/feedbacks/interaction/${interactionId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setFeedback(response.data.data);
//       console.log(response.data.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   if (feedback.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg shadow-md">
//         <p className="text-gray-500 text-lg font-semibold">
//           🚀 No feedback available!
//         </p>
//       </div>
//     );
//   }

//   const latestFeedback = feedback[0];
//   const {
//     interaction,
//     intern,
//     interviewer,
//     avg_rating,
//     ratings,
//     descriptive_feedback,
//   } = latestFeedback;

//   const radarData = {
//     labels: Object.keys(ratings),
//     datasets: [
//       {
//         label: "Skill Ratings",
//         data: Object.values(ratings),
//         borderColor: "rgba(54, 162, 235, 1)",
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//       },
//     ],
//   };

//   // Function to generate star rating
//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       if (i <= rating) {
//         stars.push(<FaStar key={i} className="text-yellow-500" />);
//       } else if (i - 0.5 === rating) {
//         stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
//       } else {
//         stars.push(<FaRegStar key={i} className="text-gray-400" />);
//       }
//     }
//     return stars;
//   };

//   return (
//     <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-full mx-auto">
//       <div className="flex justify-between items-center mb-4">
//         {/* Centered Title */}
//         <h1 className="font-bold text-2xl text-blue-600 text-center flex-1">
//           {interaction.name} Interaction
//         </h1>

//         {role === "Mentors" && (
//           <div className="flex justify-end">
//             <button
//               className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
//               onClick={() => setIsModalOpen(true)}
//             >
//               Edit Feedback
//             </button>
//           </div>
//         )}
//       </div>
//       {isModalOpen && (
//         <EditFeedbackModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           feedback={latestFeedback}
//           refreshData={fetchFeedback}
//         />
//       )}

//       <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//         <div className="flex justify-between">
//           <p className="text-gray-700">
//             Intern: <strong>{intern.name}</strong>
//           </p>
//           <p className="text-gray-700">
//             Interviewer: <strong>{interviewer.name}</strong>
//           </p>
//           <p className="text-gray-700">
//             Mentor: <strong>{interaction.assignedMentor}</strong>
//           </p>
//         </div>
//       </div>

//       {/* Radar Chart for Skill Ratings */}
//       <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-center h-auto">
//         <div className="w-3/4 h-80 p-2 mb-8">
//           <h2 className="text-lg font-semibold text-center text-gray-700 mb-2">
//             Skill Ratings
//           </h2>
//           <Radar
//             data={radarData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               scales: {
//                 r: {
//                   min: 0,
//                   max: 5,
//                   ticks: {
//                     stepSize: 1,
//                     font: { size: 14, weight: "600" },
//                     color: "#333",
//                   },
//                   pointLabels: {
//                     font: { size: 14, weight: "600" },
//                     color: "#333",
//                   },
//                 },
//               },
//               plugins: { legend: { display: false } },
//             }}
//           />
//         </div>
//       </div>

//       <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mb-4">
//         <h2 className="text-lg font-semibold text-gray-700">Overall Rating</h2>
//         <div className="flex text-2xl mt-2">{renderStars(avg_rating)}</div>
//         <p className="text-gray-500 mt-1">
//           ({Number.isInteger(avg_rating) ? avg_rating : avg_rating.toFixed(1)}{" "}
//           out of 5)
//         </p> 
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-semibold text-gray-700 mb-2">
//           Descriptive Feedback
//         </h2>
//         <p className="text-gray-600 font-sans">{descriptive_feedback}</p>
//       </div>
//     </div>
//   );
// };

// export default InteractionFeedback;
