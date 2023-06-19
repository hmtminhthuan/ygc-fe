import React, { useEffect } from "react";

export default function MenuAdmin() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const USER = JSON.parse(USER_LOGIN);
  const menu_active = localStorage.getItem("MENU_ACTIVE");
  if (menu_active == null) {
    localStorage.setItem("MENU_ACTIVE", "admin-dashboard");
  }
  useEffect(() => {
    const menu = document.querySelector(".menu");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main--content");

    menu.onclick = function () {
      sidebar.classList.toggle("active");
      mainContent.classList.toggle("active");
    };
  }, []);

  return (
    <div className="sidebar bg-dark menu-scroll">
      <ul className="sidebar--items">
        <li>
          <a
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "admin-dashboard");
            }}
            className={`${
              menu_active == null || menu_active == "admin-dashboard"
                ? "sidebar--items--active"
                : ""
            }`}
            href="/admin/dashboard"
          >
            <span className="icon icon-1">
              <i className="ri-layout-grid-line" />
            </span>
            <span className="sidebar--item">Dashboard</span>
          </a>
        </li>
        <li>
          <a
            className={`${
              menu_active != null && menu_active == "admin-staff"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "admin-staff");
            }}
            href="/admin/listStaff"
          >
            <span className="icon icon-4">
              <i className="ri-user-star-line" style={{ color: "#ff9aa2" }} />
            </span>

            <span className="sidebar--item">Staff</span>
          </a>
        </li>
        <li>
          <a
            className={`${
              menu_active != null && menu_active == "admin-course"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "admin-course");
            }}
            href="/admin/courseManagement"
          >
            <span className="icon icon-5">
              <i className="ri-book-mark-line" style={{ color: "#a9c555" }} />
            </span>
            <span className="sidebar--item">Course</span>
          </a>
        </li>
        <li>
          <a
            className={`${
              menu_active != null && menu_active == "admin-setting"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "admin-setting");
            }}
            href="/admin/setting"
          >
            <span className="icon icon-5">
              <i className="fa-solid fa-gear"></i>
            </span>
            <span
              className="sidebar--item"
              style={{ transform: "translateX(-2px)" }}
            >
              Setting
            </span>
          </a>
        </li>
        {/* <li>
                    <a href="#">
                        <span className="icon icon-6">
                            <i className="  ri-terminal-window-fill" />
                        </span>
                        <span className="sidebar--item">Blogs</span>
                    </a>
                </li> */}
      </ul>
      <ul className="sidebar--bottom-items">
        <li>
          <a href="/">
            <span className="icon icon-4">
              <i className="fa-solid fa-house" style={{ color: "#ec88ad" }}></i>{" "}
            </span>
            <span className="sidebar--item">Home</span>
          </a>
        </li>
        <li>
          <a href={`/profile`}>
            <span className="icon icon-7">
              <i
                className="fa-sharp fa-solid fa-address-card"
                style={{ color: "#97a7e4" }}
              ></i>{" "}
            </span>
            <span className="sidebar--item">Profile</span>
          </a>
        </li>
        <li>
          <a
            href="/"
            onClick={() => {
              localStorage.removeItem("USER_LOGIN");
              localStorage.removeItem("MENU_ACTIVE");
              window.location.href = "/";
            }}
          >
            <span className="icon icon-8">
              <i className="ri-logout-box-r-line" />
            </span>
            <span className="sidebar--item">Log out</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
