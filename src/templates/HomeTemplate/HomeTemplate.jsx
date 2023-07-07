import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const HomeTemplate = () => {
  return (
    <div style={{}}>
      <Outlet />
    </div>
  );
};
