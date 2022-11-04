import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../features/user/userSlice";
import { fetchGroup, addAgent } from "./adminApi";
import AddAvatar from "./AddAvatar";
import { Link } from "react-router-dom";
const STATUSES = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error",
};

const GroupPage = ({
  match: {
    params: { id },
  },
}) => {
  const [status, setStatus] = useState(STATUSES.IDLE);
  const group = useRef([]);
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [tel, setTel] = useState("");
  const [username, setUsername] = useState("");
  const error = useRef(null);
  const avatar = useRef(null);
  const token = useSelector(tokenSelector);
  const getGroup = async () => {
    setStatus(STATUSES.LOADING);
    group.current = await fetchGroup(token, id);
    setStatus(STATUSES.LOADED);
  };
  useEffect(() => {
    getGroup();
  }, []);
  if (status !== STATUSES.LOADED && status !== STATUSES.ERROR)
    return (
      <div className="is-loading" style={{ height: "100vh" }}>
        <div className="loader-bg">
          <div className="loader"></div>
        </div>
      </div>
    );

  const handleAddAgent = async () => {
    setStatus(STATUSES.LOADING);
    const data = new FormData();
    if (avatar.current) data.append("image", avatar.current);
    data.append("groupId", id);
    data.append("givenName", givenName);
    data.append("familyName", familyName);
    data.append("username", username);
    data.append("tel", tel);

    try {
      await addAgent(token, data);
      setGivenName("");
      setFamilyName("");
      setTel("");
      setUsername("");

      await getGroup();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.err) {
        error.current = err.response.data.err;
      } else {
        error.current =
          "Eroare. Completati toate campurile sau incercati mai tarziu.";
      }
      setStatus(STATUSES.ERROR);
    }
  };
  const handleSetAvatar = (img) => {
    avatar.current = img;
  };
  return (
    <div className="mt-5">
      <h2>Groupul: {group.current.name}</h2>
      <div className="mt-4">
        <h4 className="mt-4">Adauga agent</h4>
        <div className="d-flex">
          <div className="pr-5" style={{ flexGrow: 2 }}>
            <div className="h-100 w-100 d-flex flex-column">
              <AddAvatar setAvatar={handleSetAvatar} />
            </div>
          </div>
          <div className="" style={{ flexGrow: 2 }}>
            <div className="row g-4">
              <div className="col-6">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-group input-group-bg px-3 py-2"
                />
              </div>
              <div className="col-6">
                <label htmlFor="tel">Telephone *</label>
                <input
                  type="text"
                  id="tel"
                  placeholder="In format 373890000"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  className="input-group input-group-bg px-3 py-2"
                />
              </div>
              <div className="col-6">
                <label htmlFor="fn">Prenume *</label>
                <input
                  type="text"
                  id="fn"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                  className="input-group input-group-bg px-3 py-2"
                />
              </div>
              <div className="col-6">
                <label htmlFor="ln">Nume de familie *</label>
                <input
                  type="text"
                  id="ln"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="input-group input-group-bg px-3 py-2"
                />
              </div>
              <div className="col-12">
                <div className="d-flex">
                  <button
                    className="btn btn-primary w-25"
                    onClick={handleAddAgent}
                  >
                    Adauga
                  </button>
                  {status === STATUSES.ERROR && (
                    <span className="text-danger align-self-center ml-4 text-wrap">
                      {error.current}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <h3 className="mt-4">Agents</h3>
        <div className="row bg-dark text-white">
          <div className="col-2 p-2 border-right border-white">Username</div>
          <div className="col-3 p-2 border-right border-white">Prenume</div>
          <div className="col-3 p-2 border-right border-white">Nume</div>
          <div className="col-2 p-2 border-right border-white">Telefon</div>
          <div className="col-2 p-2 border-right border-white">Actiuni</div>
        </div>
        {group.current.users.map((a) => (
          <div key={a.id} className="mt-3 row border-bottom">
            <div className="col-2 p-2 border-right border-light">
              {a.username}
            </div>
            <div className="col-3 p-2 border-right border-light">
              {a.givenName}
            </div>
            <div className="col-3 p-2 border-right border-light">
              {a.familyName}
            </div>
            <div className="col-2 p-2 border-right border-light">{a.tel}</div>
            <div className="col-2 p-2 border-right border-light">
              <Link
                to={`/admin/agents/${a.id}`}
                className="btn btn-warning text-decoration-none"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupPage;
