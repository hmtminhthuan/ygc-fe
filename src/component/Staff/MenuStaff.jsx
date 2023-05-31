import React from "react";

export default function MeanuStaff() {
  return (
    <div className="sidebar">
      <ul className="sidebar--items">
        <li>
          <a href="#" id="active--link">
            <span className="icon icon-1">
              <i className="ri-layout-grid-line" />
            </span>
            <span className="sidebar--item">Dashboard</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon icon-2">
              <i className="ri-calendar-2-line" />
            </span>
            <span className="sidebar--item">Schedule</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon icon-3">
              <i className="ri-user-2-line" />
            </span>
            <span className="sidebar--item" style={{ whiteSpace: "nowrap" }}>
              Trainers
            </span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon icon-4">
              <i className="ri-user-line" />
            </span>

            <span className="sidebar--item">Trainees</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon icon-5">
              <i className="ri-folder-open-fill" />
            </span>
            <span className="sidebar--item">Courses</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon icon-6">
              <i className=" ri-community-line" />
            </span>
            <span className="sidebar--item">Classes</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon icon-6">
              <i className="  ri-terminal-window-fill" />
            </span>
            <span className="sidebar--item">Blogs</span>
          </a>
        </li>
      </ul>
      <ul className="sidebar--bottom-items">
        <li>
          <a href="#">
            <span className="icon icon-7">
              <i className="ri-settings-3-line" />
            </span>
            <span className="sidebar--item">My Profile</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon icon-8">
              <i className="ri-logout-box-r-line" />
            </span>
            <span className="sidebar--item">Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
