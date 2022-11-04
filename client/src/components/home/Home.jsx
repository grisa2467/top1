import React, { useEffect } from "react";
import About from "../About";
import OurPartnersSection from "../OurPartnersSection";
import ReviewSection from "../ReviewSection";
import HomePageCategories from "./homepage_categories";
import OffersSection from "./offers";
// import BlogSection from "./blog";
const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <div className="mt-3">
        <HomePageCategories />
      </div>
      <div className="mt-5">
        <OffersSection />
      </div>
      <div className="mt-5">
        <OurPartnersSection />
      </div>
      <div className="mt-5">
        <About />
      </div>
      {/* <div className="mt-5">
        <ReviewSection />
      </div> */}
      {/* <div className="my-5">
        <BlogSection />
      </div> */}
    </div>
  );
};

export default Home;
