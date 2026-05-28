import React, { useEffect } from "react";
import CulturalMaps from "../features/culturalMaps/CulturalMaps";

const CulturalMapsPage = () => {
  useEffect(() => {
    document.title = "Cultural Maps - Tamil Nadu Heritage Sites";

    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.height = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="cultural-maps-page"
      style={{
        height: "calc(100vh - 56px)",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CulturalMaps />
    </div>
  );
};

export default CulturalMapsPage;
