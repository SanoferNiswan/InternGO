import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import InteractionCard from "../../interaction/InteractionCard";
import Loader from "../../Loader";

const UserInteraction = () => {
  const { userId, token,name } = useSelector((state) => state.auth);
  const [interactions, setInteractions] = useState([]);
   const [loading,setLoading] = useState(true);

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
      setInteractions(response.data.data.interactionsAttended);
    } catch (err) {
      console.log(err?.response?.data?.message);
    }finally{
      setLoading(false);
    } 
  };

  if(loading){
    return <Loader />
  }
  
  return (
    <div className="p-2">
      <h1 className="mb-6 text-2xl font-semibold text-center text-blue-500">{name}'s Interaction</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {
          interactions.length===0 && <p className="font-semibold text-gray-600 text-center bg-gray-100 p-3 rounded-md shadow-md h-96 flex justify-center items-center">
          No interactions found
        </p>
        }
        {interactions.map((interaction) => (
            <InteractionCard key={interaction.id} interaction={interaction} />
        ))}
      </div>
    </div>
  );
};

export default UserInteraction;
