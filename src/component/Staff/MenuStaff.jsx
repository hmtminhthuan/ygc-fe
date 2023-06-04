import React, { useEffect } from "react";

export default function MenuStaff() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const USER = JSON.parse(USER_LOGIN);
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
          <a href="/staff/dashboard" id="active--link">
            <span className="icon icon-1">
              <i className="ri-layout-grid-line" />
            </span>
            <span className="sidebar--item">Dashboard</span>
          </a>
        </li>

        <li>
          <a href="/staff/listTrainer">
            <span className="icon icon-4">
              <i className="ri-user-2-line" />
            </span>
            <span className="sidebar--item" style={{ whiteSpace: "nowrap" }}>
              Trainer
            </span>
          </a>
        </li>
        <li>
          <a href="/staff/listTrainee">
            <span className="icon icon-4">
              <i className="ri-user-line" />
            </span>
            <span className="sidebar--item">Trainee</span>
          </a>
        </li>
        <li>
          <a href="/staff/course">
            <span className="icon icon-5">
              <i className="ri-folder-open-fill" />
            </span>
            <span className="sidebar--item">Course</span>
          </a>
        </li>
        <li>
          <a href="/staff/classManagement">
            <span className="icon icon-3">
              <i className=" ri-community-line" />
            </span>
            <span className="sidebar--item">Class</span>
          </a>
        </li>
        <li>
          <a href="/staff/feedbackManagement">
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
          <a href="/staff/blogManagement">
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
