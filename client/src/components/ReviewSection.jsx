import React, { useRef } from "react";
import ReviewCard from "./ReviewCard";
import tempImg from "../assets/img/face1.jpg";
import FlickitySlider from "./FlickitySlider";
const ReviewSection = () => {
  const flickity = useRef(null);
  const data = [
    <div className="mr-3" style={{ width: 430 }}>
      <ReviewCard
        text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna"
        name="John Doe"
        image={tempImg}
      />
    </div>,

    <div className="mr-3" style={{ width: 430 }}>
      <ReviewCard
        text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna"
        name="John Doe"
        image={tempImg}
      />
    </div>,

    <div className="mr-3" style={{ width: 430 }}>
      <ReviewCard
        text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna"
        name="John Doe"
        image={tempImg}
      />
    </div>,
  ];

  return (
    <div className="reviews">
      <div className="container py-5">
        <div className="text-center">
          <h2 className="text-white underline font-weight-bold">RECENZII</h2>
          <p className="text-white mt-1">Ce spun clientii nostri</p>
        </div>
        <div className="my-3">
          <FlickitySlider
            data={data}
            flickity={flickity}
            options={{
              initialIndex: data.length < 6 && data.length > 1 ? 1 : 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
