import React, { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

export default function MenuStaff() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const USER = JSON.parse(USER_LOGIN);
  const menu_active = localStorage.getItem("MENU_ACTIVE");
  if (menu_active == null) {
    localStorage.setItem("MENU_ACTIVE", "/staff");
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
    <div
      className="sidebar pt-0 mt-0 pt-3 border-none menu-scroll"
      style={{
        border: "none",
        // overflowY: "scroll",
      }}
    >
      <ul className="sidebar--items">
        <li>
          <NavLink
            onClick={() => {
              navigateTo("/staff");
            }}
            className={`${
              menu_active == null || menu_active == "/staff"
                ? "sidebar--items--active"
                : ""
            }`}
            to="/staff"
            id="active--link"
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
              menu_active != null && menu_active == "/staff/listTrainer"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/staff/listTrainer");
            }}
            to="/staff/listTrainer"
          >
            <span className="icon icon-4">
              <i className="ri-user-2-line" style={{ color: "#ff9aa2" }} />
            </span>
            <span className="sidebar--item" style={{ whiteSpace: "nowrap" }}>
              Trainer
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/staff/listTrainee"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/staff/listTrainee");
            }}
            to="/staff/listTrainee"
          >
            <span className="icon icon-4">
              <i className="ri-team-line" style={{ color: "#faa46a" }} />
            </span>
            <span className="sidebar--item">Trainee</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/staff/course"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/staff/course");
            }}
            to="/staff/course"
          >
            <span className="icon icon-5">
              <i
                className="ri-book-mark-line"
                style={{ color: "rgba(241, 210, 67, 1)" }}
              />
            </span>
            <span className="sidebar--item">Course</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/staff/classManagement"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/staff/classManagement");
            }}
            to="/staff/classManagement"
          >
            <span className="icon icon-7">
              <i className=" ri-community-line" style={{ color: "#a9c555" }} />
            </span>
            <span className="sidebar--item">Class</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/staff/timetable"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/staff/timetable");
            }}
            to="/staff/timetable"
          >
            <span className="icon" style={{ color: "greenyellow" }}>
              <i className="fa-solid fa-calendar-days"></i>
            </span>
            <span
              className="sidebar--item"
              style={{ transform: "translateX(4px)" }}
            >
              Timetable
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/staff/feedbackManagement"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/staff/feedbackManagement");
            }}
            to="/staff/feedbackManagement"
          >
            <span className="icon icon-6">
              <i className="fa-sharp fa-solid fa-comments"></i>
            </span>
            <span
              className="sidebar--item"
              style={{ transform: "translateX(-4px)" }}
            >
              Feedback
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/staff/blogManagement"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/staff/blogManagement");
            }}
            to="/staff/blogManagement"
          >
            <span className="icon icon-2">
              <i className="  ri-terminal-window-fill" />
            </span>
            <span className="sidebar--item">Blog</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            className={`${
              menu_active != null && menu_active == "/staff/booking"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              navigateTo("/staff/booking");
            }}
            to="/staff/booking"
          >
            <span className="icon icon-5">
              <i className="fa-solid fa-money-bill"></i>
            </span>
            <span
              className="sidebar--item"
              style={{ transform: "translateX(-4px)" }}
            >
              Request
            </span>
          </NavLink>
        </li>
      </ul>
      <ul className="sidebar--bottom-items">
        {/* <li>
          <NavLink
            to="/"
            onClick={() => {
              navigateTo("home-home");
              // localStorage.setItem("MENU_ACTIVE", "home-home");
            }}
          >
            <span className="icon icon-4">
              <i className="fa-solid fa-house" style={{ color: "#ec88ad" }}></i>{" "}
            </span>
            <span className="sidebar--item">Home</span>
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to={`/profile`}
            onClick={() => {
              navigateTo("/profile");
              //localStorage.setItem("MENU_ACTIVE", "home-profile");
            }}
          >
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
