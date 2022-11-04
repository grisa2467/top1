import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ApartmentCategoryImage from "../../../assets/img/category_apartment@2x.jpg";
import CommercialCategoryImage from "../../../assets/img/category_commercial@2x.jpg";
import HomeCategoryImage from "../../../assets/img/category_home@2x.jpg";
import LandCategoryImage from "../../../assets/img/category_land@2x.jpg";

const categories = [
  {
    name: "apartments",
    img: ApartmentCategoryImage,
    path: "/apartamente",
    id: 27,
  },
  {
    name: "houses",
    img: HomeCategoryImage,
    path: "/case",
    id: 28,
  },
  {
    name: "commercialSpaces",
    img: CommercialCategoryImage,
    path: "/spatii-comerciale",
    id: 30,
  },
  {
    name: "lands",
    img: LandCategoryImage,
    path: "/terenuri",
    id: 29,
  },
];
const HomePageCategories = () => {
  const { t } = useTranslation();
  return (
    <div className="home-page-categories">
      <div className="row g-0">
        {categories.map((item, i) => (
          <div className="col-xl-3 col-md-6" key={i}>
            <div className="overlay-on-hover position-relative h-100">
              <img
                className="h-100 w-100"
                style={{ objectFit: "cover" }}
                src={item.img}
                alt="Apartamente"
              />
              <div className="position-absolute home-page-categories__title text-white text-nowrap underline">
                {t(item.name)}
              </div>
              <div className="home-page-categories__overlay position-absolute  text-white">
                <div className="home-page-categories__overlay__bg position-absolute"></div>
                <div className="home-page-categories__overlay__text position-absolute text-nowrap">
                  {t(item.name)}
                </div>
                <div className="home-page-categories__buttons position-absolute d-flex w-100 justify-content-around">
                  <div className="left w-30">
                    <Link
                      className="btn rent-color w-100 py-2"
                      to={{
                        pathname: item.path,
                        search: `?propertyTypeId=${item.id}&offerType=6`,
                      }}
                    >
                      {t("rent").toUpperCase()}
                    </Link>
                  </div>
                  <div className="right w-30">
                    <Link
                      className="btn sell-color w-100 py-2"
                      to={{
                        pathname: item.path,
                        search: `?propertyTypeId=${item.id}&offerType=5`,
                      }}
                    >
                      {t("sell").toUpperCase()}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageCategories;
