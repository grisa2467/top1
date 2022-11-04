import React, { useRef, useState, useEffect } from "react";
import { fetchProperties } from "../serverApi";
import FlickitySlider from "./FlickitySlider";
import Loader from "./Loader";
import PropertyCard from "./PropertyCard";
const SimilarOffers = ({ price, location }) => {
  const flickity = useRef(null);
  const [status, setStatus] = useState("idle");
  const properties = useRef([]);
  useEffect(() => {
    const getProperties = async () => {
      setStatus("loading");
      const response = await fetchProperties(null, null, {
        limit: 6,
        minPrice: price - 10000,
        maxPrice: price + 10000,
        l: location,
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
      className="mx-4 py-2"
      style={{ width: 300 }}
    >
      <PropertyCard {...property} />
    </div>
  ));

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="text-center">
            <h2 className="text-primary underline">Oferte Similare</h2>
          </div>
        </div>
        <div className="col-12 mt-4">
          <FlickitySlider
            flickity={flickity}
            data={data}
            options={{
              autoPlay: 1500,
              prevNextButtons: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SimilarOffers;
