import React, { useEffect } from "react";
import BlogCard from "../BlogCard";

const BlogPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container">
      <div className="text-center">
        <h2 className="text-primary font-weight-bold underline pt-4">Blog</h2>
        <p className="mt-3">Ultimele noutăți imobiliare</p>
      </div>

      <div className="row g-4 my-5">
        <div className="col-lg-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-lg-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-lg-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-lg-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-lg-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-lg-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-lg-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-lg-4 col-md-6">
          <BlogCard />
        </div>
        <div className="col-lg-4 col-md-6">
          <BlogCard />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
