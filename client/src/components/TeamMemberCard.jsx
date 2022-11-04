import React from "react";
import CircularImage from "./CircularImage";
const TeamMemberCard = ({ image, name, role, tel }) => {
  return (
    <div className="property-card">
      <div className="d-flex align-items-center flex-column py-4">
        <CircularImage image={image} alt={name} size={150} />
        <div className="font-weight-bold mt-3">{name}</div>
        <div className="mt-3">{role}</div>
        <div className="mt-2 text-primary underline w-30"></div>
        <div className="text-primary font-weight-bold mt-4">{tel}</div>
        <div className="mt-3">Social media here</div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
