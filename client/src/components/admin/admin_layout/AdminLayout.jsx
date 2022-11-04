import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import {
  getUserInfo,
  infoSelector,
  infoStatusSelector,
  INFO_STATUSES,
  signOut,
  STATUSES,
  statusSelector,
} from "../../../features/user/userSlice";
const siedMenuWidth = 400;
const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const infoStatus = useSelector(infoStatusSelector);
  const status = useSelector(statusSelector);
  const userInfo = useSelector(infoSelector);

  useEffect(() => {
    if (status === STATUSES.LOGGED_IN && infoStatus === INFO_STATUSES.IDLE) {
      dispatch(getUserInfo());
    }
  }, [infoStatus, status, dispatch]);
  if (status !== STATUSES.LOGGED_IN) {
    return <Redirect to="/admin/login" />;
  }
  const handleLogout = () => {
    dispatch(signOut());
  };
  if (
    status === STATUSES.PENDING ||
    infoStatus === INFO_STATUSES.IDLE ||
    infoStatus === INFO_STATUSES.PENDING
  ) {
    return (
      <div className="is-loading">
        <div className="loader-bg">
          <div className="loader"></div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="d-flex">
        <div
          className="p-5 position-fixed d-flex flex-column bg-dark"
          style={{
            width: siedMenuWidth,
            height: window.innerHeight,
            zIndex: 1,
            top: 0,
            left: 0,
          }}
        >
          <Link to="/admin" className="text-decoration-none text-white">
            Dashboard
          </Link>
          {/* <Link
            to="/admin/settings"
            className="text-decoration-none text-white mt-4"
          >
            Setari
          </Link> */}
          <Link
            to="/admin/siteinfo"
            className="text-decoration-none text-white mt-4"
          >
            Setari
          </Link>
          <Link
            to="/admin/groups"
            className="text-decoration-none text-white mt-4"
          >
            Grupuri
          </Link>
          <Link
            to="/admin/add"
            role="button"
            type="button"
            className="btn btn-primary mt-4"
          >
            Adauga imobil
          </Link>
          <div className="mt-auto">
            <button className="btn btn-danger w-100" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
        <div className=" flex-grow-1" style={{ marginLeft: siedMenuWidth }}>
          {/* <h1>
            Hi, {userInfo.username}, {userInfo.givenName}, {userInfo.familyName}
          </h1> */}

          <div className="container px-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
