import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReactComponent as FacebookIcon } from "../../../assets/icons/circle-facebook.svg";
import { ReactComponent as InstagramIcon } from "../../../assets/icons/instagram-circle.svg";
import { ReactComponent as LinkedIn } from "../../../assets/icons/linkedin-circle.svg";
const Footer = ({ facebook, instagram, linkedin, street, tel, email }) => {
  const { t } = useTranslation();
  return (
    <footer className="text-white footer">
      <div className="container py-5 d-flex align-items-start align-items-lg-center justify-content-between flex-column flex-lg-row">
        <div
          className="align-self-stretch d-flex flex-column justify-content-between"
          style={{ flex: 1 }}
        >
          <h3 className="font-weight-bold">TOPESTATE</h3>
          <div style={{ color: "#B1B1B1" }}>
            TOPESTATE - companie imobiliară care activează cu succes pe piața
            imobiliară din Republica Moldova.
          </div>
          <div className="mb-0 d-flex mt-3">
            {facebook && (
              <a
                className="text-decoration-none"
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon height={36} width={36} />
              </a>
            )}

            {instagram && (
              <div className="ml-3">
                <a
                  className="text-decoration-none"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon height={36} width={36} />
                </a>
              </div>
            )}

            {linkedin && (
              <div className="ml-3">
                <a
                  className="text-decoration-none"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedIn height={36} width={36} />
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-between mt-5 mt-lg-0">
          <div className="ml-lg-3">
            <h6 className="font-weight-bold">{t("sell")}</h6>
            <div className="font-size-small">
              <p>
                <Link
                  className="text-white text-decoration-none"
                  to={{
                    pathname: "/apartamente",
                    search: "?offerType=5",
                  }}
                >
                  {t("apartments")}
                </Link>
              </p>

              <p>
                <Link
                  className="text-white text-decoration-none"
                  to={{
                    pathname: "/case",
                    search: "?offerType=5",
                  }}
                >
                  {t("houses")}
                </Link>
              </p>
              <p className="">
                <Link
                  className="text-white text-decoration-none"
                  to={{
                    pathname: "/spatii-comerciale",
                    search: "?offerType=5",
                  }}
                >
                  {t("commercialSpaces")}
                </Link>
              </p>
              <p className="mb-0">
                <Link
                  className="text-white text-decoration-none"
                  to={{
                    pathname: "/terenuri",
                    search: "?offerType=5",
                  }}
                >
                  {t("lands")}
                </Link>
              </p>
            </div>
          </div>
          <div className="ml-5 align-self-start pl-4 pl-lg-0">
            <h6 className="font-weight-bold">{t("rent")}</h6>
            <div className="font-size-small">
              <p>
                <Link
                  className="text-white text-decoration-none"
                  to={{
                    pathname: "/apartamente",
                    search: "?offerType=6",
                  }}
                >
                  {t("apartments")}
                </Link>
              </p>

              <p>
                <Link
                  className="text-white text-decoration-none"
                  to={{
                    pathname: "/case",
                    search: "?offerType=6",
                  }}
                >
                  {t("houses")}
                </Link>
              </p>
              <p className="mb-0">
                <Link
                  className="text-white text-decoration-none"
                  to={{
                    pathname: "/spatii-comerciale",
                    search: "?offerType=6",
                  }}
                >
                  {t("commercialSpaces")}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-self-start mt-5 mt-lg-0">
          <div className="ml-lg-5">
            <h6 className="font-weight-bold">Companie</h6>
            <div className="font-size-small">
              <p>
                <a href="/despre" className="text-white text-decoration-none">
                  {t("aboutUs")}
                </a>
              </p>
              {/* <p className="mb-0">Blog</p> */}
            </div>
          </div>
          <div className="ml-5 pl-4 pl-lg-0">
            <h6 className="font-weight-bold">{t("contacts")}</h6>
            <div className="font-size-small">
              {email && (
                <p>
                  <a className="text-white" href="mailto:office@topestate.md">
                    office@topestate.md
                  </a>
                </p>
              )}
              {tel && (
                <p>
                  <a
                    href={`tel:${tel.replace(" ", "")}`}
                    className="text-white"
                  >
                    {tel}
                  </a>
                </p>
              )}
              {street && <p className="mb-0">{street}</p>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
