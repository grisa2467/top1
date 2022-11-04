import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, statusSelector, STATUSES } from "../../features/user/userSlice";
const AdminLoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const status = useSelector(statusSelector);

  const dispatch = useDispatch();
  //TODO: Redirect to '/admin' if authenticated

  useEffect(() => {
    if (status === STATUSES.LOGGED_IN) {
      props.history.push("/admin/");
    }
  }, [status, props.history]);
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };
  return (
    <div className="container">
      <div className="d-flex justify-content-center mt-5 w-100">
        <div className="p-3 border w-30 bg-dark text-white">
          <h3 className="text-center">Login</h3>
          <form className="d-flex flex-column" onSubmit={handleLogin}>
            <div className="mt-4">
              <label htmlFor="username" className="d-block">
                Username
              </label>
              <input
                className="w-100 mt-2 form-input border-0 p-2"
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="d-block">
                Password
              </label>
              <input
                type="password"
                className="w-100 mt-2 form-input border-0 p-2"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <input
              className="btn btn-primary w-75 align-self-center mt-4"
              type="submit"
              value="Sign in"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
