import React from "react";
import { Outlet } from "react-router";
import Swal from "sweetalert2";
import { alert } from "../../component/AlertComponent/Alert";

export default function StaffTemplate() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  let USER = {};
  USER = JSON.parse(USER_LOGIN);

  alert.alertSuccess("Successfully", "Create Staff Successfully", () => {});

  if (USER_LOGIN == null || USER_LOGIN == undefined || !(USER.role.id == 2)) {
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
      {USER_LOGIN == null || USER_LOGIN == undefined || !(USER.role.id == 2) ? (
        <></>
      ) : (
        <div style={{}}>
          <Outlet />
        </div>
      )}
    </>
  );
}
