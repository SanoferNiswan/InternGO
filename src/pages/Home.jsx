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




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaBell, FaChartBar, FaUsers, FaClipboardList, FaLaptopCode, FaPlusSquare } from "react-icons/fa";
// import logo from "../assets/interngo logo.png";

// // Import carousel images
// import img1 from "../assets/c4.jpg";
// import img2 from "../assets/c2.jpg";
// import img3 from "../assets/c3.jpg";

// const Home = () => {
//   const navigate = useNavigate();
//   const images = [img1, img2, img3];
//   const [currentSlide, setCurrentSlide] = useState(0);

//   // Auto-slide every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % images.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Fullscreen Carousel */}
//       <div className="relative w-full h-screen overflow-hidden">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ${
//               index === currentSlide ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
//           </div>
//         ))}

//         {/* Transparent Navbar */}
//         <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-transparent z-10">
//           <img src={logo} alt="InternGO" className="w-40 h-12" />
//           <div className="space-x-4">
//             <button
//               className="bg-transparent text-blue-600 px-4 py-2 border border-blue-600 rounded  hover:text-blue-800"
//               onClick={() => navigate("/signin")}
//             >
//               Sign In
//             </button>
//             <button
//               className="bg-transparent text-blue-600 px-4 py-2 border border-blue-600 rounded  hover:text-blue-800"
//               onClick={() => navigate("/signup")}
//             >
//               Sign Up
//             </button>
//           </div>
//         </nav>

//         {/* Carousel Controls */}
//         <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               className={`w-4 h-4 rounded-full ${
//                 currentSlide === index ? "bg-white" : "bg-gray-400"
//               }`}
//               onClick={() => setCurrentSlide(index)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Main Content After Scrolling */}
//       <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
//         <h2 className="text-4xl font-bold mb-4">Internship Management</h2>
//         <p className="text-lg max-w-2xl">
//           Manage interns, schedule interactions, track assets, and get real-time notifications—all in one platform.
//         </p>
//       </section>

//       <section className="py-20 px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
//         <FeatureCard icon={<FaUsers />} title="Manage Interns" description="Effortlessly assign and track intern progress." />
//         <FeatureCard icon={<FaClipboardList />} title="Schedule Interaction" description="Plan and conduct meetings seamlessly." />
//         <FeatureCard icon={<FaBell />} title="Real-time Notifications" description="Stay updated with instant alerts and reminders." />
//         <FeatureCard icon={<FaChartBar />} title="Feedback Analysis" description="Analyze feedback with charts and downloadable reports." />
//         <FeatureCard icon={<FaLaptopCode />} title="Daily Updates" description="Keep track of interns' daily progress effortlessly." />
//         <FeatureCard icon={<FaPlusSquare />} title="Plans Management" description="Create and assign plans to track interns efficiently." />
//       </section>

//       <section className="text-center py-16 bg-gray-200">
//         <h3 className="text-3xl font-bold mb-4">Get Started with InternGO</h3>
//         <p className="text-lg mb-6">Join now to streamline your internship management.</p>
//         <button
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//           onClick={() => navigate("/signup")}
//         >
//           Sign Up Now
//         </button>
//       </section>
//     </div>
//   );
// };

// const FeatureCard = ({ icon, title, description }) => {
//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
//       <div className="text-blue-600 text-4xl mb-4">{icon}</div>
//       <h4 className="text-xl font-semibold mb-2">{title}</h4>
//       <p className="text-gray-600">{description}</p>
//     </div>
//   );
// };

// export default Home;


