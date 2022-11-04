import React, { useState } from "react";
import { ReactComponent as AddIcon } from "../../assets/icons/add-round-button.svg";

const SetLocation = () => {
  const [withLocation, setWithLocation] = useState(false);

  return (
    <div className="">
      <h4>
        Locatia pe harta
        {!withLocation ? (
          <span
            style={{}}
            className="ml-3 bg-transparent border-0 btn"
            onClick={() => setWithLocation(true)}
          >
            <AddIcon />
          </span>
        ) : (
          <button
            className="btn btn-danger ml-3"
            onClick={() => setWithLocation(false)}
          >
            Anuleaza
          </button>
        )}
      </h4>
      {withLocation && (
        <div className="mt-5">
          <iframe
            title="contact-map"
            width="100%"
            height="600"
            frameBorder="0"
            src="https://map.md/ro"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default SetLocation;
