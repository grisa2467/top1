import React from "react";
import Flickity from "react-flickity-component";
import "flickity/dist/flickity.min.css";
import "flickity-fullscreen";

Flickity.prototype._touchActionValue = "pan-y pinch-zoom";

const FlickitySlider = ({ data, options, flickity }) => {
  return (
    <Flickity
      reloadOnUpdate
      flickityRef={(c) => (flickity.current = c)}
      options={{
        ...options,
        wrapAround: data.length > 5,
        lazyLoad: 2,
      }}
      className="carousel-f"
    >
      {data}
    </Flickity>
  );
};

export default FlickitySlider;
