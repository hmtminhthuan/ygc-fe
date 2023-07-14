import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
export default function MenuAdmin() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const USER = JSON.parse(USER_LOGIN);
  const menu_active = localStorage.getItem("MENU_ACTIVE");
  if (menu_active == null) {
    localStorage.setItem("MENU_ACTIVE", "/admin");
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

  const navigateTo = (link) => {
    localStorage.setItem("MENU_ACTIVE", link);
    navigate(link);
  };
  const navigate = useNavigate();
  return (
    <div className="sidebar bg-dark menu-scroll">
      <ul className="sidebar--items">
        <li>
          <NavLink
            onClick={() => {
              navigateTo("/admin");
            }}
            className={`${
              menu_active == null || menu_active == "/admin"
                ? "sidebar--items--active"
                : ""
            }`}
            to="/admin"
          >
            <span className="icon icon-1">
              <i className="ri-layout-grid-line" />
            </span>
            <span className="sidebar--item">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/admin/listStaff"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/admin/listStaff");
            }}
            to="/admin/listStaff"
          >
            <span className="icon icon-4">
              <i className="ri-user-star-line" style={{ color: "#ff9aa2" }} />
            </span>

            <span className="sidebar--item">Staff</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/admin/courseManagement"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/admin/courseManagement");
            }}
            to="/admin/courseManagement"
          >
            <span className="icon icon-5">
              <i className="ri-book-mark-line" style={{ color: "#a9c555" }} />
            </span>
            <span className="sidebar--item">Course</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/admin/setting"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/admin/setting");
            }}
            to="/admin/setting"
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
          </NavLink>
        </li>
      </ul>
      <ul className="sidebar--bottom-items">
        {/* <li>
          <NavLink to="/">
            <span className="icon icon-4">
              <i className="fa-solid fa-house" style={{ color: "#ec88ad" }}></i>{" "}
            </span>
            <span className="sidebar--item">Home</span>
          </NavLink>
        </li> */}
        <li>
          <NavLink to={`/profile`}>
            <span className="icon icon-7">
              <i
                className="fa-sharp fa-solid fa-address-card"
                style={{ color: "#97a7e4" }}
              ></i>{" "}
            </span>
            <span className="sidebar--item">Profile</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            onClick={() => {
              localStorage.removeItem("USER_LOGIN");
              localStorage.removeItem("MENU_ACTIVE");
              navigate("/");
            }}
          >
            <span className="icon icon-8">
              <i className="ri-logout-box-r-line" />
            </span>
            <span className="sidebar--item">Log out</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
