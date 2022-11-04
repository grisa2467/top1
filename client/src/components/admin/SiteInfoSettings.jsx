import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { fetchSiteInfo } from "../../serverApi";
import { updateSiteInfo } from "./adminApi";
import Loader from "../Loader";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../features/user/userSlice";
import { Redirect } from "react-router-dom";
const fields = [
  "facebook",
  "instagram",
  "linkedin",
  "street",
  "tel",
  "email",
  // "about",
  // "about_photo",
];
const SiteInfoSettings = () => {
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState("idle");
  const statusMessage = useRef(null);
  const token = useSelector(tokenSelector);

  useEffect(() => {
    const getInfo = async () => {
      const response = await fetchSiteInfo({
        fields,
      });

      const info = {};
      fields.forEach((field) => {
        const found = response.info.find((f) => f.id === field);
        if (found) info[field] = found.description;
      });

      setInfo(info);
    };
    getInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.target);
    const data = {};
    fields.forEach((field) => {
      if (formData.get(field) !== info[field])
        data[field] = formData.get(field);
    });

    // fields.forEach((field) => {
    //   console.log(formData.get(field));
    // });
    try {
      await updateSiteInfo(token, data);
      statusMessage.current = null;
      setStatus("loaded");
    } catch (err) {
      statusMessage.current = "Eroare. Salvare nereusita.";
      setStatus("error");
    }
  };
  if (status === "loading") return <Loader />;
  if (status === "loaded") return <Redirect to="/admin" />;
  return (
    <div className="mt-5">
      <h1>Informatia despre site</h1>
      <div className="mt-4">
        <form onSubmit={handleSubmit}>
          <div className="w-50 mt-4">
            <label htmlFor="facebook" className="d-block form-label mt-3">
              Facebook URL
            </label>
            <input
              type="text"
              name="facebook"
              id="facebook"
              className="w-100 form-input px-3 py-2 form-input-bg"
              // ref={title}
              defaultValue={info ? info.facebook : ""}
            />
          </div>
          <div className="w-50 mt-4">
            <label htmlFor="instagram" className="d-block form-label mt-3">
              Instagram URL
            </label>
            <input
              type="text"
              name="instagram"
              id="instagram"
              className="w-100 form-input px-3 py-2 form-input-bg"
              // ref={title}
              defaultValue={info ? info.instagram : ""}
            />
          </div>
          <div className="w-50 mt-4">
            <label htmlFor="linkedin" className="d-block form-label mt-3">
              LinkedIn URL
            </label>
            <input
              type="text"
              name="linkedin"
              id="linkedin"
              className="w-100 form-input px-3 py-2 form-input-bg"
              // ref={title}
              defaultValue={info ? info.linkedin : ""}
            />
          </div>
          <div className="w-50 mt-4">
            <label htmlFor="tel" className="d-block form-label mt-3">
              Telefon
            </label>
            <input
              type="text"
              name="tel"
              id="tel"
              className="w-100 form-input px-3 py-2 form-input-bg"
              // ref={title}
              defaultValue={info ? info.tel : ""}
            />
          </div>
          <div className="w-50 mt-4">
            <label htmlFor="email" className="d-block form-label mt-3">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="w-100 form-input px-3 py-2 form-input-bg"
              // ref={title}
              defaultValue={info ? info.email : ""}
            />
          </div>
          <div className="w-50 mt-4">
            <label htmlFor="street" className="d-block form-label mt-3">
              Strada
            </label>
            <input
              type="text"
              name="street"
              id="street"
              className="w-100 form-input px-3 py-2 form-input-bg"
              // ref={title}
              defaultValue={info ? info.street : ""}
            />
          </div>

          <span className="text-danger mt-4">
            {statusMessage.current || ""}
          </span>
          <div className="mt-4">
            <input type="submit" className="btn btn-primary" value="Salveaza" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteInfoSettings;
