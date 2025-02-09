import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import InternDashboard from "./InternDashboard";

const Dashboard = () => {
  const { role } = useSelector((state) => state.auth); 

  return (
    <div className="p-6">
      {role === "Admins" ? <AdminDashboard /> : role === "Interns" ? <InternDashboard /> : role==="Mentors"?
       <InternDashboard />: <p className="text-red-500 text-lg font-semibold">Unauthorized Access</p>}
    </div>
  );
};

export default Dashboard;


