import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import InteractionCard from ".././InteractionCard";

const MentorInteraction = () => {
  const { userId, token,name } = useSelector((state) => state.auth);
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {    
    try {
      const response = await axios.get(`/api/interactions/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInteractions(response.data.data.interactionsTaken);
      console.log(response.data.data.interactionsTaken,"hi");
    } catch (err) {
      console.log(err?.response?.data?.message);
    }
  };
  return (
    <div className="p-2">
      <h1 className="mb-6 text-2xl font-semibold text-center text-blue-500">{name}'s Interaction</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {interactions && interactions.map((interaction) => (
            <InteractionCard key={interaction.id} interaction={interaction} />
        ))}
      </div>
    </div>
  );
};

export default MentorInteraction;

