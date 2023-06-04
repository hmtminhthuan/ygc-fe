import React from "react";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";

export default function ClassManagement() {
  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuStaff />
        <div className="main--content staff-course-view pt-3">
          ClassManagement
        </div>
      </section>
    </>
  );
}
