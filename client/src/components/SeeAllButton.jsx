import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LongArrow } from "../assets/icons/arrow-long.svg";
const SeeAllButton = ({ title, to }) => {
  return (
    <Link className="btn btn-primary mt-5 py-3 px-4" to={to}>
      <div>
        <span className="mr-3">{title || "Vezi toate"}</span>
        <LongArrow />
      </div>
    </Link>
  );
};

export default SeeAllButton;
