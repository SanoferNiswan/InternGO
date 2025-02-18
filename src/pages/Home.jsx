import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaChartBar, FaUsers, FaClipboardList, FaLaptopCode, FaPlusSquare } from "react-icons/fa";
import logo from "../assets/Intern (3).png"
import { useSelector } from "react-redux";
const Home = () => {
  const navigate = useNavigate(); 
  const {token} = useSelector((state)=>state.auth);

  useEffect(()=>{
    if(token){
      navigate("/dashboard");
    }
  },[navigate]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center px-4">
        <img src={logo} alt="InternGO" className="w-40 h-12"/>
        <div className="space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
        <h2 className="text-4xl font-bold mb-4">Internship Management</h2>
        <p className="text-lg max-w-2xl">
          Manage interns, schedule interactions, track assets, and get real-time notifications—all in one platform.
        </p>
      </section>

      <section className="py-20 px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        <FeatureCard icon={<FaUsers />} title="Manage Interns" description="Effortlessly assign and track intern progress." />
        <FeatureCard icon={<FaClipboardList />} title="Schedule Interaction" description="Plan and conduct meetings seamlessly." />
        <FeatureCard icon={<FaBell />} title="Real-time Notifications" description="Stay updated with instant alerts and reminders." />
        <FeatureCard icon={<FaChartBar />} title="Feedback Analysis" description="Analyze feedback with charts and downloadable reports." />
        <FeatureCard icon={<FaLaptopCode />} title="Daily Updates" description="Keep track of interns' daily progress effortlessly." />
        <FeatureCard icon={<FaPlusSquare />} title="Plans Management" description="Create and assign plan to Interns to track interns in efficient way" />
      </section>

      <section className="text-center py-16 bg-gray-200">
        <h3 className="text-3xl font-bold mb-4">Get Started with InternGO</h3>
        <p className="text-lg mb-6">Join now to streamline your internship management.</p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/signup")}
        >
          Sign Up Now
        </button>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="text-blue-600 text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}; 

export default Home;