import React, { useEffect, useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { fetchSiteInfo } from "../../serverApi";
import Navbar from "./header/Navbar";
import cookies from "../../getCookies";
import { useHistory } from "react-router-dom";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setScroll } from "../../features/breadcrumb/BreadcrumbSlice";
const UserLayout = ({ children }) => {
  const [info, setInfo] = useState(null);

  const [stickyNavbar, setStickyNavbar] = useState(false);
  const [locationKeys, setLocationKeys] = useState([]);
  const dispatch = useDispatch();

  const history = useHistory();
  const scrollTo = useRef(0);
  useEffect(() => {
    return history.listen((location) => {
      if (history.action === "PUSH") {
        setLocationKeys([location.key]);
        dispatch(setScroll(scrollTo.current));
      }

      if (history.action === "POP") {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys);

          // Handle forward event
        } else {
          setLocationKeys((keys) => [location.key, ...keys]);
        }
      }
    });
  }, [locationKeys]);
  useEffect(() => {
    // cookies.addChangeListener(({ name, value }) => {
    //   console.log(name);
    //   console.log(value);
    // console.log(cookies.getAll());
    // });
    // cookies.set("favs", [58, 70], {
    //   path: "/",
    // });
    // cookies.remove("favs");

    if (!cookies.get("favs")) cookies.set("favs", []);
    return () => cookies.removeChangeListener(null);
  }, []);
  useEffect(() => {
    window.addEventListener(
      "scroll",
      (e) => {
        scrollTo.current = window.pageYOffset;
        if (window.pageYOffset > 200) setStickyNavbar(true);
        else if (window.pageYOffset <= 200) {
          setStickyNavbar(false);
        }
      },
      { passive: true }
    );

    const getInfo = async () => {
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
    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);

  // const handleContactSubmit = async () => {
  //   setContactStatus("loading");
  //   const validateEmail = (email) => {
  //     const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //     return re.test(String(email).toLowerCase());
  //   };
  //   if (!name.current.value || !tel.current.value || !email.current.value) {
  //     setContactStatus("invalid");
  //   } else if (!validateEmail(email.current.value)) {
  //     setContactStatus("invalid email");
  //   } else {
  //     try {
  //       const data = {
  //         name: name.current.value,
  //         tel: tel.current.value,
  //         email: email.current.value,
  //       };
  //       await sendEmail(data);
  //       setContactStatus("success");
  //     } catch (err) {
  //       setContactStatus("error");
  //     }
  //   }
  // };
  return (
    <div>
      <Header
        facebook={info ? info.facebook : null}
        instagram={info ? info.instagram : null}
        linkedin={info ? info.linkedin : null}
        street={info ? info.street : null}
        tel={info ? info.tel : null}
      />
      {stickyNavbar ? (
        <div
          className="bg-white py-3"
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 199999,
          }}
        >
          <Navbar sticky={true} />
        </div>
      ) : (
        <></>
      )}
      {children}
      {/* {info && info.tel && (
        <div
          className=""
          style={{
            position: "fixed",
            bottom: "50%",
            right: 0,
          }}
        >
          <button
            className="btn rent-outline-color"
            data-toggle="modal"
            data-target="#requestCall"
            style={{
              transformOrigin: "bottom right",
              transform: "rotate(-90deg) translateX(100%)",
            }}
          >
            Solicita un apel
          </button>
        </div>
      )} */}
      {/* {info && info.tel && (
        <>
          <div
            className=""
            style={{
              position: "fixed",
              bottom: "50%",
              right: 0,
            }}
          >
            <button
              className="btn rent-outline-color"
              data-toggle="modal"
              data-target="#requestCall"
              style={{
                transformOrigin: "bottom right",
                transform: "rotate(-90deg) translateX(100%)",
              }}
            >
              Cere un apel
            </button>
          </div>
          <div
            className="phone"
            style={{
              position: "fixed",
              bottom: 120,
              right: 20,
            }}
          >
            <a
              className="text-decoration-none d-md-none"
              href={`https://wa.me/${info.tel}`}
            >
              <Whatsapp width={50} height={50} />
            </a>
          </div>
          <div
            className="phone"
            style={{
              position: "fixed",
              bottom: 50,
              right: 20,
            }}
          >
            <a
              className="text-decoration-none d-md-none"
              href={`viber://chat?number=%2B${info.tel}`}
            >
              <Viber width={50} height={50} />
            </a>
          </div>
        </>
      )} */}
      <Footer
        facebook={info ? info.facebook : null}
        instagram={info ? info.instagram : null}
        linkedin={info ? info.linkedin : null}
        street={info ? info.street : null}
        tel={info ? info.tel : null}
        email={info ? info.email : null}
      />

      {/* <div
        className="modal fade"
        id="requestCall"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="requestCallLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="requestCallLabel">
                Cum să vă contactăm?
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body px-3 px-md-5">
              {contactStatus === "loading" ? (
                <Loader style={{ minHeight: 200 }} />
              ) : contactStatus === "success" ? (
                <h4 className="text-success">
                  Mesajul dvs a fost trimis. Vom reveni curand.
                </h4>
              ) : contactStatus === "error" ? (
                <div className="text-danger">
                  A aparut o eroare. Va rugam incercati mai tarziu sau
                  contactati-ne.
                </div>
              ) : (
                <>
                  <div className="row mt-3">
                    <div className="col-3">
                      <label htmlFor="name">
                        Numele <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-9">
                      <input
                        className="w-100 search-input p-2"
                        type="text"
                        id="name"
                        name="name"
                        ref={name}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3">
                      <label htmlFor="tel">
                        Telefon <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-9">
                      <input
                        className="w-100 search-input p-2"
                        type="tel"
                        id="tel"
                        name="tel"
                        ref={tel}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3">
                      <label htmlFor="email">
                        Email <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-9">
                      <input
                        className="w-100 search-input p-2"
                        type="email"
                        id="email"
                        name="email"
                        ref={email}
                      />
                    </div>
                  </div>
                </>
              )}

              {contactStatus === "invalid" && (
                <div className=" mt-2 text-center">
                  <span className="text-danger">
                    Vă rugam să completati toate campurile.
                  </span>
                </div>
              )}

              {contactStatus === "invalid email" && (
                <div className=" mt-2 text-center">
                  <span className="text-danger">
                    Vă rugam să indicati un email corect.
                  </span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                Anulează
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleContactSubmit}
                // data-dismiss="modal"
                // onClick={() => setPropertyIdToDelete(null)}
              >
                Trimite
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default UserLayout;
