import React, { useEffect } from "react";
import aboutUsImg from "../../assets/img/about-us_bg@2x.jpg";
import BlogSection from "../home/blog";
import OurPartnersSection from "../OurPartnersSection";
import OurTeamSection from "../OurTeamSection";
import ReviewSection from "../ReviewSection";
import { useTranslation } from "react-i18next";
const AboutUsPage = () => {
  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="mt-5">
      <div className="container blog-article">
        <div className="img-sharp-shadow float-left mr-5 mb-4">
          <img className="img-fluid" src={aboutUsImg} alt="About us" />
        </div>
        <h2 className="text-primary font-weight-bold">{t("aboutUs")}</h2>
        <p>
          Top Estate oferă consultație imobiliară personalizată, adaptată
          nevoilor clienților. Ne propunem să oferim clienților noștri cea mai
          reușită experiență, atunci când vine vorba de o tranzacție imobiliară,
          fie ea vânzare, cumpărare, sau închiriere.
        </p>
        <p>
          Datoria noastră este să găsim proprietatea ce reprezintă clientul,
          combinația perfectă între cerințele clientului, preț, locație și
          facilități. Experiența și profesionalismul specialiștilor noștri
          imobiliari îi fac capabili să acorde consultanță de cea mai bună
          calitate.
        </p>
        <p>
          Prețuim calitatea și, din acest motiv, oferim servicii profesioniste,
          care să aducă un plus de valoare partenerilor noștri. Serviciul
          imobiliar nu înseamnă doar intermediere, de aceea oferim clienților
          noștri și consultanța necesară pentru a le asigura confortul în luarea
          unei decizii corecte.
        </p>
        <p>
          Vă invităm să facem împreună primii pași spre un parteneriat de lungă
          durată!
        </p>
      </div>
      <div className="mt-5">
        <OurPartnersSection />
      </div>
      {/* <div className="mt-5">
        <OurTeamSection />
      </div>
      <div className="mt-5">
        <ReviewSection />
      </div>
      <div className="my-5">
        <BlogSection />
      </div> */}
    </div>
  );
};

export default AboutUsPage;
