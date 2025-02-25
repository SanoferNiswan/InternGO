import React from "react";
import { useSelector } from "react-redux";
import InteractionSchedule from "../../components/admin/interaction/InteractionSchedule";
import UserInteraction from "../../components/users/interaction/UserInteraction";
import MentorInteraction from "../../components/mentor/MentorInteraction";
import { decodeToken } from "../../utils/auth";
 
const Interaction = () => {
  const { token } = useSelector((state) => state.auth);
  const { permissions, role } = decodeToken(token);

  return (
    <div className="bg-white shadow-md rounded-lg min-h-screen w-full">
      {permissions.includes("interactions.schedule") && <InteractionSchedule />}
      {permissions.includes("feedback.create") && <MentorInteraction />}
      {role === "Interns" && <UserInteraction />}
    </div>
  );
};
 
export default Interaction; 
