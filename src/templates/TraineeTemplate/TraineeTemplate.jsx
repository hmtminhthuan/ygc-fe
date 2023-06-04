import React from "react";
import { Outlet } from "react-router";

export default function TraineeTemplate() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  let USER = {};
  USER = JSON.parse(USER_LOGIN);
  if (USER_LOGIN == null || USER_LOGIN == undefined || !(USER.role.id == 4)) {
    window.location.href = "/";
  }
  return (
    <>
      {USER_LOGIN == null || USER_LOGIN == undefined || !(USER.role.id == 4) ? (
        <></>
      ) : (
        <div style={{}}>
          <Outlet />
        </div>
      )}
    </>
  );
}
