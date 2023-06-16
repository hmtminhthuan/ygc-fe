import React from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";

export default function AdminSetting() {
  return (
    <section className="pt-0" style={{ height: "100vh" }}>
      <HeaderAdmin />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        <div className={`main--content px-4 pt-3`}> </div>
      </section>
    </section>
  );
}
