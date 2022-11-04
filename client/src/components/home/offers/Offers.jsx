import React, { useRef, useState } from "react";
import { useEffect } from "react";
import FlickitySlider from "../../FlickitySlider";
import Loader from "../../Loader";
import PropertyCard from "../../PropertyCard";
import SeeAllButton from "../../SeeAllButton";
import { fetchProperties } from "../../../serverApi";

const Offers = () => {
  const flickity = useRef(null);
  const [status, setStatus] = useState("idle");
  const properties = useRef([]);
  useEffect(() => {
    const getProperties = async () => {
      setStatus("loading");
      const response = await fetchProperties(null, null, {
        limit: 6,
      });
      properties.current = response.properties;

      setStatus("loaded");
    };

    getProperties();
  }, []);
  if (status !== "loaded") return <Loader />;
  const data = properties.current.map((property) => (
    <div
      key={property.id}
      id={`i${property.id}`}
      className="col-xxl-4 col-md-6 col-12 mx-3 py-5 mb-3"
    >
      <PropertyCard {...property} />
    </div>
  ));
  return (
    <div className="container">
      <div className="text-center">
        <h2 className="text-primary underline font-weight-bold pt-4">
          OFERTE FIERBINȚI
        </h2>
        <p className="mt-3">Comision 0% pentru cumpărători și locatari</p>
      </div>
      <div className="hot-offers">
        <FlickitySlider
          flickity={flickity}
          data={data}
          options={{
            autoPlay: 4000,
            draggable: true,
          }}
        />
      </div>
      {/* <div className="row gy-4 mt-3">
        <div className="col-md-6 col-xl-4">
          <PropertyCard type="sell" />
        </div>
        <div className="col-md-6 col-xl-4">
          <PropertyCard type="rent" />
        </div>
        <div className="col-md-6 col-xl-4">
          <PropertyCard type="sell" />
        </div>
        <div className="d-none d-md-block col-md-6 col-xl-4">
          <PropertyCard type="sell" />
        </div>
        <div className="d-none d-md-block col-md-6 col-xl-4">
          <PropertyCard type="rent" />
        </div>
        <div className="d-none d-md-block col-md-6 col-xl-4">
          <PropertyCard type="sell" />
        </div>
      </div> */}

      <div className="mt-4 text-center">
        <SeeAllButton to="/apartamente" />
      </div>
    </div>
  );
};

export default Offers;
