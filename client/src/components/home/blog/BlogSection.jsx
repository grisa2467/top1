import React from "react";
import BlogCard from "../../BlogCard";
import SeeAllButton from "../../SeeAllButton";

const BlogSection = () => {
  return (
    <div className="container">
      <div className="text-center">
        <h2 className="text-primary font-weight-bold underline pt-4">Blog</h2>
        <p className="mt-3">Ultimele noutăți imobiliare</p>
      </div>

      <div className="row mt-5 g-4">
        <div className="col-xl-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-xl-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-xl-4 col-md-6">
          <BlogCard />
        </div>
      </div>

      <div className="text-center">
        <SeeAllButton to="/blog" />
      </div>
    </div>
  );
};

export default BlogSection;
