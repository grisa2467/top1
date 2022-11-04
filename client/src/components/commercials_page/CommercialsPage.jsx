import React, { useRef } from "react";
import ResultPage from "../ResultPage";
// import { ReactComponent as SearchIcon } from "../../assets/icons/ionic-search.svg";
// import { ReactComponent as EuroIcon } from "../../assets/icons/open-euro.svg";
// import { ReactComponent as RulerIcon } from "../../assets/icons/awesome-ruler.svg";
import PropertyCard from "../PropertyCard";
import { useEffect } from "react";
import { useState } from "react";
import { fetchProperties } from "../../serverApi";
const STATUSES = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
};

const offerTypes = [
  { id: 6, e999Id: 912, name: "Chirie", type: "rent" },
  { id: 5, e999Id: 776, name: "vânzare", type: "sell" },
];

// const roomTypes = [
//   {
//     name: "1",
//     searchIds: [1070, 1071],
//   },
//   {
//     name: "2",
//     searchIds: [1072],
//   },
//   {
//     name: "3",
//     searchIds: [1073],
//   },
//   {
//     name: "4+",
//     searchIds: [1074, 1075],
//   },
// ];
const CommercialsPage = (props) => {
  const sticky = useRef(null);
  const [status, setStatus] = useState(STATUSES.IDLE);
  const properties = useRef([]);
  const [offerTypeId, setOfferTypeId] = useState(
    props.location && props.location.state ? props.location.state.offerType : 6
  );
  // const filters = useRef([]);
  // const [roomFilterActiveButtons, setRoomFilterActiveButtons] = useState([]);
  // const [searchFilters, setSearchFilters] = useState([]);
  // const getProperties = async () => {
  //   setStatus(STATUSES.LOADING);
  //   const _props = await fetchProperties(27, offerTypeId);
  //   properties.current = _props;
  //   setStatus(STATUSES.LOADED);
  // };
  useEffect(() => {
    const _getProperties = async () => {
      setStatus(STATUSES.LOADING);
      const _props = await fetchProperties(30, offerTypeId);
      properties.current = _props;
      setStatus(STATUSES.LOADED);
    };
    _getProperties();
  }, [offerTypeId]); //es

  // const filterResults = () => {
  //   setStatus(STATUSES.LOADING);
  //   console.log(filters.current);
  //   setStatus(STATUSES.LOADED);
  // };
  // useEffect(() => {
  //   console.log(roomFilterActiveButtons);
  //   if (roomFilterActiveButtons.length) {
  //     filterResults();
  //   }
  // }, [roomFilterActiveButtons]);

  if (status === STATUSES.IDLE || status === STATUSES.LOADING) {
    return (
      <div className="is-loading" style={{ height: "100vh" }}>
        <div className="loader-bg">
          <div className="loader"></div>
        </div>
      </div>
    );
  }
  const color = (type) => (type === "sell" ? "sell-color" : "rent-color");
  const outlineColor = (type) =>
    type === "sell" ? "sell-outline-color" : "rent-outline-color";
  const filter = (
    <div
      className="border border-primary"
      style={{ borderRadius: 5 }}
      ref={sticky}
    >
      <div className="bg-primary text-white p-3">Găsește imobilul dorit</div>
      <div className="p-3 mt-2">
        {/* <div className="position-relative">
          <input
            className="w-100 search-input py-2 pr-5 pl-3"
            type="text"
            placeholder="Cuvant cheie"
          />
          <span className="position-absolute mr-3 input-right-icon">
            <SearchIcon />
          </span>
        </div> */}

        <div className="d-flex justify-content-between mt-3">
          {offerTypes.map((offerType) => (
            <div key={offerType.id} className="" style={{ width: "45%" }}>
              <button
                className={`btn ${
                  offerTypeId === offerType.id
                    ? color(offerType.type)
                    : outlineColor(offerType.type)
                } w-100`}
                style={{ fontSize: 13 }}
                onClick={() =>
                  offerTypeId === offerType.id
                    ? undefined
                    : setOfferTypeId(offerType.id)
                }
              >
                {offerType.name}
              </button>
            </div>
          ))}
        </div>

        {/* <div className="mt-3">
          <span className="font-weight-bold font-size-small">Nr de camere</span>
          <div className="d-flex justify-content-between">
            {roomTypes.map((t, i) => {
              const isActive = roomFilterActiveButtons.includes(i);
              return (
                <div className="w-25 px-1" key={i}>
                  <button
                    style={{ fontSize: 11 }}
                    className={`btn btn-${
                      isActive ? "" : "outline-"
                    }primary w-100`}
                    onClick={() => {
                      let tempArr = [];

                      if (isActive) {
                        setRoomFilterActiveButtons(
                          roomFilterActiveButtons.filter((f) => f !== i)
                        );

                        tempArr = filters.current;
                        t.searchIds.forEach((val) => {
                          tempArr = tempArr.filter((f) => f.value !== val);
                        });
                        filters.current = tempArr;
                      } else {
                        setRoomFilterActiveButtons([
                          ...roomFilterActiveButtons,
                          i,
                        ]);

                        t.searchIds.forEach((value) => {
                          tempArr.push({ id: 205, value });
                        });
                        filters.current.push(...tempArr);
                      }
                      // console.log(filters.current);
                      // filterResults();
                    }}
                  >
                    {t.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div> */}

        {/* <div className="mt-3">
          <span className="font-weight-bold font-size-small">Pret (euro)</span>
          <div className="d-flex mt-1">
            <div className="w-50 pr-1 position-relative">
              <input
                type="number"
                placeholder="de la"
                className="w-100 py-2 pl-4 pr-2 search-input"
              />

              <span className="position-absolute ml-2 input-left-icon">
                <EuroIcon />
              </span>
            </div>
            <div className="w-50 pl-1 position-relative">
              <input
                type="number"
                placeholder="pana la"
                className="w-100 py-2 pl-4 pr-2 search-input"
              />
              <span className="position-absolute ml-2 input-left-icon">
                <EuroIcon />
              </span>
            </div>
          </div>
        </div> */}

        {/* <div className="mt-3">
          <span className="font-weight-bold font-size-small">
            Suprafața totală (m<sup>2</sup>)
          </span>
          <div className="d-flex mt-1">
            <div className="w-50 pr-1 position-relative">
              <input
                type="number"
                placeholder="de la"
                className="w-100 py-2 pl-4 pr-2 search-input"
              />

              <span className="position-absolute ml-2 input-left-icon">
                <RulerIcon width={14} />
              </span>
            </div>
            <div className="w-50 pl-1 position-relative">
              <input
                type="number"
                placeholder="pana la"
                className="w-100 py-2 pl-4 pr-2 search-input"
              />

              <span className="position-absolute ml-2 input-left-icon">
                <RulerIcon width={14} />
              </span>
            </div>
          </div>
        </div> */}

        {/* <div className="mt-3">
          <span className="font-weight-bold font-size-small">Chisinau</span>
          <div>
            <input type="checkbox" className="w-15" />
            <label className="w-85">
              <div className="d-flex">
                <span className="pr-3 font-size-small">Aeroport</span>
                <span
                  className="overflow-hidden flex-grow-1 font-size-small"
                  style={{ letterSpacing: 4 }}
                >
                  ..........................................................
                </span>
                <span className="pl-3 font-size-small">16</span>
              </div>
            </label>
          </div>
          <div>
            <input type="checkbox" className="w-15" />
            <label className="w-85">
              <div className="d-flex">
                <span className="pr-3 font-size-small">Botanicaaa</span>
                <span
                  className="overflow-hidden flex-grow-1 font-size-small"
                  style={{ letterSpacing: 4 }}
                >
                  ..........................................................
                </span>
                <span className="pl-3 font-size-small">32</span>
              </div>
            </label>
          </div>
          <div>
            <input type="checkbox" className="w-15" />
            <label className="w-85">
              <div className="d-flex">
                <span className="pr-3 font-size-small">Ciocana</span>
                <span
                  className="overflow-hidden flex-grow-1 font-size-small"
                  style={{ letterSpacing: 4 }}
                >
                  ..........................................................
                </span>
                <span className="pl-3 font-size-small">2</span>
              </div>
            </label>
          </div>
        </div> */}
      </div>
    </div>
  );

  const results = (
    <div className="row gy-4">
      {properties.current.map((property) => (
        <div key={property.id} className="col-xxl-4 col-lg-6">
          <PropertyCard {...property} />
        </div>
      ))}
    </div>
  );

  return <ResultPage sticky={sticky} filter={filter} results={results} />;
};

export default CommercialsPage;
