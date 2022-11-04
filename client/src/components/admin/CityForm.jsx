import React, { useEffect, useRef } from "react";
import { useState } from "react";

const STATUSES = {
  PENDING: "pending",
  LOADED: "loaded",
};
const CityForm = ({ selectedRegion, setSelectedCity }) => {
  const [status, setStatus] = useState(STATUSES.PENDING);
  const cities = useRef([]);
  useEffect(() => {
    const requestUrl = `${window.location.origin}/api/cities?regionId=${selectedRegion}`;
    const getDetails = async () => {
      const request = await fetch(requestUrl);
      const _resp = await request.json();
      cities.current = _resp.cities;
      setStatus(STATUSES.LOADED);
    };

    setStatus(STATUSES.PENDING);
    getDetails();

    return () => {
      setSelectedCity(null);
    };
  }, [selectedRegion, setSelectedCity]);

  const loading = <h2>LOADING...</h2>;
  if (status === STATUSES.PENDING) return loading;

  return (
    <div>
      <label htmlFor="city" className="form-label">
        Orasul <span className="text-danger">*</span>
      </label>
      <select
        id="city"
        name="city"
        className="d-block w-100 form-input form-input-bg px-3 py-2"
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="-1">---</option>
        {cities.current.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CityForm;
