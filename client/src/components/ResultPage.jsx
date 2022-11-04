import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { getPrevScroll } from "../features/breadcrumb/BreadcrumbSlice";
import { fetchAgent, fetchProperties } from "../serverApi";
import Loader from "./Loader";
import NoResults from "./NoResults";
import PropertyCard from "./PropertyCard";
import Filter from "./resultPageUtils";

const STATUSES = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
};

const pagenation = function (current, total) {
  const list = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      list.push(i);
    }
    return list;
  }
  let middle = current;
  while (middle + 1 > total) middle--;
  while (middle - 1 < 1) middle++;
  let i = middle - 1;
  while (i >= 1 && i <= middle + 1) {
    list.push(i);
    i++;
  }
  return list;
};
const RESULT_LIMIT = 12;
const ResultPage = ({ propertyType, ids, ...props }) => {
  const location = useLocation();
  const [sticky, setSticky] = useState();
  const [stickyHeight, setStickyHeight] = useState(1000);
  const [status, setStatus] = useState(STATUSES.LOADING);
  const prevScroll = useSelector(getPrevScroll);
  const [page, setPage] = useState(
    +new URLSearchParams(location.search).get("page") || 1
  );
  const properties = useRef([]);
  const filter = useRef(null);
  const agent = useRef(null);
  const totalNumberProperties = useRef(0);
  // const locations = useRef(null);
  const history = useHistory();

  useEffect(() => {
    // console.log(sticky.current);
    if (sticky) setStickyHeight(sticky.offsetHeight);
  }, [sticky]);
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const oldQuery = query.toString();
    if (!(page === 1 && !query.has("page"))) query.set("page", page);
    const newQuery = query.toString();
    if (oldQuery !== newQuery)
      history.push({
        pathname: location.pathname,
        search: "?" + newQuery,
      });
  }, [page, history, location.pathname, location.search]);

  // useEffect(() => {
  //   window.addEventListener("scroll", (e) => {
  //     scroll.current = window.pageYOffset;
  //     console.log(scroll.current);
  //   });
  //   return () => {
  //     window.removeEventListener("scroll", (e) => {});
  //   };
  // }, []);
  useEffect(() => {
    if (status === STATUSES.LOADED) {
      window.scrollTo(0, prevScroll);
      // if (location.state && location.state.fromId) {
      //   const item = document.querySelector(`#i${location.state.fromId}`);
      //   if (item) item.scrollIntoView();
      // } else window.scrollTo(0, 230);
    }
  }, [status]);
  useEffect(() => {
    // if (location.state && location.state.fromId) {
    //   console.log(location.state.fromId);
    //   const item = document.querySelector(`#i${location.state.fromId}`);

    //   if (item) item.scrollIntoView();
    // } else window.scrollTo(0, 230);
    const query = new URLSearchParams(location.search);
    if (!(props && props.match && props.match.params && props.match.params.id))
      agent.current = null;

    // console.log(query.get("offerType"));
    const _getProperties = async () => {
      setStatus(STATUSES.LOADING);
      // console.log(location);
      const data = {};
      for (const [param, value] of query.entries()) {
        // console.log(param, " ", value);
        data[param] = value;
      }
      // console.log(data);
      // console.log(query.entries());
      if (
        propertyType ||
        (props && props.match && props.match.params && props.match.params.id) ||
        ids
      ) {
        let offerType = +query.get("offerType") || null;
        if (props && props.match) {
          const agentId = props.match.params.id;
          // offerType = +query.get("offerType") || null;
          agent.current = await fetchAgent(agentId);
          data.userId = agentId;
        }
        if (ids) {
          data.ids = ids;
        }
        data.limit = RESULT_LIMIT;
        const { properties: _props, filterLocations } = await fetchProperties(
          propertyType || +query.get("propertyTypeId"),
          offerType,
          data
        );
        // locations.current = filterLocations
        const _locs = {};
        totalNumberProperties.current = 0;
        // let locsToCount;
        // if(query.has('l')) locsToCount = query.get('l').split('a')
        for (let i = 0; i < filterLocations.length; i++) {
          const {
            cityId,
            city: { name: cityName },
            sectorId,
            sector: { name: sectorName },
            propertiesPerSector,
          } = filterLocations[i];

          if (!_locs[cityId]) {
            _locs[cityId] = {
              name: cityName,
              sectors: [],
              propertiesPerCity: 0,
            };
          }
          if (!query.has("l"))
            totalNumberProperties.current += propertiesPerSector;
          else if (query.get("l").includes("" + sectorId))
            totalNumberProperties.current += propertiesPerSector;
          _locs[cityId].propertiesPerCity += propertiesPerSector;
          _locs[cityId].sectors.push({
            name: sectorName,
            propertiesPerSector,
            id: sectorId,
          });
        }

        if (page > Math.ceil(totalNumberProperties.current / RESULT_LIMIT)) {
          setPage(Math.ceil(totalNumberProperties.current / RESULT_LIMIT));
        }

        filter.current = (
          <Filter
            {...{
              setSticky,
              propertyTypeId: propertyType || +query.get("propertyTypeId"),
              location,
              history,
              filterLocations: _locs,
              totalNumberProperties: totalNumberProperties.current,
              agent: agent.current ? agent.current.profile : null,
            }}
          />
        );
        properties.current = _props;
      }
      //  else if(props && props.location && props.location.match && props.location.match.id){

      // }
      setStatus(STATUSES.LOADED);
    };
    _getProperties();
  }, [propertyType, location, ids]);

  const results = (
    <div className="row gy-4">
      {properties.current.map((property) => (
        <div
          key={property.id}
          id={`i${property.id}`}
          className="col-xxl-4 col-md-6"
        >
          <PropertyCard {...property} from={{ ...location }} />
        </div>
      ))}
    </div>
  );

  const pageList = () => {
    const total = Math.ceil(totalNumberProperties.current / RESULT_LIMIT);
    let pageNumbersArr = pagenation(page, total);
    if (total > 5) {
      if (pageNumbersArr[0] !== 1) {
        pageNumbersArr.splice(0, 0, 1);
        if (pageNumbersArr[1] !== 2) {
          pageNumbersArr.splice(1, 0, -1);
        }
      }

      if (pageNumbersArr[pageNumbersArr.length - 1] !== total) {
        pageNumbersArr.push(total);
        if (pageNumbersArr[pageNumbersArr.length - 2] !== total - 1) {
          pageNumbersArr.splice(pageNumbersArr.length - 1, 0, -2);
        }
      }
    }
    return pageNumbersArr;
  };
  if (status === STATUSES.LOADING) return <Loader />;
  return (
    <div className="container my-5">
      <div className="row">
        <div
          className="col-lg-3 position-lg-sticky mb-4 mb-lg-0"
          style={{ top: "5%", height: stickyHeight }}
        >
          {filter.current}
        </div>

        <div className="col-lg-9">
          {properties.current.length ? results : <NoResults />}

          <div className="mt-auto py-5 d-flex align-items-center justify-content-center">
            {pageList().map((i, position, list) => {
              const pageNumber = i;
              const isActive = pageNumber === page;
              const borderWidth = isActive ? 2 : 0;
              return (
                <button
                  key={pageNumber}
                  style={{
                    borderRadius: 5,
                    borderWidth,
                  }}
                  className={`${
                    page === pageNumber ? "border-primary" : "border-0"
                  } bg-transparent px-3 py-2 text-primary`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setPage(
                      pageNumber > 0
                        ? pageNumber
                        : pageNumber === -1
                        ? list[position + 1] - 1
                        : list[position - 1] + 1
                    );
                  }}
                >
                  {pageNumber > 0 ? pageNumber : "..."}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;

// import React, { useEffect, useState } from "react";

// const ResultPage = ({ sticky, filter, results }) => {
//   const [stickyHeight, setStickyHeight] = useState(200);
//   const properties = useRef([]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     setStickyHeight(sticky.current.offsetHeight);
//   }, [sticky]);
//   useEffect(()=>{

//   })
//   return (
//     <div className="container my-5">
//       <div className="row">
//         <div
//           className="col-lg-3 position-lg-sticky mb-4 mb-lg-0"
//           style={{ top: "5%", height: stickyHeight }}
//         >
//           {filter}
//         </div>

//         <div className="col-lg-9">{results}</div>
//       </div>
//     </div>
//   );
// };

// export default ResultPage;
