import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import InternDashboard from "./InternDashboard";
import MentorDashboard from "./MentorDashboard";
import { decodeToken } from "../../utils/auth";

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth); 
  const {role} = decodeToken(token);  

  return ( 
    <div>
      {role === "Admins" ? <AdminDashboard /> : role === "Interns" ? <InternDashboard /> : role==="Mentors"?
       <MentorDashboard />: <p className="text-red-500 text-lg font-semibold">Unauthorized Access</p>}
    </div>
  );
};

export default Dashboard;


