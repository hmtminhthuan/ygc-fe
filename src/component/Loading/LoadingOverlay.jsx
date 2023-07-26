import React from "react";
import "./LoadingOverlay.scss";

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loader" />
        <span>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
