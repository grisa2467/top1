import React, { useState } from "react";
import { useEffect } from "react";
import ResultPage from "./components/ResultPage";

import cookies from "./getCookies";
const FavoritePropertiesPage = () => {
  const [ids, setIds] = useState(
    cookies.get("favs").length === 0 ? [-1] : cookies.get("favs")
  );

  useEffect(() => {
    cookies.addChangeListener((a) => {
      setIds(cookies.get("favs").length === 0 ? [-1] : cookies.get("favs"));
    });
  }, []);
  return <ResultPage ids={ids} />;
};

export default FavoritePropertiesPage;
