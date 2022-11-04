import React, { useState } from "react";
import { useEffect } from "react";
import { ReactComponent as HeartIcon } from "../assets/icons/like.svg";

import cookies from "../getCookies";
const FavoriteLabel = ({ propertyId }) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    const favorites = cookies.get("favs");
    if (favorites) {
      setIsActive(favorites.includes(+propertyId));
    }
  }, []);

  return (
    <div
      className={`property-card__label heart-icon ${isActive ? "active" : ""}`}
      style={{
        top: 50,
        left: 10,
        pointerEvents: "unset",
        zIndex: 3,
      }}
      onClick={(e) => {
        e.preventDefault();

        const favorites = cookies.get("favs");
        if (!isActive)
          cookies.set("favs", [...favorites, propertyId], {
            path: "/",
          });
        else
          cookies.set(
            "favs",
            favorites.filter((i) => i !== propertyId),
            {
              path: "/",
            }
          );
        setIsActive(!isActive);
      }}
    >
      <HeartIcon width={20} height={20} />
    </div>
  );
};

export default FavoriteLabel;
