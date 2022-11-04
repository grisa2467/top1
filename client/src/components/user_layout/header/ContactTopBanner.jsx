import React from "react";
import { ReactComponent as FacebookIcon } from "../../../assets/icons/facebook-logo.svg";
import { ReactComponent as InstaIcon } from "../../../assets/icons/instagram-white.svg";
import { ReactComponent as LinkedinIcon } from "../../../assets/icons/linkedin-logo.svg";
import { ReactComponent as MapPinIcon } from "../../../assets/icons/white-map-pin.svg";
import { ReactComponent as TelIcon } from "../../../assets/icons/white-telephone.svg";

const ContactTopBanner = ({ facebook, instagram, linkedin, street, tel }) => {
  return (
    <div className="bg-primary">
      <div className="container d-flex justify-content-sm-between py-3 align-items-center">
        <div className="d-flex flex-column flex-sm-row">
          {instagram && (
            <div className="mr-3 mb-2 mb-sm-0">
              <a
                href={instagram}
                className="text-white text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstaIcon height={21} width={21} />
              </a>
            </div>
          )}
          {facebook && (
            <div className="mr-3 mb-2 mb-sm-0">
              <a
                href={facebook}
                className="text-white text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon height={21} width={21} />
              </a>
            </div>
          )}
          {linkedin && (
            <div className="mr-3 mb-2 mb-sm-0">
              <a
                href={linkedin}
                className="text-white text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon height={21} width={21} />
              </a>
            </div>
          )}
        </div>
        <div className="text-white d-flex flex-column flex-sm-row ml-3 ml-auto ml-sm-0">
          {street && (
            <div className="">
              <MapPinIcon />
              <span className="ml-2">{street}</span>
            </div>
          )}
          {tel && (
            <div className="ml-sm-5 mt-2 mt-sm-0">
              <TelIcon />
              <span className="ml-2">
                <a
                  href={`tel:${tel.replace(" ", "")}`}
                  className="text-white text-decoration-none"
                >
                  {tel}
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactTopBanner;
