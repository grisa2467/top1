import React from "react";
import { useEffect, useState, useRef } from "react";
const STATUSES = {
  PENDING: "pending",
  LOADED: "loaded",
};
const PropertyDetailsForm = ({
  offerTypeId,
  propertyTypeId,
  selectedDetails,
}) => {
  const [status, setStatus] = useState(STATUSES.PENDING);
  const details = useRef([]);
  // const selectedDetails = useRef([]);
  useEffect(() => {
    const requestUrl = `${window.location.origin}/api/details?offerTypeId=${offerTypeId}&propertyTypeId=${propertyTypeId}`;
    const getDetails = async () => {
      const request = await fetch(requestUrl);
      const _details = await request.json();
      details.current = _details;
      selectedDetails.current = _details
        // .filter((item) => item.details.detailOptions.length)
        .map((item) => {
          return {
            required: item.required,
            id: item.detailId,
            selectedValue: null,
          };
        });
      setStatus(STATUSES.LOADED);
    };

    setStatus(STATUSES.PENDING);
    getDetails();
  }, [offerTypeId, propertyTypeId, selectedDetails]);

  const loading = <h2>LOADING...</h2>;
  if (status === STATUSES.PENDING) return loading;
  return (
    <div>
      <h2>Caracteristici</h2>
      <div className="row g-4">
        {details.current.map((detail) => (
          <div className="col-4" key={detail.detailId}>
            {detail.details.detailOptions.length ? (
              <div>
                <label htmlFor={detail.detailId}>
                  {detail.details.name}
                  {detail.details.units ? `, ${detail.details.units}` : ""}
                  {detail.required ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </label>
                <select
                  name={"_d" + detail.detailId}
                  id={detail.detailId}
                  className="d-block w-100 mt-1 form-input form-input-bg px-3 py-2"
                  onChange={(e) => {
                    selectedDetails.current = selectedDetails.current.map(
                      (selectedItem) => {
                        if (selectedItem.id === detail.detailId) {
                          return {
                            ...selectedItem,
                            selectedValue:
                              +e.target.value === -1
                                ? null
                                : `i${+e.target.value}`,
                          };
                        }
                        return selectedItem;
                      }
                    );
                  }}
                >
                  <option value={-1}>---</option>
                  {detail.details.detailOptions.map(({ options: opt }) => (
                    <option key={opt.id} value={"_o" + opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor={detail.detailId}>
                  {detail.details.name}
                  {detail.details.units ? (
                    detail.details.units === "m2" ? (
                      <>
                        {", "}m<sup>2</sup>
                      </>
                    ) : (
                      `, ${detail.details.units}`
                    )
                  ) : (
                    ""
                  )}
                  {detail.required ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </label>
                <input
                  type="text"
                  id={detail.detailId}
                  name={"_d" + detail.detailId}
                  className="mt-1 w-100 form-input form-input-bg px-3 py-2"
                  onChange={(e) => {
                    selectedDetails.current = selectedDetails.current.map(
                      (selectedItem) => {
                        if (selectedItem.id === detail.detailId) {
                          return {
                            ...selectedItem,
                            selectedValue: +e.target.value
                              ? +e.target.value
                              : null,
                          };
                        }
                        return selectedItem;
                      }
                    );
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyDetailsForm;
