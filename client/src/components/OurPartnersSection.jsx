import React from "react";
import FlickitySlider from "./FlickitySlider";
import dansicons from "../assets/img/partners/dansicons-min.jpg";
import amic from "../assets/img/partners/amic-min.png";
import aridon from "../assets/img/partners/aridon-min.png";
import exfactor from "../assets/img/partners/exfactor-min.jpg";
import maib from "../assets/img/partners/maib-min.png";
import micb from "../assets/img/partners/micb-min.jpg";
import stayer from "../assets/img/partners/stayer-min.jpg";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
const partnerImgs = [dansicons, exfactor, amic, micb, aridon, maib, stayer];
const OurPartnersSection = () => {
  const { t } = useTranslation();
  const flickity = useRef(null);
  const data = partnerImgs.map((src, i) => (
    <div key={i} className="mr-4">
      <img alt="temp" data-flickity-lazyload-src={src} />
    </div>
  ));
  return (
    <div className="our-partners pb-4">
      <div className="container py-5  text-center">
        <h2 className="text-white underline font-weight-bold pb-2">
          {t("ourPartners")}
        </h2>
        <p className="text-white mt-4 ">
          Semnul notei de calitate este determinat de partenerii proprietății
          din pozițiile importante din această nișă
        </p>
        <div className="mt-4">
          <FlickitySlider data={data} flickity={flickity} />
        </div>
      </div>
    </div>
  );
};

export default OurPartnersSection;
