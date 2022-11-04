import React from "react";
import { useRef } from "react";
import { useEffect, useState } from "react";

const STATUSES = {
  PENDING: "pending",
  LOADED: "loaded",
};
const PropertyUtilitiesForm = ({
  offerTypeId,
  propertyTypeId,
  selectedUtilities,
}) => {
  const [status, setStatus] = useState(STATUSES.PENDING);
  const utilities = useRef([]);
  // const selectedUtilities = useRef([]);
  useEffect(() => {
    const requestUrl = `${window.location.origin}/api/utilities?offerTypeId=${offerTypeId}&propertyTypeId=${propertyTypeId}`;
    const getUtilities = async () => {
      const request = await fetch(requestUrl);
      const _utilities = await request.json();
      utilities.current = _utilities;
      setStatus(STATUSES.LOADED);
    };

    setStatus(STATUSES.PENDING);
    getUtilities();
  }, [offerTypeId, propertyTypeId]);

  const loading = <h2>LOADING...</h2>;
  if (status === STATUSES.PENDING) return loading;
  return (
    <div>
      <h2>Adaugator</h2>
      <div className="row">
        {utilities.current.map((utility) => (
          <div key={utility.id} className="col-4">
            <input
              type="checkbox"
              name={'_u'+utility.id}
              id={utility.id}
              onChange={() => {
                const utilityId = utility.id;
                selectedUtilities.current.includes(utilityId)
                  ? (selectedUtilities.current = selectedUtilities.current.filter(
                      (item) => item !== utilityId
                    ))
                  : selectedUtilities.current.push(utilityId);
              }}
            />
            <label htmlFor={utility.id} className="ml-2">
              {utility.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyUtilitiesForm;
