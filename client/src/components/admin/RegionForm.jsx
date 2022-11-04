import React, { useEffect, useRef } from "react";
import { useState } from "react";

const STATUSES = {
  PENDING: "pending",
  LOADED: "loaded",
};

const RegionForm = ({ setSelectedRegion }) => {
  const [status, setStatus] = useState(STATUSES.PENDING);
  const regions = useRef([]);
  useEffect(() => {
    const requestUrl = `${window.location.origin}/api/regions`;
    const getDetails = async () => {
      const request = await fetch(requestUrl);
      const _resp = await request.json();
      regions.current = _resp.regions;
      setStatus(STATUSES.LOADED);
    };

    setStatus(STATUSES.PENDING);
    getDetails();
  }, []);

  const loading = <h2>LOADING...</h2>;
  if (status === STATUSES.PENDING) return loading;

  return (
    <div>
      <label htmlFor="region" className="form-label">
        Regiunea <span className="text-danger">*</span>
      </label>
      <select
        id="region"
        name="region"
        className="d-block w-100 form-input form-input-bg px-3 py-2"
        onChange={(e) => setSelectedRegion(e.target.value)}
      >
        <option value="-1">---</option>
        {regions.current.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionForm;
