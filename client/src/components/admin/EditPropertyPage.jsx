import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../features/user/userSlice";
import imageCompression from "browser-image-compression";
import watermark from "watermarkjs";
import Loader from "../Loader";
import {
  fetchProperty,
  getAllPropertyTypeDetails,
  getAllPropertyTypeUtilities,
} from "../../serverApi/index";
import { createRef } from "react";
import "../../../node_modules/suneditor/dist/css/suneditor.min.css";
import SunEditor from "suneditor-react";
import { fetchGroup, fetchGroups, updateProperty } from "./adminApi";
import { Redirect } from "react-router-dom";
import PhotoArranging from "./PhotoArranging";
import { ReactComponent as AddIcon } from "../../assets/icons/add-round-button.svg";

import AddLocation from "./AddLocation";
import LOGO from "./watermark.png";
function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}
const EditPropertyPage = ({
  match: {
    params: { id },
  },
}) => {
  const [status, setStatus] = useState("idle");
  const [photoList, setPhotoList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [priority, setPriority] = useState(false);
  const property = useRef(null);
  const allDetails = useRef([]);
  const allUtilities = useRef([]);
  const newImages = useRef([]);
  const agents = useRef([]);
  const groups = useRef([]);
  const coordinatesRef = useRef(null);
  const selectedUtilities = useRef(new Set());
  const selectedDetails = useRef([]);
  const deletedPhotos = useRef([]);
  const title = createRef();
  const description = useRef(null);

  const price = createRef();
  const oldPrice = createRef();
  let token = useSelector(tokenSelector);
  const getAgents = async () => {
    setStatus("loading");
    const response = await fetchGroup(token, selectedGroup);
    agents.current = response.users;
    setSelectedAgent(property.current.agent.id);
    setStatus("loaded");
  };
  useEffect(() => {
    if (selectedGroup && selectedGroup !== -1) {
      getAgents();
    }
  }, [selectedGroup]);
  const getGroups = async () => {
    groups.current = await fetchGroups(token);
    setSelectedGroup(property.current.agent.groupId);
  };
  useEffect(() => {
    setStatus("loading");
    const getProperty = async () => {
      property.current = await fetchProperty(id);
      // console.log(property.current);
      setPriority(property.current.priority);
      coordinatesRef.current = property.current.mapLocation;
      description.current = property.current.description;
      setPhotoList(
        property.current.photoIds.sort((a, b) =>
          a.order !== null ? (b.order !== null ? a.order - b.order : -1) : 1
        )
      );
      allDetails.current = await getAllPropertyTypeDetails(
        property.current.propertyTypeId,
        property.current.offerTypeId
      );
      allUtilities.current = await getAllPropertyTypeUtilities(
        property.current.propertyTypeId,
        property.current.offerTypeId
      );
      property.current.utilities.forEach((u) => {
        selectedUtilities.current.add(u.id);
      });
      await getGroups();

      setStatus("loaded");
    };
    if (token) {
      getProperty();
    }

    return () => {
      token = false;
    };
  }, [token]);
  if (status === "saved") return <Redirect to="/admin" />;
  if (status !== "loaded" && status !== "error") return <Loader />;

  const handleEditorChange = (content) => {
    // console.log(content);
    description.current = content;
  };

  const handleSaving = async () => {
    setStatus("loading");
    const modifiedUtilities = [];
    selectedUtilities.current.forEach((u) => {
      const found = property.current.utilities.find((pu) => pu.id === u);
      if (!found) {
        modifiedUtilities.push({
          modified: true,
          added: true,
          id: u,
        });
      }
    });
    property.current.utilities.forEach((pu) => {
      const found = selectedUtilities.current.has(pu.id);
      if (!found) {
        modifiedUtilities.push({
          modified: true,
          removed: true,
          id: pu.id,
        });
      }
    });

    let modifiedDetails = selectedDetails.current.map((sd) => {
      const modDet = {
        id: sd.id,
        modified: true,
      };
      if (sd.optionId) {
        modDet.newOption = +sd.optionId;
      } else if (sd.value && sd.value !== "__-1") {
        modDet.newValue = sd.value;
      } else if (sd.value && sd.value === "__-1") {
        modDet.removed = true;
      }
      const found = property.current.details.find((d) => d.id === sd.id);
      modDet.newRecord = found ? false : true;
      return modDet;
    });
    const _sendingData = new FormData();
    _sendingData.append("propertyId", id);
    _sendingData.append("details", JSON.stringify(modifiedDetails));
    _sendingData.append("utilities", JSON.stringify(modifiedUtilities));
    _sendingData.append("userId", selectedAgent);

    const sendingData = {
      propertyId: id,
      details: modifiedDetails,
      utilities: modifiedUtilities,
      userId: property.current.agent.id,
    };

    if (property.current.price !== +price.current.value) {
      _sendingData.append("price", +price.current.value);
      sendingData.price = +price.current.value;
    }

    if (property.current.oldPrice !== +oldPrice.current.value) {
      _sendingData.append("oldPrice", +oldPrice.current.value);
      sendingData.oldPrice = +oldPrice.current.value;
    }

    const newDescrpition = description.current;
    if (property.current.description !== newDescrpition) {
      _sendingData.append("description", newDescrpition);
      sendingData.description = newDescrpition;
    }
    if (property.current.title !== title.current.value) {
      _sendingData.append("title", title.current.value);
      sendingData.title = title.current.value;
    }
    if (property.current.priority !== priority) {
      _sendingData.append("priority", priority);
    }

    let photosModifed = false;
    const newOrder = [];
    for (let i = 0; i < photoList.length; i++) {
      const p = photoList[i];
      newOrder.push({ id: p.id, order: i });
      if (i !== p.order) {
        photosModifed = true;
      }
    }

    if (deletedPhotos.current.length) {
      _sendingData.append(
        "deletedPhotos",
        JSON.stringify(deletedPhotos.current)
      );
    }

    if (photosModifed) {
      _sendingData.append("newOrder", JSON.stringify(newOrder));
      sendingData.newOrder = newOrder;
    }
    for (let i = 0; i < newImages.current.length; i++) {
      const ni = newImages.current[i];
      _sendingData.append("images", ni);
    }

    if (
      !property.current.mapLocation ||
      coordinatesRef.current.lat !== property.current.mapLocation.lat ||
      coordinatesRef.current.long !== property.current.mapLocation.long
    )
      _sendingData.append(
        "coordinates",
        JSON.stringify(coordinatesRef.current)
      );
    // console.log(sendingData);
    try {
      const response = await updateProperty(token, _sendingData);
      setStatus("saved");
    } catch (err) {
      setStatus("error");
    }
    // // console.log(response);
  };
  const handleDeletePhoto = (photo) => {
    if (typeof photo.id !== "string")
      deletedPhotos.current.push({ id: photo.id });
    else {
      newImages.current = newImages.current.filter(
        (p) => p.name !== photo.id.substring(1)
      );
      setPhotoList(photoList.filter((p) => p.id !== photo.id));
    }
  };

  const handleImageLoaded = async (e) => {
    const inputPhotos = Array.from(e.target.files);
    const _clean = [];
    for (let i = 0; i < inputPhotos.length; i++) {
      const p = inputPhotos[i];
      let isNew = true;
      for (let j = 0; j < photoList.length; j++) {
        const op = photoList[j];
        if (op.id === `_${p.name}`) {
          isNew = false;
          break;
        }
      }
      if (isNew) {
        const blo = await imageCompression(p, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        const compressed = new File([blo], p.name, {
          type: p.type,
        });
        const markedImgNode = await watermark([compressed, LOGO]).image(
          watermark.image.center(0.3)
        );

        const url = markedImgNode.src;
        const markedImg = await urltoFile(url, p.name, p.type);

        _clean.push({
          id: `_${p.name}`,
          url,
          order: null,
        });
        newImages.current = [...newImages.current, markedImg];
      }
    }
    setPhotoList([...photoList, ..._clean]);
  };
  return (
    <div>
      <h2>Editare anunt cu id: {id}</h2>
      <div className="mt-5">
        <div className="mt-3">
          <div className="">
            <label htmlFor="title" className="d-block form-label mt-3">
              Titlul anuntului
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="w-100 form-input px-3 py-2 form-input-bg"
              ref={title}
              defaultValue={property.current.title}
            />
          </div>
          <div className="d-flex">
            <div className="w-50 pr-3">
              <label htmlFor="price" className="d-block form-label mt-3">
                Pretul
              </label>
              <input
                placeholder="0"
                type="number"
                id="title"
                className="w-100 form-input px-3 py-2 form-input-bg"
                ref={price}
                defaultValue={property.current.price}
              />
            </div>
            <div className="w-50 pl-3">
              <label htmlFor="oldPrice" className="d-block form-label mt-3">
                Pretul Vechi (EUR)
              </label>
              <input
                placeholder="0"
                type="number"
                id="title"
                className="w-100 form-input px-3 py-2 form-input-bg"
                ref={oldPrice}
                defaultValue={property.current.oldPrice}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <label htmlFor="group" className="form-label">
                Grup <span className="text-danger">*</span>
              </label>
              <select
                id="group"
                className="d-block w-100 form-input form-input-bg px-3 py-2"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value={-1}>---</option>

                {groups.current.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedGroup && (
              <div className="col-6">
                <label htmlFor="agent" className="form-label">
                  Agent <span className="text-danger">*</span>
                </label>
                <select
                  id="agent"
                  className="d-block w-100 form-input form-input-bg px-3 py-2"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <option value={-1}>---</option>

                  {agents.current.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.givenName} {a.familyName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="">
            <label htmlFor="title" className="d-block form-label mt-3">
              Descriere
            </label>
            {/* <textarea
              id="description"
              className="w-100 form-input px-3 py-2 form-input-bg"
              rows="20"
              ref={description}
              defaultValue={property.current.description}
            /> */}
            <SunEditor
              setDefaultStyle="font-family: Poppins;"
              height={500}
              setContents={property.current.description}
              setOptions={{
                resizingBar: false,
                buttonList: [
                  ["undo", "redo"],
                  ["font", "fontSize", "formatBlock"],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                  ],
                  ["fontColor", "hiliteColor"],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  ["align", "list", "lineHeight"],
                  ["link"],
                ],
              }}
              onChange={handleEditorChange}
            />
          </div>
        </div>

        {/* IMAGES/ */}
        <div className="mt-5">
          <h3>
            Fotografii
            <label className="ml-3" htmlFor="addimg">
              <AddIcon />
            </label>
          </h3>
          <input
            type="file"
            multiple={true}
            className="d-none"
            accept="image/*"
            id="addimg"
            onChange={handleImageLoaded}
          />
          <span className="font-size-small text-dark">
            Modifica ordinea prin tragerea imaginilor.
          </span>
          <div className="">
            <span className="font-size-small text-dark">
              Sterge imaginea prin tragerea ei in cosul de gunoi din dreapta.
            </span>
          </div>

          {photoList.length ? (
            <div className="mt-3">
              <PhotoArranging
                setPhotoList={setPhotoList}
                photoList={photoList}
                deletePhoto={handleDeletePhoto}
                // newFiles={isNewFiles}
                // setNewFiles={setIsNewFiles}
              />
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="mt-3 row g-4">
          {allDetails.current.map((detail) => {
            const foundDet = property.current.details.find(
              (d) => d.id === detail.id
            );
            // console.log(foundDet);
            const defValue = foundDet ? foundDet.value : null;
            return (
              <div key={detail.id} className="col-3">
                {detail.details.detailOptions.length ? (
                  <div>
                    <label htmlFor={detail.id}>
                      {detail.details.name}
                      {detail.details.units ? `, ${detail.details.units}` : ""}
                      {detail.required ? (
                        <span className="text-danger">*</span>
                      ) : (
                        ""
                      )}
                    </label>
                    <select
                      id={detail.id}
                      className="d-block w-100 mt-1 form-input form-input-bg px-3 py-2"
                      defaultValue={foundDet ? foundDet.optionId : -1}
                      onChange={(e) => {
                        const found = selectedDetails.current.find(
                          (d) => d.id === detail.id
                        );

                        if (found) {
                          selectedDetails.current = selectedDetails.current.map(
                            (d) => {
                              if (d.id === detail.id) {
                                return {
                                  ...d,
                                  optionId: e.target.value
                                    ? e.target.value
                                    : null,
                                };
                              }
                              return d;
                            }
                          );
                        } else
                          selectedDetails.current.push({
                            id: detail.id,
                            optionId: e.target.value ? e.target.value : null,
                          });
                      }}
                    >
                      <option value={-1}>---</option>
                      {detail.details.detailOptions.map(({ options: opt }) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label htmlFor={detail.detailId}>
                      {detail.details.name}
                      {detail.details.units ? (
                        detail.details.units === "m2" ? (
                          <>
                            {", "}m<sup>2</sup>
                          </>
                        ) : (
                          `, ${detail.details.units}`
                        )
                      ) : (
                        ""
                      )}
                      {detail.required ? (
                        <span className="text-danger">*</span>
                      ) : (
                        ""
                      )}
                    </label>
                    <input
                      type="text"
                      id={detail.id}
                      className="mt-1 w-100 form-input form-input-bg px-3 py-2"
                      defaultValue={defValue}
                      onChange={(e) => {
                        const found = selectedDetails.current.find(
                          (d) => d.id === detail.id
                        );

                        if (found) {
                          selectedDetails.current = selectedDetails.current.map(
                            (d) => {
                              if (d.id === detail.id) {
                                return {
                                  ...d,
                                  value: e.target.value
                                    ? e.target.value
                                    : "__-1",
                                };
                              }
                              return d;
                            }
                          );
                        } else
                          selectedDetails.current.push({
                            id: detail.id,
                            value: e.target.value ? e.target.value : "__-1",
                          });
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 row">
          {allUtilities.current.map((utility) => (
            <div key={utility.id} className="col-4">
              <input
                type="checkbox"
                name={utility.id}
                defaultChecked={property.current.utilities.find(
                  (u) => u.id === utility.id
                )}
                id={utility.id}
                onChange={() => {
                  const utilityId = utility.id;
                  selectedUtilities.current.has(utilityId)
                    ? selectedUtilities.current.delete(utilityId)
                    : selectedUtilities.current.add(utilityId);
                  // selectedUtilities.current.includes(utilityId)
                  //   ? (selectedUtilities.current = selectedUtilities.current.filter(
                  //       (item) => item !== utilityId
                  //     ))
                  //   : selectedUtilities.current.push(utilityId);
                }}
              />
              <label htmlFor={utility.id} className="ml-2">
                {utility.name}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label htmlFor="priority" style={{ fontSize: 20 }}>
            Properietate cu prioritate
          </label>
          <input
            className="ml-3 bigger-25"
            type="checkbox"
            id="priority"
            defaultChecked={property.current.priority}
            onChange={(e) => setPriority(e.target.checked)}
          />
        </div>
        <div className="mt-4">
          <AddLocation
            coordinatesRef={coordinatesRef}
            initState={property.current.mapLocation}
          />
        </div>
        <div className="my-4">
          {status === "error" && (
            <p className="text-danger">Eroare. Salvare nereusita</p>
          )}
          <button className="btn btn-success" onClick={handleSaving}>
            Salveaza
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyPage;
