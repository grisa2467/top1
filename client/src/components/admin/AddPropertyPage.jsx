import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import SunEditor from "suneditor-react";
import { tokenSelector } from "../../features/user/userSlice";
import { fetchGroup, fetchGroups } from "./adminApi";
import CityForm from "./CityForm";
import PropertyDetailsForm from "./PropertyDetailsForm";
import PropertyUtilitiesForm from "./PropertyUtilitiesForm";
import RegionForm from "./RegionForm";
import { ReactComponent as AddIcon } from "../../assets/icons/add-round-button.svg";
import SectorForm from "./SectorForm";
import PhotoArranging from "./PhotoArranging";
import Axios from "axios";
import imageCompression from "browser-image-compression";
import SetLocation from "./SetLocation";
import AddLocation from "./AddLocation";
import watermark from "watermarkjs";
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
const propertyTypes = [
  { id: 27, e999Id: 1404, name: "Apartament" },
  { id: 28, e999Id: 1406, name: "Casa" },
  { id: 30, e999Id: 1405, name: "Spatiu comercial" },
  { id: 29, e999Id: 1407, name: "Teren" },
];
const offerTypes = [
  { id: 5, e999Id: 776, name: "vânzare" },
  { id: 6, e999Id: 912, name: "Chirie" },
];

const AddPropertyPage = () => {
  const [propertyType, setPropertyType] = useState(null);
  const [offerType, setOfferType] = useState(null);
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [title, setTitle] = useState("");
  const [coords, setCoords] = useState([]);
  // const [description, setDescription] = useState("");
  const description = useRef("");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [postOn999, setPostOn999] = useState(false);
  const [priority, setPriority] = useState(false);
  const [photoList, setPhotoList] = useState([]);

  const token = useSelector(tokenSelector);
  const street = useRef("");
  const house = useRef("");
  const newImages = useRef([]);
  const selectedDetails = useRef([]);
  const selectedUtilities = useRef([]);
  const groups = useRef([]);
  const deletedPhotos = useRef([]);
  const agents = useRef([]);
  const handleClickMapCoords = event => {
    setCoords(event);
    console.log('event',event);
  }
  const [status, setStatus] = useState("idle");
  const handleAddProperty = async (e) => {
    setStatus("loading");
    e.preventDefault();

    function extractContent(html) {
      html = html.replace(/<style([\s\S]*?)<\/style>/gi, "");
      html = html.replace(/<script([\s\S]*?)<\/script>/gi, "");
      html = html.replace(/<\/div>/gi, "\n");
      html = html.replace(/<\/li>/gi, "\n");
      html = html.replace(/<li>/gi, "  *  ");
      html = html.replace(/<\/ul>/gi, "\n");
      html = html.replace(/<\/p>/gi, "\n");
      html = html.replace(/<br\s*[\/]?>/gi, "\n");
      html = html.replace(/<[^>]+>/gi, "");
      html = html.replaceAll("&nbsp;", " ");
      return html;
    }

    

    const newOrder = [];
    for (let i = 0; i < photoList.length; i++) {
      const p = photoList[i];
      newOrder.push({ id: p.id, order: i });
    }

    const e999desc = extractContent(description.current);
    const formData = new FormData(e.target);
    if (formData.has("images")) formData.delete("images");
    formData.append("propertyTypeId", propertyType);
    formData.append("offerTypeId", offerType);
    formData.append("regionId", selectedRegion);
    formData.append("cityId", selectedCity);
    formData.append("sectorId", selectedSector);
    formData.append("agentId", selectedAgent);
    formData.append("postOn999", postOn999);
    formData.append("description", description.current);
    formData.append("description999", e999desc);
    formData.append("newOrder", JSON.stringify(newOrder));
    formData.append("priority", priority);
    formData.append("coordinates", JSON.stringify(coords));
      

    if (newImages.current)
      for (let i = 0; i < newImages.current.length; i++) {
        const img = newImages.current[i];
        formData.append("images", img);
      }
    const requestUrl = `${window.location.origin}/api/add-property`;

    const response = await Axios({
      timeout: 1000 * 5 * 60,
      url: requestUrl,
      method: "POST",
      headers: {
        "x-auth-token": token,
      },
      data: formData,
    });
    const responseJson = response.data;
    console.log(responseJson);
    if (responseJson.err) {
      console.log(responseJson.err);
      setStatus("error");
    } else {
      setStatus("added");
    }
  };
  const handleEditorChange = (content) => {
    // console.log(content);
    description.current = content;
    // .replaceAll("</p>", "\n</p>")
    // .replaceAll("</div>", "\n</div>")
    // .replaceAll("</h1>", "\n</h1>")
    // .replaceAll("</h2>", "\n</h2>")
    // .replaceAll("</h3>", "\n</h3>")
    // .replaceAll("</h4>", "\n</h4>")
    // .replaceAll("</h5>", "\n</h5>")
    // .replaceAll("</h6>", "\n</h6>");

    // console.log(json);
    // console.log(description.current);
  };
  const form = (
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="d-flex">
        <div className="w-50 pr-3">
          <label htmlFor="price" className="d-block form-label mt-3">
            Pret (EUR)
          </label>
          <input
            placeholder="0"
            type="number"
            name="price"
            id="price"
            className="w-100 form-input px-3 py-2 form-input-bg"
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
          />
        </div>

        <div className="w-50">
          <label htmlFor="oldPrice" className="d-block form-label mt-3">
            Pret vechi (EUR)
          </label>
          <input
            placeholder="(optional)"
            type="number"
            name="oldPrice"
            id="oldPrice"
            className="w-100 form-input px-3 py-2 form-input-bg"
            value={oldPrice}
            onChange={(e) => setOldPrice(+e.target.value)}
          />
        </div>
      </div>

      <div className="">
        <label htmlFor="description" className="d-block mt-3 form-label">
          Descrierea anuntului
        </label>
        {/* <textarea
          name="description"
          id="description"
          className="w-100 form-input px-3 py-2 form-input-bg"
          rows="20"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /> */}
        <SunEditor
          setDefaultStyle="font-family: Poppins;"
          height={800}
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
  );
  const statusMessage =
    status === "added" ? (
      // <div className="font-size-small text-success">Anuntul a fost adaugat</div>
      <Redirect to={{ pathname: "/admin" }} />
    ) : status === "error" ? (
      <div className="font-size-small text-danger">
        Eroare. Va rugam incercati mai tarziu sau apelati echipa tehnica.
      </div>
    ) : (
      ""
    );

  const getGroups = async () => {
    setStatus("loading");
    groups.current = await fetchGroups(token);

    setStatus("loaded");
  };
  useEffect(() => {
    getGroups();
  }, []);

  const getAgents = async () => {
    setStatus("loading");
    const response = await fetchGroup(token, selectedGroup);
    agents.current = response.users;
    setStatus("loaded");
  };
  useEffect(() => {
    if (selectedGroup && selectedGroup !== -1) {
      getAgents();
    }
  }, [selectedGroup]);
  if (status === "loading")
    return (
      <div className="is-loading" style={{ height: "100vh" }}>
        <div className="loader-bg">
          <div className="loader"></div>
        </div>
      </div>
    );

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
  return (
    <div>
      <h2 className="text-center">Adauga imobil</h2>
      <div className="mt-4">
        <span className="form-label">Tip imobil</span>
      </div>

      <div className="d-flex">
        {propertyTypes.map((pt, i) => (
          <button
            key={i}
            className={`mr-3 flex-grow-1 btn ${
              propertyType === pt.id ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setPropertyType(pt.id)}
          >
            {pt.name}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <span className="form-label">Tip oferta</span>
      </div>
      <div className="d-flex">
        {offerTypes.map((ot, i) => (
          <button
            key={i}
            className={`mr-3 flex-grow-1 btn ${
              offerType === ot.id ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setOfferType(ot.id)}
          >
            {ot.name}
          </button>
        ))}
      </div>
      <form
        method="post"
        encType="multipart/form-data"
        onSubmit={handleAddProperty}
      >
        <div className="mt-4 row g-4">
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
        {form}
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
          <div className="" id="marking">
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

        {propertyType && offerType ? (
          <div className="mt-3">
            <PropertyDetailsForm
              propertyTypeId={propertyType}
              offerTypeId={offerType}
              selectedDetails={selectedDetails}
            />
          </div>
        ) : (
          ""
        )}
        {propertyType && offerType ? (
          <div className="mt-3">
            <PropertyUtilitiesForm
              propertyTypeId={propertyType}
              offerTypeId={offerType}
              selectedUtilities={selectedUtilities}
            />
          </div>
        ) : (
          ""
        )}
        <div className="mt-3 row g-4">
          <div className="col-4">
            <RegionForm setSelectedRegion={setSelectedRegion} />
          </div>
          <div className="col-4">
            {selectedRegion && (
              <CityForm
                selectedRegion={selectedRegion}
                setSelectedCity={setSelectedCity}
              />
            )}
          </div>
          <div className="col-4">
            {selectedCity && (
              <SectorForm
                selectedCity={selectedCity}
                setSelectedSector={setSelectedSector}
              />
            )}
          </div>
          <div className="col-4">
            <label htmlFor="street" className="d-block form-label">
              Strada
            </label>
            <input
              type="text"
              name="street"
              id="street"
              className="w-100 py-2 px-3 form-input-bg form-input"
              onChange={(e) => (street.current = e.target.value)}
            />
          </div>
          <div className="col-4">
            <label htmlFor="house" className="d-block form-label">
              Casa
            </label>
            <input
              type="text"
              name="house"
              id="house"
              className="w-100 py-2 px-3 form-input-bg form-input"
              onChange={(e) => (house.current = e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="on999" style={{ fontSize: 20 }}>
            Adauga pe 999.md
          </label>
          <input
            className="ml-3 bigger-25"
            type="checkbox"
            id="on999"
            onChange={(e) => setPostOn999(e.target.checked)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="priority" style={{ fontSize: 20 }}>
            Properietate cu prioritate
          </label>
          <input
            className="ml-3 bigger-25"
            type="checkbox"
            id="priority"
            onChange={(e) => setPriority(e.target.checked)}
          />
        </div>
        {/* <div className="mt-4">
          <SetLocation />
        </div> */}
        <div className="mt-4">
          <AddLocation handleClickMapCoords={handleClickMapCoords} initState={null} />
        </div>
        {statusMessage}
        <button
          className="btn btn-primary my-4 btn-lg"
          disabled={!selectedAgent || selectedAgent === -1}
          type="submit"
        >
          Adauga
        </button>
      </form>
    </div>
  );
};

export default AddPropertyPage;
