import React from "react";
const Loader = ({ style }) => {
  return (
    <div className="is-loading" style={style}>
      <div className="loader-bg">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Loader;
