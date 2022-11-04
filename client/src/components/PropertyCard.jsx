import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReactComponent as LocationIcon } from "../assets/icons/material-location-on.svg";
import { ReactComponent as HotelIcon } from "../assets/icons/material-hotel.svg";
import { ReactComponent as RulerIcon } from "../assets/icons/awesome-ruler.svg";
import { ReactComponent as BuildingIcon } from "../assets/icons/awesome-building.svg";
import { ReactComponent as DestinationIcon } from "../assets/icons/arrow-up-right.svg";
import { ReactComponent as BathIcon } from "../assets/icons/bath-tub.svg";
import FavoriteLabel from "./FavoriteLabel";
import PropertyCardImages from "./PropertyCardSlider";
// import { ReactComponent as HeartIcon } from "../assets/icons/like.svg";

const PropertyCard = ({
  offerTypeId,
  id: propertyId,
  street,
  houseNr,
  city,
  photoIds,
  sector,
  price,
  oldPrice,
  propertyTypeId,
  from,
  priority,
  ...props
}) => {
  const { t } = useTranslation();
  // const [status, setStatus] = useState('loading')
  const color = +offerTypeId === 5 ? "sell-color" : "rent-color";

  const details = props.details;

  const surface = details.find((d) => d.id === 210);
  const tsurface = details.find((d) => d.id === 222);
  const rooms = details.find((d) => d.id === 205);
  const totalLvls = details.find((d) => d.id === 207);
  const level = details.find((d) => d.id === 206);
  const nivs = details.find((d) => d.id === 219);
  const cdest = details.find((d) => d.id === 226);
  const tdest = details.find((d) => d.id === 224);
  const baths = details.find((d) => d.id === 216);
  // console.log(baths ? "4" === baths.value[0] : "");
  // console.log(props);
  if (baths) baths.value = baths.value[0] === "4" ? "4+" : baths.value;
  const state = {};
  if (from) state.from = from;
  return (
    <div className="text-decoration-none text-dark">
      <div className={`property-card ${priority ? "priority" : ""}`}>
        <div
          className={`property-card__label text-white ${color} px-3 py-1`}
          style={{ zIndex: 3 }}
        >
          {+offerTypeId === 5
            ? t("sell").toUpperCase()
            : t("rent").toUpperCase()}
        </div>
        {+oldPrice ? (
          <div
            className={`property-card__label right text-white bg-danger px-3 py-1 text-decoration-line-through`}
            style={{
              fontSize: 16,
              zIndex: 5,
            }}
          >
            € {oldPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        ) : (
          <></>
        )}
        {/* <div
          className={`property-card__label`}
          style={{
            top: 50,
            left: 10,
            pointerEvents: "unset",
            width: 30,
            height: 30,
          }}
        >
        </div> */}
        <FavoriteLabel propertyId={propertyId} />
        {/* <Link
          to={{
            pathname: `/property/${propertyId}`,
            state,
          }}
        >
          <div
            style={{
              height: "75%",
              width: "75%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}
          ></div>
        </Link> */}
        <div className="overflow-hidden property-card__image">
          <PropertyCardImages propertyId={propertyId} />
        </div>

        <Link
          to={{
            pathname: `/property/${propertyId}`,
            state,
          }}
          className="text-decoration-none text-dark"
        >
          <div className="p-3">
            <div className="">
              <div className="d-flex justify-content-between">
                <div className="">
                  <LocationIcon />
                  <span className="ml-2">
                    {`${street} ${houseNr}${
                      street ? "," : ""
                    } ${city}, ${sector}`}
                  </span>
                </div>
                <div className="align-self-stretch ml-2">
                  <div
                    className={`h-100 d-flex align-items-center font-size-small py-2 px-3 text-white ${color}`}
                    style={{ borderRadius: 5 }}
                  >
                    <span className="p-0 m-0 text-nowrap">
                      € {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 d-flex">
                {propertyTypeId === 27 ? (
                  <>
                    {rooms ? (
                      <div className="py-1 mr-2 pr-2 font-size-small details-border-separator">
                        <div className="d-flex align-items-center">
                          <HotelIcon className="mr-2" />
                          <div className="span">{rooms.value}</div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}

                    {surface ? (
                      <div className="py-1 mr-2 pr-2 font-size-small details-border-separator">
                        <div className="d-flex align-items-center">
                          <RulerIcon className="mr-2" />
                          <div className="span">
                            {surface.value} m<sup>2</sup>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {totalLvls && level ? (
                      <div className="py-1 mr-2 pr-2 font-size-small details-border-separator">
                        <div className="d-flex align-items-center">
                          <BuildingIcon className="mr-2" />
                          <div className="span">
                            {level.value}/{totalLvls.value}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {baths ? (
                      <div className="py-1 mr-2 pr-2 font-size-small">
                        <div className="d-flex align-items-center">
                          <BathIcon className="mr-2" height="20" width="20" />
                          <div className="span">{baths.value}</div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}

                {propertyTypeId === 28 ? (
                  <>
                    {nivs ? (
                      <div className="py-1 mr-2 pr-2 font-size-small details-border-separator">
                        <div className="d-flex align-items-center">
                          <BuildingIcon className="mr-2" />
                          <div className="span">{nivs.value}</div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {surface ? (
                      <div className="py-1 mr-2 pr-2 font-size-small details-border-separator ">
                        <div className="d-flex align-items-center">
                          <RulerIcon className="mr-2" />
                          <div className="span">
                            {surface.value} m<sup>2</sup>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {baths ? (
                      <div className="py-1 mr-2 pr-2 font-size-small">
                        <div className="d-flex align-items-center">
                          <BathIcon className="mr-2" height="20" width="20" />
                          <div className="span">{baths.value}</div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}

                {propertyTypeId === 30 ? (
                  <>
                    {cdest ? (
                      <div className="py-1 mr-2 pr-2 font-size-small details-border-separator">
                        <div className="d-flex align-items-center">
                          <DestinationIcon className="mr-2" />
                          <div className="span">{cdest.value}</div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {surface ? (
                      <div className="py-1 mr-2 pr-2 font-size-small details-border-separator">
                        <div className="d-flex align-items-center">
                          <RulerIcon className="mr-2" />
                          <div className="span">
                            {surface.value} m<sup>2</sup>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {baths ? (
                      <div className="py-1 mr-2 pr-2 font-size-small">
                        <div className="d-flex align-items-center">
                          <BathIcon className="mr-2" height="20" width="20" />
                          <div className="span">{baths.value}</div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}

                {propertyTypeId === 29 ? (
                  <>
                    {tdest ? (
                      <div className="py-1 mr-2 pr-2 font-size-small details-border-separator ">
                        <div className="d-flex align-items-center">
                          <DestinationIcon className="mr-2" />
                          <div className="span">{tdest.value}</div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {tsurface ? (
                      <div className="py-1 mr-2 pr-2 font-size-small ">
                        <div className="d-flex align-items-center">
                          <RulerIcon className="mr-2" />
                          <div className="span">
                            {tsurface.value} m<sup>2</sup>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
