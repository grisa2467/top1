import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../../../assets/icons/awesome-home.svg";
import { selectPaths } from "../../../features/breadcrumb/BreadcrumbSlice";
import { useTranslation } from "react-i18next";
const Breadcrumb = () => {
  const location = useLocation();
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  const paths = useSelector(selectPaths);
  // useEffect(() => {
  //   dispatch(addPath("/apartamente"));
  // }, []);
  useEffect(() => {
    console.log(paths);
  }, [paths]);

  if (location.pathname === "/") {
    return <></>;
  }
  return (
    <div className="breadcrumb-bg d-flex align-items-center">
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-transparent mb-0 text-white">
            <li className="breadcrumb-item">
              <HomeIcon />
              <Link className="text-decoration-none text-white" to="/">
                <span className="ml-2">{t("MainPage")}</span>
              </Link>
            </li>
            {paths.map((path, i) => (
              <li key={i} className="breadcrumb-item">
                {t(path)}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
