import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as SearchIcon } from "../assets/icons/ionic-search.svg";
import { ReactComponent as EuroIcon } from "../assets/icons/open-euro.svg";
import { ReactComponent as RulerIcon } from "../assets/icons/awesome-ruler.svg";
import { ReactComponent as TelIcon } from "../assets/icons/primary-telephone.svg";
import { ReactComponent as AddIcon } from "../assets/icons/avatar-placeholder.svg";
import { ReactComponent as Whatsapp } from "../assets/icons/whatsapp.svg";
import { ReactComponent as Viber } from "../assets/icons/viber.svg";
const offerTypes = [
  { id: 6, e999Id: 912, name: "Chirie", type: "rent" },
  { id: 5, e999Id: 776, name: "Vânzare", type: "sell" },
];

const propertyTypes = [
  {
    name: "apartments",
    id: 27,
  },
  {
    name: "houses",
    id: 28,
  },
  {
    name: "commercialSpaces",
    id: 30,
  },
  {
    name: "lands",
    id: 29,
  },
];

const surfaceList = [
  0,
  10,
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  100,
  120,
  140,
  160,
  180,
  200,
  250,
  300,
  350,
  400,
  450,
  500,
  1000,
  1500,
  2000,
  2500,
  3000,
  3500,
  4000,
];
const priceList = [
  0,
  1000,
  2000,
  3000,
  4000,
  5000,
  6000,
  7000,
  8000,
  9000,
  10000,
  10000,
  15000,
  20000,
  25000,
  30000,
  35000,
  40000,
  45000,
  50000,
  55000,
  60000,
  65000,
  70000,
  75000,
  80000,
  85000,
  90000,
  95000,
  100000,
  100000,
  150000,
  200000,
  250000,
  300000,
  350000,
  400000,
  450000,
  500000,
  550000,
  600000,
  650000,
  700000,
  750000,
  800000,
  850000,
  900000,
  950000,
  1000000,
  2000000,
  3000000,
  4000000,
  5000000,
  6000000,
  7000000,
  8000000,
  9000000,
  10000000,
];
const filtersForPropertyType = (propertyTypeId) => {
  switch (propertyTypeId) {
    case 27:
      return [
        {
          name: "buildingType",
          id: "building",
          type: "checkbox",
          options: [
            {
              name: "new",
              id: "1068",
            },
            {
              name: "old",
              id: "1069",
            },
          ],
        },
        {
          name: "buildingState",
          id: "buildingState",
          type: "checkbox",
          options: [
            {
              name: "forDemolation",
              id: "1153",
            },
            {
              name: "individualDesign",
              id: "1154",
            },
            {
              name: "noReparation",
              id: "1155",
            },
            {
              name: "unfinished",
              id: "1156",
            },
            {
              name: "reparationNeeded",
              id: "1157",
            },
            {
              name: "grey",
              id: "1158",
            },
            {
              name: "white",
              id: "1159",
            },
            {
              name: "cosmeticReparation",
              id: "1160",
            },
            {
              name: "euroreparation",
              id: "1161",
            },
          ],
        },
        {
          name: "numberOfRooms",
          id: "rooms",
          type: "checkbox",
          options: [
            {
              name: "1",
              id: "1071",
            },
            {
              name: "2",
              id: "1072",
            },
            {
              name: "3",
              id: "1073",
            },
            {
              name: "4",
              id: "1074",
            },
            {
              name: "5+",
              id: "1075",
            },
          ],
        },
      ];
    case 28:
      return [
        {
          name: "houseType",
          id: "houseType",
          type: "checkbox",
          options: [
            {
              name: "house",
              id: "1175",
            },
            {
              name: "villa",
              id: "1176",
            },
            {
              name: "duplex",
              id: "1177",
            },
          ],
        },
      ];
    case 30:
      return [
        {
          name: "destination",
          id: "cdest",
          type: "radio",
          options: [
            {
              name: "industrial",
              id: "1199",
            },
            {
              name: "offices",
              id: "1196",
            },
            {
              name: "commercial",
              id: "1195",
            },
          ],
        },
      ];
    case 29:
      return [
        {
          name: "destination",
          id: "tdest",
          type: "checkbox",
          options: [
            {
              name: "agricol",
              id: "1193",
            },
            {
              name: "construction",
              id: "1194",
            },
          ],
        },
      ];
    default:
      break;
  }
};

const Filter = ({
  setSticky,
  propertyTypeId,
  location,
  history,
  filterLocations,
  totalNumberProperties,
  agent,
}) => {
  const { t } = useTranslation();
  const query = useRef(new URLSearchParams(location.search));

  const search = useRef(null);
  const minPrice = useRef(null);
  const maxPrice = useRef(null);
  const minSurface = useRef(null);
  const maxSurface = useRef(null);
  const locations = useRef(new Set());
  const rooms = useRef(new Set());
  const checkboxes = useRef({});

  useEffect(() => {
    query.current = new URLSearchParams(location.search);
  }, [propertyTypeId, location]);

  const handleCheckFilter = (active, id, filterId) => {
    if (active) {
      checkboxes.current[filterId].delete(id);
      // rooms.current.delete(id);
    } else {
      // rooms.current.add(id);
      checkboxes.current[filterId].add(id);
    }
    constructQuery({});
  };
  const constructQuery = ({ propertyTypeId, offerType, key, value }) => {
    if (propertyTypeId) {
      history.push({
        pathname: location.pathname,
        search: `?propertyTypeId=${propertyTypeId}`,
      });
    }
    if (offerType) {
      history.push({
        pathname: location.pathname,
        search: `?offerType=${offerType}${
          query.current.has("propertyTypeId")
            ? `&propertyTypeId=${query.current.get("propertyTypeId")}`
            : ""
        }`,
      });
      return;
    }

    const _a = Array.from(locations.current).join("a");
    // const _r = Array.from(rooms.current).join("r");

    const params = {
      s: search.current,
      minPrice: minPrice.current,
      maxPrice: maxPrice.current,
      minSurface: minSurface.current,
      maxSurface: maxSurface.current,
      l: _a,
      // rooms: _r,
    };
    Object.entries(checkboxes.current).forEach(([k, v]) => {
      const _r = Array.from(v).join("r");
      params[k] = _r;
    });

    if (key && value) params[key] = value;
    // for(const [param, value] of Object.entries(params))
    const oldQuery = query.current.toString();
    Object.entries(params)
      .filter(([_, value]) => value !== null)
      .forEach(([param, value]) => {
        if ("" + value !== "")
          query.current.set(
            param,
            encodeURIComponent(`${value}`.trim().toLowerCase())
          );
        else query.current.delete(param);
      });

    const newQuery = query.current.toString();

    if (newQuery !== oldQuery) {
      history.push({
        pathname: location.pathname,
        search: "?" + newQuery,
      });
    }
  };

  const color = (type) => (type === "sell" ? "sell-color" : "rent-color");
  const outlineColor = (type) =>
    type === "sell" ? "sell-outline-color" : "rent-outline-color";

  // console.log(location.pathname === "/favorite");
  return (
    <div
      className="border border-primary"
      style={{ borderRadius: 5 }}
      ref={(r) => setSticky(r)}
    >
      {agent || location.pathname === "/favorite" ? (
        <div className="p-3">
          {agent && (
            <div className="d-flex align-items-center">
              <div
                className=" overflow-hidden border border-primary"
                style={{ borderRadius: 5 }}
              >
                {agent.image ? (
                  <img
                    src={`https://i.simpalsmedia.com/999.md/BoardImages/320x240/${agent.image}`}
                    alt=""
                    style={{
                      height: 64,
                      width: 64,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <AddIcon width="64" height="64" />
                )}
              </div>

              <div className="ml-3 text-primary">
                <div>
                  <span className="font-weight-bold">
                    {agent.givenName} {agent.familyName}
                  </span>
                </div>
                <div className="mt-2">
                  <TelIcon width={20} height={20} />
                  <a href={`tel:+${agent.tel}`}>
                    <span className="ml-2">{`+373 ${agent.tel.substring(
                      3
                    )}`}</span>
                  </a>
                </div>
                <div className="mt-2">
                  <a href={`viber://chat?number=%2B${agent.tel}`} className="">
                    <Viber width={25} height={25} />
                    <span className="ml-2">Viber</span>
                  </a>
                </div>
                <div className="mt-2">
                  <Whatsapp width={25} height={25} />
                  <a className="ml-2" href={`https://wa.me/${agent.tel}`}>
                    Whatsapp
                  </a>
                </div>
              </div>
            </div>
          )}
          <div className="mt-3 d-flex flex-wrap">
            {propertyTypes.map((pt, i) => (
              <div key={i} className={`w-50 ${i % 2 === 0 ? "pr-2" : "pl-2"}`}>
                <div className="w-100 mt-2">
                  <button
                    className={`btn font-size-small ${
                      +query.current.get("propertyTypeId") === pt.id
                        ? "btn-primary"
                        : "btn-outline-primary"
                    } w-100`}
                    onClick={() => constructQuery({ propertyTypeId: pt.id })}
                  >
                    {t(pt.name)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="bg-primary text-white p-3">{t("searchUtils.title")}</div>
      <div className="p-3 mt-2">
        {/*  */}
        <div className="d-flex flex-column mt-3">
          {propertyTypeId ? (
            <>
              <div className="d-flex justify-content-between">
                {offerTypes.map((offerType) => (
                  <div key={offerType.id} className="" style={{ width: "45%" }}>
                    <button
                      className={`btn ${
                        +query.current.get("offerType") === offerType.id
                          ? color(offerType.type)
                          : outlineColor(offerType.type)
                      } w-100`}
                      style={{ fontSize: 13 }}
                      onClick={() =>
                        constructQuery({ offerType: offerType.id })
                      }
                    >
                      {t(offerType.type)}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <span className="font-weight-bold font-size-small">
                  {t("searchUtils.keyword")}
                </span>
                <div className="position-relative w-100">
                  <input
                    className="w-100 search-input py-2 pr-5 pl-3"
                    type="text"
                    maxLength="50"
                    placeholder={t("searchUtils.keyword")}
                    defaultValue={query.current.get("s") || null}
                    onChange={(e) => (search.current = e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        constructQuery({});
                      }
                    }}
                  />
                  <span
                    className="position-absolute mr-3 input-right-icon"
                    role="button"
                    onClick={() => constructQuery({})}
                  >
                    <SearchIcon />
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <span className="font-weight-bold font-size-small">
                  {t("searchUtils.price")} (euro)
                </span>
                <div className="d-flex mt-1">
                  <div className="w-50 pr-1 position-relative">
                    {/* <input
                      type="number"
                      placeholder="de la"
                      className="w-100 py-2 pl-4 pr-2 search-input"
                      defaultValue={query.current.get("minPrice") || null}
                      onChange={(e) => (minPrice.current = e.target.value)}
                    /> */}

                    <select
                      id="minPrice"
                      className="w-100 py-2 pr-2 search-input"
                      defaultValue={query.current.get("minPrice") || null}
                      onChange={(e) => {
                        minPrice.current = e.target.value;
                        constructQuery({});
                      }}
                    >
                      {priceList.map((p, i) => (
                        <option value={p} key={i}>
                          {p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} €
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-50 pl-1 position-relative">
                    {/* <input
                      type="number"
                      placeholder="pana la"
                      className="w-100 py-2 pl-4 pr-2 search-input"
                      defaultValue={query.current.get("maxPrice") || null}
                      onChange={(e) => (maxPrice.current = e.target.value)}
                    />
                    <span className="position-absolute ml-2 input-left-icon">
                      <EuroIcon />
                    </span> */}

                    <select
                      id="maxPrice"
                      className="w-100 py-2 pr-2 search-input"
                      defaultValue={
                        query.current.get("maxPrice") ||
                        priceList[priceList.length - 1]
                      }
                      onChange={(e) => {
                        maxPrice.current = e.target.value;

                        constructQuery({});
                      }}
                    >
                      {priceList.map((p, i) => (
                        <option value={p} key={i}>
                          {p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} €
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <span className="font-weight-bold font-size-small">
                  {`${t("searchUtils.totalSurface")} `}
                  {propertyTypeId !== 29 ? (
                    <>
                      (m<sup>2</sup>)
                    </>
                  ) : (
                    <>ha</>
                  )}
                </span>
                <div className="d-flex mt-1">
                  <div className="w-50 pr-1 position-relative">
                    <select
                      id="minSurface"
                      className="w-100 py-2 pr-2 search-input"
                      defaultValue={query.current.get("minSurface") || null}
                      onChange={(e) => {
                        minSurface.current = e.target.value;
                        constructQuery({});
                      }}
                    >
                      {surfaceList.map((p, i) => (
                        <option value={p} key={i}>
                          {p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </option>
                      ))}
                    </select>
                    {/* <input
                      type="number"
                      step="10"
                      placeholder={t("searchUtils.from")}
                      className="w-100 py-2 pl-4 pr-2 search-input"
                      defaultValue={query.current.get("minSurface") || null}
                      onChange={(e) => (minSurface.current = e.target.value)}
                    /> */}

                    {/* <span className="position-absolute ml-2 input-left-icon">
                      <RulerIcon width={14} />
                    </span> */}
                  </div>
                  <div className="w-50 pl-1 position-relative">
                    {/* <input
                      type="number"
                      step="10"
                      placeholder={t("searchUtils.to")}
                      className="w-100 py-2 pl-4 pr-2 search-input"
                      defaultValue={query.current.get("maxSurface") || null}
                      onChange={(e) => (maxSurface.current = e.target.value)}
                    />

                    <span className="position-absolute ml-2 input-left-icon">
                      <RulerIcon width={14} />
                    </span> */}
                    <select
                      id="maxSurface"
                      className="w-100 py-2 pr-2 search-input"
                      defaultValue={
                        query.current.get("maxSurface") ||
                        surfaceList[surfaceList.length - 1]
                      }
                      onChange={(e) => {
                        maxSurface.current = e.target.value;
                        constructQuery({});
                      }}
                    >
                      {surfaceList.map((p, i) => (
                        <option value={p} key={i}>
                          {p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {filtersForPropertyType(propertyTypeId).map((filter, i) => {
                if (filter.type === "checkbox") {
                  checkboxes.current[filter.id] = new Set();
                }
                return (
                  <div className="mt-3" key={i}>
                    <span className="font-weight-bold font-size-small">
                      {t(`searchUtils.${filter.name}`)}
                    </span>
                    {filter.type === "radio" ? (
                      <div className="d-flex flex-row flex-wrap">
                        {filter.options.map((option, i) => {
                          const isActive =
                            query.current.get(filter.id) === option.id;
                          return (
                            <div
                              className={`flex-grow-1 mt-2 ${
                                i !== filter.options.length - 1 ? "mr-3" : ""
                              }`}
                              key={i}
                            >
                              <button
                                className={`btn ${
                                  isActive
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                                } w-100 font-size-small`}
                                onClick={() =>
                                  isActive
                                    ? constructQuery({
                                        key: filter.id,
                                        value: "",
                                      })
                                    : constructQuery({
                                        key: filter.id,
                                        value: option.id,
                                      })
                                }
                              >
                                {t(`searchUtils.${option.name}`)}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : filter.type === "checkbox" ? (
                      <div className="d-flex flex-row flex-wrap">
                        {filter.options.map((option, i) => {
                          const _itemInSearch = query.current.get(filter.id);
                          let isActive = false;
                          if (
                            _itemInSearch &&
                            _itemInSearch.includes("" + option.id)
                          ) {
                            isActive = true;
                            // rooms.current.add("" + option.id);
                            checkboxes.current[filter.id].add("" + option.id);
                          }

                          return (
                            <div
                              className={`flex-grow-1 mt-2 ${
                                i !== filter.options.length - 1 ? "mr-3" : ""
                              }`}
                              key={i}
                            >
                              <button
                                className={`btn ${
                                  isActive
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                                } w-100 font-size-small`}
                                onClick={
                                  () =>
                                    handleCheckFilter(
                                      isActive,
                                      option.id,
                                      filter.id
                                    )
                                  // isActive
                                  //   ? constructQuery({
                                  //       key: filter.id,
                                  //       value: "",
                                  //     })
                                  //   : constructQuery({
                                  //       key: filter.id,
                                  //       value: option.id,
                                  //     })
                                }
                              >
                                {t(`searchUtils.${option.name}`)}
                                {/* {option.name} */}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <></>
                    )}
                    {/* {offerTypes.map((offerType) => (
                  <div key={offerType.id} className="" style={{ width: "45%" }}>
                    <button
                      className={`btn ${
                        (+query.current.get("offerType") || 6) === offerType.id
                          ? color(offerType.type)
                          : outlineColor(offerType.type)
                      } w-100`}
                      style={{ fontSize: 13 }}
                      onClick={() =>
                        constructQuery({ offerType: offerType.id })
                      }
                    >
                      {offerType.name}
                    </button>
                  </div>
                ))} */}
                  </div>
                );
              })}
              {filterLocations && (
                <>
                  <h6 className="mt-4">
                    Total rezultate gasite: {totalNumberProperties}
                  </h6>
                  {Object.entries(filterLocations).map(([cityId, city]) => {
                    return (
                      <div className="mt-2" key={cityId}>
                        <div className="font-weight-bold font-size-small">
                          <div className="d-flex">
                            <div>{city.name}</div>

                            <div className="ml-auto">
                              total: {city.propertiesPerCity}
                            </div>
                          </div>

                          {/* <div className="d-flex">
                          <span className="pr-3 font-size-small">
                            {city.name}
                          </span>
                          <span
                            className="overflow-hidden flex-grow-1 font-size-small"
                            style={{ letterSpacing: 4 }}
                          >
                            ....................................................................................................................
                          </span>
                          <span className="pl-3 font-size-small">
                            {city.propertiesPerCity}
                          </span>
                        </div> */}
                        </div>
                        {city.sectors.map((sector) => {
                          const _locs = query.current.get("l");

                          if (_locs && _locs.includes("" + sector.id))
                            locations.current.add("" + sector.id);
                          return (
                            <div className="mt-1" key={sector.id}>
                              <input
                                id={sector.id}
                                type="checkbox"
                                className=""
                                style={{ width: "5%" }}
                                defaultChecked={locations.current.has(
                                  "" + sector.id
                                )}
                                onChange={(e) => {
                                  e.target.checked
                                    ? locations.current.add("" + sector.id)
                                    : locations.current.delete("" + sector.id);

                                  constructQuery({});
                                }}
                              />
                              <label
                                htmlFor={sector.id}
                                style={{ width: "95%" }}
                                className="pl-3"
                              >
                                <div className="d-flex">
                                  <span className="pr-3 font-size-small">
                                    {sector.name}
                                  </span>
                                  <span
                                    className="overflow-hidden flex-grow-1 font-size-small"
                                    style={{ letterSpacing: 4 }}
                                  >
                                    ....................................................................................................................
                                  </span>
                                  <span className="pl-3 font-size-small">
                                    {sector.propertiesPerSector}
                                  </span>
                                </div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}
            </>
          ) : (
            ""
          )}
        </div>
        {/* {propertyTypeId ? (
          <div className="mt-3 text-center">
            <button
              className="btn btn-primary px-4 py-2"
              onClick={() => constructQuery({})}
            >
              {t("search")}
            </button>
          </div>
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
};

export default Filter;
