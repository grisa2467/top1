import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  infoSelector,
  infoStatusSelector,
  INFO_STATUSES,
  updateUserInfo,
} from "../../features/user/userSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const userInfo = useSelector(infoSelector);
  const infoStatus = useSelector(infoStatusSelector);
  const [givenName, setGivenName] = useState(userInfo.givenName);
  const [familyName, setFamilyName] = useState(userInfo.familyName);
  const [tel, setTel] = useState(userInfo.tel);
  const [e999Token, setE999Token] = useState(userInfo.e999Token);

  const restoreFields = () => {
    setGivenName(userInfo.givenName);
    setFamilyName(userInfo.familyName);
    setTel(userInfo.tel);
    setE999Token(userInfo.e999Token);
  };

  const saveChanges = () => {
    const newData = {};
    if (givenName !== userInfo.givenName) newData.givenName = givenName;
    if (familyName !== userInfo.familyName) newData.familyName = familyName;
    if (tel !== userInfo.tel) newData.tel = tel;
    if (e999Token !== userInfo.e999Token) newData.e999Token = e999Token;
    if (Object.keys(newData).length !== 0) {
      dispatch(updateUserInfo(newData));
    }
  };
  const buttonOptions = isEditing ? (
    <div className="d-flex align-items-stretch">
      <button
        className="btn btn-danger"
        onClick={() => {
          setIsEditing(false);
          restoreFields();
        }}
      >
        &times; Revoca
      </button>
      <button
        className="btn btn-success ml-4"
        onClick={() => {
          setIsEditing(false);
          saveChanges();
        }}
      >
        Salveaza
      </button>
    </div>
  ) : (
    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
      Editeaza
    </button>
  );
  return (
    <div className={infoStatus === INFO_STATUSES.PENDING ? "is-loading" : ""}>
      <div className="loader-bg">
        <div className="loader"></div>
      </div>
      <div className="mt-5 d-flex justify-content-between">
        <h2 className="">Setari</h2>
        {buttonOptions}
      </div>
      <div className="mt-4">
        <div className="row g-4">
          <div className="col-6">
            <label htmlFor="givenName" className="d-block">
              Prenume
            </label>
            <input
              className="form-input form-input-bg w-100 px-3 py-2"
              id="givenName"
              type="text"
              value={givenName}
              disabled={!isEditing}
              onChange={(e) => setGivenName(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="familyName" className="d-block">
              Familia
            </label>
            <input
              className="form-input form-input-bg w-100 px-3 py-2"
              id="familyName"
              type="text"
              value={familyName}
              disabled={!isEditing}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="tel" className="d-block">
              Telefon
            </label>
            <input
              className="form-input form-input-bg w-100 px-3 py-2"
              id="tel"
              type="tel"
              value={tel}
              disabled={!isEditing}
              onChange={(e) => setTel(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="e999Token" className="d-block">
              999.md Token
            </label>
            <input
              className="form-input form-input-bg w-100 px-3 py-2"
              id="e999Token"
              type="text"
              value={e999Token}
              disabled={!isEditing}
              onChange={(e) => setE999Token(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
