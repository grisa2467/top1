import React, { useRef,useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

// const Marker = () => (
//   <div>
//     <div
//       className="rounded-circle"
//       style={{
//         height: 20,
//         width: 20,
//         transform: "translate(-50%, -50%)",
//         backgroundColor: "red",
//         opacity: 0.75,
//       }}
//     ></div>
//   </div>
// );

const GoogleMap = ({handleClickMapCoords}) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b2hhOTQxIiwiYSI6ImNsNzB2eWJtcjBpZmM0MG91MG82OXlpYngifQ.GOs17hviz34lILyXHr6Iqw';
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(28.830162656422033);
  const [lat, setLat] = useState(47.0197459926718);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (map.current) return;
      map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.addControl(
    new mapboxgl.NavigationControl());
      const marker = new mapboxgl.Marker({
        color: "#FF7201",
        draggable: true
      })
      .setLngLat([lng, lat])
      .addTo(map.current);

    marker.on("drag", function(e) {
      const marker = e.target;
      const coords = marker.getLngLat();
      console.log('position: ', coords);
      marker.setLngLat([coords.lng, coords.lat]);
      console.log('coords:',marker);
      handleClickMapCoords(marker.getLngLat());
    });

    map.current.on("click", function(e){
      const coords = e.lngLat.toArray();
      marker.setLngLat([coords[0], coords[1]]);
      console.log('new marker:',marker);
      handleClickMapCoords(marker.getLngLat());
    });
  });


  return (
    <div ref={mapContainer} className="map-container" style={{ height: "600px", width: "100%" }}></div>
    // <div style={{ height: "600px", width: "100%" }}>
    //   <GoogleMapReact
    //     onClick={_onClick}
    //     bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
    //     defaultCenter={defaultCenter.current}
    //     // onZoomAnimationEnd={(x) => {
    //     //   console.log(x);
    //     // }}
    //     defaultZoom={13}
    //   >
    //     <Marker lat={location.lat} lng={location.lng} />
    //   </GoogleMapReact>
    // </div>
  );
};

export default GoogleMap;
