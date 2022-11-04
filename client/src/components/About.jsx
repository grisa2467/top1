import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import aboutUsImg from "../assets/img/about-us_bg@2x.jpg";
const About = () => {
  const { t } = useTranslation();
  return (
    <div className="container">
      <div className="row">
        <div className="container blog-article">
          <div className="img-sharp-shadow float-left mr-5 mb-4">
            <img className="img-fluid" src={aboutUsImg} alt="About us" />
          </div>
          <h2 className="text-primary font-weight-bold">{t("aboutUs")}</h2>
          <p>
            Top Estate oferă consultație imobiliară personalizată, adaptată
            nevoilor clienților. Ne propunem să oferim clienților noștri cea mai
            reușită experiență, atunci când vine vorba de o tranzacție
            imobiliară, fie ea vânzare, cumpărare, sau închiriere.
          </p>
          <p>
            Datoria noastră este să găsim proprietatea ce reprezintă clientul,
            combinația perfectă între cerințele clientului, preț, locație și
            facilități. Experiența și profesionalismul specialiștilor noștri
            imobiliari îi fac capabili să acorde consultanță de cea mai bună
            calitate.
          </p>

          <Link to="/despre">Mai multe detalii...</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
