import React from "react";
import { ReactComponent as Viber } from "../assets/icons/like.svg";

const Icon = ({ pathFromIcons, ...rest }) => {
  const ImportedIconRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  console.log("loading");
  console.log(loading);
  React.useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        ImportedIconRef.current = (
          await import(`../assets/icons/${pathFromIcons}.svg`)
        ).default;
        // ImportedIconRef.current = await import(`../assets/icons/like.svg`);
        // await importScripts()
        // ImportedIconRef.current = x;
        console.log(ImportedIconRef);
      } catch (err) {
        console.log(err);
        // Your own error handling logic, throwing error for the sake of
        // simplicity
        // throw err;
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [pathFromIcons]);

  if (!loading && ImportedIconRef.current) {
    const { current: ImportedIcon } = ImportedIconRef;
    return <img src={ImportedIcon} alt="" {...rest} />;
    // return <ImportedIcon {...rest} />;
  }

  return null;
};

export default Icon;
