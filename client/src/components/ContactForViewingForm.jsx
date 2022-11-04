import React, { createRef, useState } from "react";
import { sendEmail } from "../serverApi";
import Loader from "./Loader";
const ContactForViewingForm = () => {
  const [contactStatus, setContactStatus] = useState("idle");
  const name = createRef(null);
  const tel = createRef(null);
  const email = createRef(null);

  const handleContactSubmit = async () => {
    setContactStatus("loading");
    const validateEmail = (email) => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };
    if (!name.current.value || !tel.current.value || !email.current.value) {
      setContactStatus("invalid");
    } else if (!validateEmail(email.current.value)) {
      setContactStatus("invalid email");
    } else {
      try {
        const data = {
          name: name.current.value,
          tel: tel.current.value,
          email: email.current.value,
        };
        await sendEmail(data);
        setContactStatus("success");
      } catch (err) {
        setContactStatus("error");
      }
    }
  };

  return (
    <>
      {contactStatus === "loading" ? (
        <Loader style={{ minHeight: 200 }} />
      ) : contactStatus === "success" ? (
        <h6 className="text-success">
          Mesajul dvs a fost trimis. Vom reveni curand.
        </h6>
      ) : contactStatus === "error" ? (
        <div className="text-danger">
          A aparut o eroare. Va rugam incercati mai tarziu sau contactati-ne.
        </div>
      ) : (
        <div className="font-size-small py-2">
          <div
            className={`py-3 text-center text-white rent-color`}
            style={{ fontSize: "1.25em" }}
          >
            Lăsați o cerere de vizualizare
          </div>
          <div className="mx-0 mx-lg-3">
            <div className="row mt-3">
              {/* <div className="col-12">
            <label htmlFor="name">
              Numele <span className="text-danger">*</span>
            </label>
          </div> */}
              <div className="col-12">
                <input
                  className="w-100 search-input p-2"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nume *"
                  ref={name}
                />
              </div>
            </div>
            <div className="row mt-3">
              {/* <div className="col-12">
            <label htmlFor="tel">
              Telefon <span className="text-danger">*</span>
            </label>
          </div> */}
              <div className="col-12">
                <input
                  className="w-100 search-input p-2"
                  type="tel"
                  id="tel"
                  name="tel"
                  placeholder="Telefon *"
                  ref={tel}
                />
              </div>
            </div>
            <div className="row mt-3">
              {/* <div className="col-12">
            <label htmlFor="email">
              Email <span className="text-danger">*</span>
            </label>
          </div> */}
              <div className="col-12">
                <input
                  className="w-100 search-input p-2"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email *"
                  ref={email}
                />
              </div>
            </div>

            {contactStatus === "invalid" && (
              <div className=" mt-2 text-center" style={{ fontSize: 11 }}>
                <span className="text-danger">
                  Vă rugam să completati toate campurile.
                </span>
              </div>
            )}

            {contactStatus === "invalid email" && (
              <div className=" mt-2 text-center" style={{ fontSize: 11 }}>
                <span className="text-danger">
                  Vă rugam să indicati un email corect.
                </span>
              </div>
            )}
            <button
              className="btn btn-primary mt-2"
              onClick={handleContactSubmit}
            >
              Trimite
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactForViewingForm;
