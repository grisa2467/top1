import React, { useState } from "react";
import GoogleMap from "./GoogleMap";
const AddLocation = ({ handleClickMapCoords, initState }) => {
  const [addingLocation, setAddingLocation] = useState(
    handleClickMapCoords
  );
  return (
    <>
      {addingLocation ? (
        <button
          className="btn btn-danger mb-3"
          onClick={(e) => {
            e.preventDefault();

            setAddingLocation(false);

            handleClickMapCoords = initState || null;
          }}
        >
          Revoca
        </button>
      ) : (
        <button
          className="btn btn-primary rent-color"
          onClick={(e) => {
            e.preventDefault();
            setAddingLocation(true);
          }}
        >
          Adauga locatie pe harta
        </button>
      )}

      {addingLocation && <GoogleMap handleClickMapCoords={handleClickMapCoords} />}
    </>
  );
};

export default AddLocation;
