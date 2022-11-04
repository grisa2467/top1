import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../features/user/userSlice";
import Loader from "../Loader";
import AddAvatar from "./AddAvatar";
import { fetchAgent, updateAgentProfile } from "./adminApi";
const AdminAgentPage = ({
  match: {
    params: { id },
  },
}) => {
  const [status, setStatus] = useState("loading");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tel, setTel] = useState("");
  const error = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const newAvatar = useRef(null);
  const token = useSelector(tokenSelector);

  const agentProfile = useRef(null);
  const restoreFields = () => {
    const _avatar = agentProfile.current.profile.image
      ? `https://i.simpalsmedia.com/999.md/BoardImages/320x240/${agentProfile.current.profile.image}`
      : null;
    setAvatar(_avatar);
    setGivenName(agentProfile.current.profile.givenName);
    setFamilyName(agentProfile.current.profile.familyName);
    setTel(agentProfile.current.profile.tel);
    setIsEditing(false);
  };
  const getAgent = async () => {
    setStatus("loading");
    try {
      agentProfile.current = await fetchAgent(token, id);

      console.log(agentProfile);
      restoreFields();
      setStatus("loaded");
    } catch (err) {
      setStatus("fatalerror");
    }
  };
  useEffect(() => {
    getAgent();
  }, []);

  const handleSetAvatar = (img) => {
    newAvatar.current = img;
    setAvatar(null);
  };
  const handleSave = async () => {
    setStatus("loading");
    const newData = new FormData();
    const _profile = agentProfile.current.profile;
    newData.append("userId", id);
    newData.append("e999Token", _profile.e999Token);
    if (_profile.givenName !== givenName)
      newData.append("givenName", givenName);
    if (_profile.familyName !== familyName)
      newData.append("familyName", familyName);
    if (_profile.tel !== tel) newData.append("tel", tel);
    if (!avatar) newData.append("image", newAvatar.current);
    if (!avatar && _profile.image) newData.append("deleteImage", true);
    try {
      await updateAgentProfile(token, newData);
      getAgent();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.err) {
        error.current = err.response.data.err;
      } else {
        error.current =
          "Eroare. Completati toate campurile sau incercati mai tarziu.";
      }
      setStatus("error");
    }
  };
  if (status === "fatalerror")
    return (
      <div className="mt-5 p-5">
        <h1 className="text-danger">
          EROARE. Incercati mai tarziu sau sa va logati din nou.
        </h1>
      </div>
    );
  if (status === "loading") return <Loader />;
  return (
    <div className="mt-5">
      <h1>Pagina agentului</h1>
      <div className="mt-5">
        <div className="d-flex">
          <div className="pr-5" style={{ flexGrow: 2 }}>
            <div className="h-100 w-100 d-flex flex-column">
              <AddAvatar
                setAvatar={handleSetAvatar}
                defaultAvatar={avatar}
                disableButtons={!isEditing}
              />
            </div>
          </div>
          <div className="" style={{ flexGrow: 2 }}>
            <div className="row g-4">
              <div className="col-6">
                <label htmlFor="tel">Telephone *</label>
                <input
                  type="text"
                  id="tel"
                  placeholder="In format 373890000"
                  value={tel}
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="input-group input-group-bg px-3 py-2"
                />
              </div>
              <div className="col-12">
                <div className="d-flex">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-success w-25"
                        onClick={handleSave}
                      >
                        Salveaza
                      </button>
                      <button
                        className="btn btn-danger ml-4 w-25"
                        onClick={restoreFields}
                      >
                        Restaureaza
                      </button>
                      {status === "error" && (
                        <span className="text-danger align-self-center ml-4 text-wrap">
                          {error.current}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning w-25"
                        onClick={() => setIsEditing(true)}
                      >
                        Editeaza
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAgentPage;
