import React from "react";

export default function AdminDashboard() {
  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        <div className="main--content staff-course-view pt-3">
          AdminDashboard
        </div>
      </section>
    </>
  );
}
