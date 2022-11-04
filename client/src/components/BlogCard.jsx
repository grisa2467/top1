import React from "react";
import { Link } from "react-router-dom";
import tempImage from "../assets/img/property.jpg";

const BlogCard = () => {
  return (
    <div className="property-card">
      <div className="overflow-hidden property-card__image">
        <img className="img-fluid w-100" src={tempImage} alt="Properietate" />
      </div>
      <div className="p-3">
        <div>
          <Link className="text-dark" to="/blog/1">
            Lorem ipsum dolor sit
          </Link>
        </div>
        <div className="mt-2">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
            at, eaque a deleniti vitae, in temporibus incidunt repudiandae,
            asperiores voluptatem fuga
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
