import React from "react";
const AddImagesForm = ({ imagesVarHandler }) => {
  return (
    <div>
      <div>
        <span className="form-label">Fotografii</span>
      </div>

      <input
        type="file"
        name="images"
        id="images"
        accept="image/*"
        multiple
        onChange={(e) => {
          imagesVarHandler.current = e.target.files;
        }}
      />
    </div>
  );
};

export default AddImagesForm;
