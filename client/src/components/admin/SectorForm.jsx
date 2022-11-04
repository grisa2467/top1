import React, { useEffect, useRef } from "react";
import { useState } from "react";

const STATUSES = {
  PENDING: "pending",
  LOADED: "loaded",
};
const SectorForm = ({ selectedCity, setSelectedSector }) => {
  const [status, setStatus] = useState(STATUSES.PENDING);
  const sectors = useRef([]);
  useEffect(() => {
    const requestUrl = `${window.location.origin}/api/sectors?cityId=${selectedCity}`;
    const getDetails = async () => {
      const request = await fetch(requestUrl);
      const _resp = await request.json();
      sectors.current = _resp.sectors;
      setStatus(STATUSES.LOADED);
    };

    setStatus(STATUSES.PENDING);
    getDetails();

    return () => {
      setSelectedSector(null);
    };
  }, [selectedCity, setSelectedSector]);

  const loading = <h2>LOADING...</h2>;
  if (status === STATUSES.PENDING) return loading;

  return (
    <div>
      <label htmlFor="sector" className="form-label">
        Sectorul <span className="text-danger">*</span>
      </label>
      <select
        id="sector"
        name="sector"
        className="d-block w-100 form-input form-input-bg px-3 py-2"
        onChange={(e) => setSelectedSector(e.target.value)}
      >
        <option value="-1">---</option>
        {sectors.current.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SectorForm;
