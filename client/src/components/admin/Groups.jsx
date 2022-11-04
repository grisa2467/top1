import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { tokenSelector } from "../../features/user/userSlice";
import { fetchGroups, addNewGroup } from "./adminApi";
const STATUSES = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
};
const Groups = () => {
  const [status, setStatus] = useState(STATUSES.IDLE);
  const groups = useRef([]);
  const token = useSelector(tokenSelector);
  const [groupName, setGroupName] = useState("");
  const [group999Token, setGroup999Token] = useState("");
  const getGroups = async () => {
    setStatus(STATUSES.LOADING);
    groups.current = await fetchGroups(token);
    setStatus(STATUSES.LOADED);
  };
  useEffect(() => {
    getGroups();
  }, []);
  if (status !== STATUSES.LOADED)
    return (
      <div className="is-loading" style={{ height: "100vh" }}>
        <div className="loader-bg">
          <div className="loader"></div>
        </div>
      </div>
    );

  const handleAddGroup = async () => {
    setStatus(STATUSES.LOADING);
    const data = {
      name: groupName,
      e999Token: group999Token,
    };
    await addNewGroup(token, data);
    await getGroups();
  };
  return (
    <div className="mt-5">
      <h2 className="text-primary">Adauga group</h2>
      <div className="d-flex justify-content-between">
        <div className="">
          <label htmlFor="groupName">Numele grupului</label>
          <input
            type="text"
            id="groupName"
            className="input-group input-group-bg px-3 py-2"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="token">Token 999.md</label>
          <input
            type="text"
            id="token"
            value={group999Token}
            onChange={(e) => setGroup999Token(e.target.value)}
            className="input-group input-group-bg px-3 py-2"
          />
        </div>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={handleAddGroup}>
            Adauga
          </button>
        </div>
      </div>
      <h2 className="mt-5">Toate grupele</h2>
      <div className="">
        {groups.current.map((group) => (
          <div className="mt-4" key={group.id}>
            <Link
              to={`/admin/groups/${group.id}`}
              className="text-decoration-none"
            >
              {group.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
