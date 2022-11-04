import React from "react";
import CircularImage from "./CircularImage";
import { ReactComponent as QuoteIcon } from "../assets/icons/open-double-quote-left.svg";
const ReviewCard = ({ text, name, image }) => {
  return (
    <div className="bg-white text-dark p-4" style={{ borderRadius: 5 }}>
      <div className="d-flex justify-content-center mt-3">
        <QuoteIcon />
      </div>
      <p className="text-center mt-4">{text}</p>
      <div className="mt-4 d-flex flex-column align-items-center">
        <div className="align-self-stretch d-flex justify-content-center mb-3">
          <div
            style={{ flexBasis: "25%" }}
            className="text-primary underline mb-4"
          ></div>
        </div>
        <CircularImage image={image} alt={name} />
      </div>
      <p className="text-center mt-3" style={{ fontSize: 22 }}>
        {name}
      </p>
    </div>
  );
};

export default ReviewCard;
