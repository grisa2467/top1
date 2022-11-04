import React, { useEffect } from "react";
import aboutUsImg from "../assets/img/about-us_bg@2x.jpg";
import BlogCard from "./BlogCard";

const BlogArticle = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="my-3">
      <div className="mt-5">
        <div className="container blog-article">
          <div className="img-sharp-shadow float-left mr-5 mb-4">
            <img className="img-fluid" src={aboutUsImg} alt="About us" />
          </div>
          <h2 className="text-primary font-weight-bold">Despre noi</h2>
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
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum.
          </p>
          <p>
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
            elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
            magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
            justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
            takimata sanctus est Lorem ipsum dolor sit amet.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua.
          </p>
        </div>
      </div>

      <div className="mt-5 py-5" style={{ backgroundColor: "#F9FBFF" }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h2 className="text-primary underline">Articole Similare</h2>
              </div>
            </div>
            <div className="col-12 mt-4">
              <div className="row g-4">
                <div className="col-lg-4 col-md-6">
                  <BlogCard />
                </div>
                <div className="col-lg-4 col-md-6">
                  <BlogCard type="sell" />
                </div>
                <div className="col-lg-4 col-md-6">
                  <BlogCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle;
