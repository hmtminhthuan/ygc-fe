import React from "react";
import { Navigate, Outlet } from "react-router";

export default function TrainerTemplate() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  let USER = {};
  USER = JSON.parse(USER_LOGIN);
  if (USER_LOGIN == null || USER_LOGIN == undefined || !(USER.role.id == 3)) {
    Swal.fire({
      position: "top-right",
      icon: "warning",
      background: "#fefbe2",
      title: `You are not allwed to access this`,
      width: "100rem",
      padding: "2rem",
      showConfirmButton: false,
      toast: true,
      timer: 2000,
    });
    return <Navigate to="/" />;
  }
  return (
    <>
      {USER_LOGIN == null || USER_LOGIN == undefined || !(USER.role.id == 3) ? (
        <></>
      ) : (
        <div style={{}}>
          <Outlet />
        </div>
      )}
    </>
  );
}
