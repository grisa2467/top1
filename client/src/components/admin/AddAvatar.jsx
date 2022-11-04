import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ReactComponent as AddIcon } from "../../assets/icons/avatar-placeholder.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as TrashIcon } from "../../assets/icons/trash-can.svg";
const AddAvatar = ({ setAvatar, defaultAvatar, disableButtons }) => {
  const [avatar, setLocalAvatar] = useState(null);

  useEffect(() => {
    console.log("def");
    console.log(defaultAvatar);
    if (defaultAvatar) {
      setLocalAvatar(defaultAvatar);
    }
  }, [defaultAvatar]);
  return (
    <>
      <div className=" overflow-hidden" style={{ borderRadius: 5 }}>
        {avatar ? (
          <img
            src={avatar}
            alt=""
            style={{
              height: 150,
              width: 150,
              objectFit: "cover",
            }}
          />
        ) : (
          <AddIcon width="150" height="150" />
        )}
      </div>
      {!disableButtons && (
        <div className="d-flex mt-auto">
          <label htmlFor="addImage" className="btn btn-warning flex-grow-1">
            <EditIcon height={20} />
          </label>
          <input
            type="file"
            className="d-none"
            accept="image/*"
            id="addImage"
            onChange={(e) => {
              const img = e.target.files[0];
              if (img) {
                setLocalAvatar(URL.createObjectURL(img));
                setAvatar(img);
              }
            }}
          />
          {avatar && (
            <button
              className="btn btn-danger ml-3 flex-grow-1"
              onClick={() => {
                setLocalAvatar(null);
                setAvatar(null);
              }}
            >
              <TrashIcon height={20} width={20} />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default AddAvatar;
