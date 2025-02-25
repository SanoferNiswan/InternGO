import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../../api/axios";
import Loader from "../../Loader";
import { decodeToken } from "../../../utils/auth";

const PendingTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [helpRequests, setHelpRequests] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const {userId} = decodeToken(token);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/helpdesk/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        setHelpRequests(response.data.data);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleResolved = async (id) => {
    const updatedRequests = helpRequests.map((request) =>
      request.id === id
        ? {
            ...request,
            resolvedStatus:
              request.resolvedStatus === "PENDING" ? "RESOLVED" : "PENDING",
          }
        : request
    );
    setHelpRequests(updatedRequests);

    try {
      await axios.patch(
        `/api/helpdesk/${id}`,
        {
          resolvedStatus: updatedRequests.find((req) => req.id === id)
            ?.resolvedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      setHelpRequests(helpRequests);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-lg font-semibold text-blue-600 mb-4 text-center">
        Help Requests
      </h1>

      {error && (
        <div className="text-red-500 text-center text-sm">
          Failed to load data.
        </div>
      )}

      {helpRequests.length > 0 ? (
        <div className="space-y-4 mt-4 p-4 flex flex-col items-center">
          {helpRequests.map((request) => (
            <div
              key={request.id}
              className="w-full bg-white shadow-md rounded-lg p-3 border-l-4 border-blue-500 flex justify-between items-start text-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-400"
            >
              <div className="flex-1 flex-col">
                <h2 className="text-md font-medium">{request.subject}</h2>
                <p className="text-gray-600 text-sm mt-2 mr-4">
                  {request.description}
                </p>
                <p className="text-blue-600 text-sm mt-2 mr-4">
                  <strong>raised by :</strong> {request.senderName}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div
                  className={`relative w-12 h-6 transition-all rounded-full cursor-pointer ${
                    request.resolvedStatus === "RESOLVED"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  onClick={() => toggleResolved(request.id)}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      request.resolvedStatus === "RESOLVED"
                        ? "translate-x-6"
                        : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <span
                  className={`text-xs font-medium mt-1 ${
                    request.resolvedStatus === "RESOLVED"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {request.resolvedStatus}
                </span>
                <p className="text-gray-500 text-xs mt-2">
                  <strong>Priority:</strong> {request.priority}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div class="flex items-center justify-center h-96 bg-gray-100 text-gray-500 text-lg font-semibold rounded-lg shadow-md">
          No requests found
        </div>
      )}
    </div>
  );
};

export default PendingTickets;
