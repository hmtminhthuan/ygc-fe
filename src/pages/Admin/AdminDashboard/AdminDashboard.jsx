import React from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";

export default function AdminDashboard() {
  localStorage.setItem("MENU_ACTIVE", "admin-dashboard");
  return (
    <>
      <HeaderAdmin />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        <div className="main--content staff-course-view pt-3">
          AdminDashboard
        </div>
      </section>
    </>
  );
}
