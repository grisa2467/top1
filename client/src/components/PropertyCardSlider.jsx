import React, { useEffect, useState, useRef } from "react";
import { fetchPropertyImages } from "../serverApi";
import FlickitySlider from "./FlickitySlider";
import Loader from "./Loader";
import { useHistory } from "react-router-dom";
const PropertyCardSlider = ({ propertyId }) => {
  const flickity = useRef(null);
  const flickityIsConfiged = useRef(false);
  const images = useRef([]);
  const [status, setStatus] = useState("loading");
  const history = useHistory();

  useEffect(() => {
    const getPropertyImages = async () => {
      setStatus("loading");
      images.current = await fetchPropertyImages(propertyId);
      setStatus("loaded");
    };
    getPropertyImages();
  }, []);
  useEffect(() => {
    if (flickity.current && !flickityIsConfiged.current) {
      flickity.current.on("staticClick", (e) => {
        history.push(`/property/${propertyId}`);
      });
      flickityIsConfiged.current = true;
    }
  });
  if (status === "loading") return <Loader style={{ minHeight: 250 }} />;
  const data = images.current.map((im, i) => {
    return (
      <img
        key={i}
        className="img-fluid w-100"
        data-flickity-lazyload-src={`https://i.simpalsmedia.com/999.md/BoardImages/320x240/${
          im.url.split("?")[0]
        }`}
      />
    );
  });
  return (
    <>
      {data.length === 0 ? (
        <img
          className="img-fluid w-100"
          src={"https://pngimg.com/uploads/house/house_PNG57.png"}
          alt="Properietate"
        />
      ) : (
        <FlickitySlider
          flickity={flickity}
          data={data}
          options={{
            pageDots: false,
            draggable: false,
          }}
        />
      )}
      {/* <img
        className="img-fluid w-100"
        src={
          // photoIds.length
          //   ? `https://i.simpalsmedia.com/999.md/BoardImages/320x240/${
          //       photoIds[0].url.split("?")[0]
          //     }`
          // :
          "https://pngimg.com/uploads/house/house_PNG57.png"
        }
        alt="Properietate"
      /> */}
    </>
  );
};

export default PropertyCardSlider;
