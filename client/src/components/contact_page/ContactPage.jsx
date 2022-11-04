import React, { useEffect } from "react";
import { ReactComponent as LongArrow } from "../../assets/icons/arrow-long.svg";
import { ReactComponent as GoogleChromeIcon } from "../../assets/icons/simple-googlechrome.svg";
import { ReactComponent as PhoneIcon } from "../../assets/icons/awesome-phone-alt.svg";
import { ReactComponent as EmailIcon } from "../../assets/icons/material-email.svg";
import { ReactComponent as MapMarkerIcon } from "../../assets/icons/awesome-map-marker-alt.svg";

import { ReactComponent as FacebookIcon } from "../../assets/icons/circle-facebook.svg";
import { ReactComponent as TwitterIcon } from "../../assets/icons/circle-twitter.svg";

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="mt-5 pt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            {/* <h2>Lorem ipsum dolor</h2>
            <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr</p> */}
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-lg-6 col-md-12 col-sm-6 ">
                    <input
                      className="w-100 search-input p-3"
                      type="text"
                      placeholder="Numele"
                    />
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-6 ">
                    <input
                      className="w-100 search-input p-3"
                      type="email"
                      placeholder="Adresa de email"
                    />
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-6 ">
                    <input
                      className="w-100 search-input p-3"
                      type="tel"
                      placeholder="Telefon"
                    />
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-6 ">
                    <input
                      className="w-100 search-input p-3"
                      type="text"
                      placeholder="Subiect"
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="w-100 search-input p-3"
                      style={{ height: "10em" }}
                      placeholder="Mesaj"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary mt-4 py-3 px-4"
                >
                  <span className="mr-3">Expediază</span>
                  <LongArrow />
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-6 pl-md-5 d-flex mt-5 mt-md-0 flex-md-column justify-content-md-around flex-wrap align-items-start">
            <div className="d-flex pr-3">
              <MapMarkerIcon />
              <div className="ml-4">
                <p className="font-weight-bold">Adresă</p>
                <p>Chișinău, Lev Tolstoi 27</p>
              </div>
            </div>
            <div className="d-flex pr-3">
              <EmailIcon />
              <div className="ml-4">
                <p className="font-weight-bold">Email</p>
                <p>office@topestate.md</p>
              </div>
            </div>
            <div className="d-flex pr-3">
              <PhoneIcon />
              <div className="ml-4">
                <p className="font-weight-bold">Telefon</p>
                <p>+373 68628686</p>
              </div>
            </div>
            <div className="d-flex pr-3">
              <GoogleChromeIcon />
              <div className="ml-4">
                <p className="font-weight-bold">Social Media</p>
                <div className="d-flex">
                  <div>
                    <FacebookIcon width={26} height={26} />
                  </div>
                  <div className="ml-2">
                    <TwitterIcon width={26} height={26} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <iframe
          title="contact-map"
          allow="geolocation"
          width="100%"
          height="600"
          frameborder="0"
          src="https://map.md/ro/street/523365500?number=64&embed=1#13.9/47.01635999999999/28.827770999999956/0/0"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
