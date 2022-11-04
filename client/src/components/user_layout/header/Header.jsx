import React from "react";
import Breadcrumb from "./Breadcrumb";
import ContactTopBanner from "./ContactTopBanner";
import Navbar from "./Navbar";

const Header = (props) => {
  return (
    <header>
      <ContactTopBanner {...props} />
      <div className="mt-3">
        <Navbar />
      </div>
      <div className="mt-3">
        <Breadcrumb />
      </div>
    </header>
  );
};

export default Header;
