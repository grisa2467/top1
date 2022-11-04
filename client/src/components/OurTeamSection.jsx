import React from "react";
import FlickitySlider from "./FlickitySlider";
import tempMemberImage from "../assets/img/face1.jpg";
import TeamMemberCard from "./TeamMemberCard";
import { useRef } from "react";

const OurTeamSection = () => {
  const flickity = useRef(null);
  const data = [
    <div style={{ width: 380 }} className="p-5">
      <TeamMemberCard
        image={tempMemberImage}
        name="John Doe"
        tel="+373 9999999"
        role="Agent imobiliar"
      />
    </div>,
    <div style={{ width: 380 }} className="p-5">
      <TeamMemberCard
        image={tempMemberImage}
        name="John Doe"
        tel="+373 9999999"
        role="Agent imobiliar"
      />
    </div>,
    <div style={{ width: 380 }} className="p-5">
      <TeamMemberCard
        image={tempMemberImage}
        name="John Doe"
        tel="+373 9999999"
        role="Agent imobiliar"
      />
    </div>,
    <div style={{ width: 380 }} className="p-5">
      <TeamMemberCard
        image={tempMemberImage}
        name="John Doe"
        tel="+373 9999999"
        role="Agent imobiliar"
      />
    </div>,
    <div style={{ width: 380 }} className="p-5">
      <TeamMemberCard
        image={tempMemberImage}
        name="John Doe"
        tel="+373 9999999"
        role="Agent imobiliar"
      />
    </div>,
    <div style={{ width: 380 }} className="p-5">
      <TeamMemberCard
        image={tempMemberImage}
        name="John Doe"
        tel="+373 9999999"
        role="Agent imobiliar"
      />
    </div>,
    <div style={{ width: 380 }} className="p-5">
      <TeamMemberCard
        image={tempMemberImage}
        name="John Doe"
        tel="+373 9999999"
        role="Agent imobiliar"
      />
    </div>,
  ];
  return (
    <div className="container">
      <div className="text-center">
        <h2 className="text-primary underline">Echipa noastra</h2>
        <p className="mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
          deserunt consectetur aliquid? Eius, sequi necessitatibus! Unde,
          ducimus mollitia alias quisquam
        </p>
      </div>

      <FlickitySlider flickity={flickity} data={data} />
    </div>
  );
};

export default OurTeamSection;
