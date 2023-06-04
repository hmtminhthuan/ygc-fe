import React, { useEffect } from "react";

export default function MenuStaff() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const USER = JSON.parse(USER_LOGIN);
  const menu_active = localStorage.getItem("MENU_ACTIVE");
  if (menu_active == null) {
    localStorage.setItem("MENU_ACTIVE", "staff-dashboard");
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
    <div
      className="sidebar pt-0 mt-0 pt-3 border-none"
      style={{ border: "none" }}
    >
      <ul className="sidebar--items">
        <li>
          <a
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "staff-dashboard");
            }}
            className={`${
              menu_active == null || menu_active == "staff-dashboard"
                ? "sidebar--items--active"
                : ""
            }`}
            href="/staff/dashboard"
            id="active--link"
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
              menu_active != null && menu_active == "staff-trainer"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "staff-trainer");
            }}
            href="/staff/listTrainer"
          >
            <span className="icon icon-4">
              <i className="ri-user-2-line" />
            </span>
            <span className="sidebar--item" style={{ whiteSpace: "nowrap" }}>
              Trainer
            </span>
          </a>
        </li>
        <li>
          <a
            className={`${
              menu_active != null && menu_active == "staff-trainee"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "staff-trainee");
            }}
            href="/staff/listTrainee"
          >
            <span className="icon icon-4">
              <i className="ri-user-line" />
            </span>
            <span className="sidebar--item">Trainee</span>
          </a>
        </li>
        <li>
          <a
            className={`${
              menu_active != null && menu_active == "staff-course"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "staff-course");
            }}
            href="/staff/course"
          >
            <span className="icon icon-5">
              <i className="ri-folder-open-fill" />
            </span>
            <span className="sidebar--item">Course</span>
          </a>
        </li>
        <li>
          <a
            className={`${
              menu_active != null && menu_active == "staff-class"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "staff-class");
            }}
            href="/staff/classManagement"
          >
            <span className="icon icon-3">
              <i className=" ri-community-line" />
            </span>
            <span className="sidebar--item">Class</span>
          </a>
        </li>
        <li>
          <a
            className={`${
              menu_active != null && menu_active == "staff-feedback"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "staff-feedback");
            }}
            href="/staff/feedbackManagement"
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
          </a>
        </li>
        <li>
          <a
            className={`${
              menu_active != null && menu_active == "staff-blog"
                ? "sidebar--items--active"
                : ""
            }`}
            onClick={() => {
              localStorage.setItem("MENU_ACTIVE", "staff-blog");
            }}
            href="/staff/blogManagement"
          >
            <span className="icon icon-2">
              <i className="  ri-terminal-window-fill" />
            </span>
            <span className="sidebar--item">Blog</span>
          </a>
        </li>
      </ul>
      <ul className="sidebar--bottom-items">
        <li>
          <a href="/">
            <span className="icon icon-4">
              <i className="fa-solid fa-house"></i>{" "}
            </span>
            <span className="sidebar--item">Home</span>
          </a>
        </li>
        <li>
          <a href={`/profile/${USER.accountID}`}>
            <span className="icon icon-7">
              <i className="fa-sharp fa-solid fa-address-card"></i>{" "}
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
