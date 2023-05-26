import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import "./Dashboard.scss";
import user from "../../assets/images/user.jpg";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
export default function Dashboard() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  let USER = {};
  USER = JSON.parse(USER_LOGIN);
  if (
    USER_LOGIN == null ||
    USER_LOGIN == undefined ||
    !(USER.role.id == 1 || USER.role.id == 2)
  ) {
    window.location.href = "/";
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
  //
  return (
    <>
      {!(USER.role.id == 1 || USER.role.id == 2) ? (
        <></>
      ) : (
        <div>
          {/* Header */}
          <section className="header">
            <div className="logo mt-2">
              <h2>
                <i className="ri-menu-line icon icon-0 menu mx-2" />
              </h2>
              <h2>
                <img src={logo} />
                Yoga<span>Center</span>
              </h2>
            </div>
            <div className="search--notification--profile">
              <div className="search">
                <input type="text" placeholder="Search..." />
                <button>
                  <i className="ri-search-2-line" />
                </button>
              </div>
              <div className="notification--profile">
                <div className="picon bell">
                  <i className="ri-notification-2-line" />
                </div>

                <div className="picon profile">
                  <img src={user} alt />
                </div>
                <Link
                  to={"/"}
                  className="px-2 text-decoration-none text-primary bg-primary bg-opacity-25
                "
                  style={{ borderRadius: "10px", marginLeft: "20px" }}
                >
                  Home
                </Link>
                <Link
                  onClick={() => {
                    localStorage.removeItem("USER_LOGIN");
                    window.location.href = "/";
                  }}
                  className="px-2 text-decoration-none text-danger bg-danger bg-opacity-25
                "
                  style={{ borderRadius: "10px", marginLeft: "20px" }}
                >
                  Log out
                </Link>
              </div>
            </div>
          </section>

          {/* Main */}
          <section className="main">
            {/* Sidebar */}
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
                    <span
                      className="sidebar--item"
                      style={{ whiteSpace: "nowrap" }}
                    >
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

            <div className="main--content">
              {/* Overview */}
              <div className="overview">
                <div className="title">
                  <h2 className="section--title">Overview</h2>
                  <select name="date" id="date" className="dropdown">
                    <option value="today">Today</option>
                    <option value="lastweek">Last Week</option>
                    <option value="lastmonth">Last Month</option>
                    <option value="lastyear">Last Year</option>
                    <option value="alltime">All Time</option>
                  </select>
                </div>
                <div className="cards">
                  <div className="card card-1 text-center">
                    <div className="card--data mt-5 mx-3">
                      <div className="card--content">
                        <h5 className="card--title">Total Trainers</h5>
                        <h1>15</h1>
                      </div>
                      <i className="ri-user-2-line card--icon--lg" />
                    </div>
                    <div className="card--stats">
                      <span>
                        <i className="ri-bar-chart-fill card--icon stat--icon" />
                        65%
                      </span>
                      <span>
                        <i className="ri-arrow-up-s-fill card--icon up--arrow" />
                        10
                      </span>
                    </div>
                  </div>
                  <div className="card card-2 text-center">
                    <div className="card--data mt-5 mx-3">
                      <div className="card--content">
                        <h5 className="card--title">Total Trainees</h5>
                        <h1>100</h1>
                      </div>
                      <i className=" mr-4 ri-user-line card--icon--lg " />
                    </div>
                    <div className="card--stats">
                      <span>
                        <i className="ri-bar-chart-fill card--icon stat--icon" />
                        82%
                      </span>
                      <span>
                        <i className="ri-arrow-up-s-fill card--icon up--arrow" />
                        23
                      </span>
                    </div>
                  </div>
                  <div className="card card-3 text-center">
                    <div className="card--data mt-5 mx-3">
                      <div className="card--content">
                        <h5 className="card--title">Courses</h5>
                        <h1>9</h1>
                      </div>
                      <i className="mr-4 ri-book-open-fill card--icon--lg" />
                    </div>
                  </div>
                  <div className="card card-4 text-center">
                    <div className="card--data mt-5 mx-3">
                      <div className="card--content">
                        <h5 className="card--title">Classes</h5>
                        <h1>15</h1>
                      </div>
                      <i className="mr-4 ri-community-line card--icon--lg" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="doctors">
                <div className="title">
                  <h2 className="section--title">Trainers</h2>
                  <div className="doctors--right--btns">
                    <button className="add">
                      <i className="ri-add-line" />
                      Add Trainer
                    </button>
                  </div>
                </div>
                <div className="doctors--cards">
                  <a href="#" className="doctor--card">
                    <div className="img--box--cover">
                      <div className="img--box">
                        <img src="assets/images/doctor1.jpg" alt />
                      </div>
                    </div>
                    <p className="free">Free</p>
                  </a>
                  <a href="#" className="doctor--card">
                    <div className="img--box--cover">
                      <div className="img--box">
                        <img src="assets/images/doctor2.jpg" alt />
                      </div>
                    </div>
                    <p className="scheduled">Trainer1</p>
                  </a>
                  <a href="#" className="doctor--card">
                    <div className="img--box--cover">
                      <div className="img--box">
                        <img src="assets/images/doctor3.jpg" alt />
                      </div>
                    </div>
                    <p className="scheduled">Trainer2</p>
                  </a>
                  <a href="#" className="doctor--card">
                    <div className="img--box--cover">
                      <div className="img--box">
                        <img src="assets/images/doctor4.jpg" alt />
                      </div>
                    </div>
                    <p className="free">Trainer3</p>
                  </a>
                  <a href="#" className="doctor--card">
                    <div className="img--box--cover">
                      <div className="img--box">
                        <img src="assets/images/doctor5.jpg" alt />
                      </div>
                    </div>
                    <p className="scheduled">Trainer4</p>
                  </a>
                  <a href="#" className="doctor--card">
                    <div className="img--box--cover">
                      <div className="img--box">
                        <img src="assets/images/doctor6.jpg" alt />
                      </div>
                    </div>
                    <p className="free">Trainer5</p>
                  </a>
                  <a href="#" className="doctor--card">
                    <div className="img--box--cover">
                      <div className="img--box">
                        <img src="assets/images/doctor7.jpg" alt />
                      </div>
                    </div>
                    <p className="scheduled">Trainer6</p>
                  </a>
                </div>
              </div>
              <div className="recent--patients">
                <div className="title">
                  <h2 className="section--title">Recent Trainees</h2>
                  <button className="add">
                    <i className="ri-add-line" />
                    Add Trainee
                  </button>
                </div>
                <div className="table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Date in</th>
                        <th>Gender</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Cameron Williamson</td>
                        <td>30/04/2023</td>
                        <td>Female</td>

                        <td className="pending">pending</td>
                      </tr>
                      <tr>
                        <td>George Washington</td>
                        <td>30/04/2023</td>
                        <td>Female</td>

                        <td className="confirmed">Confirmed</td>
                      </tr>
                      <tr>
                        <td>John Adams</td>
                        <td>29/04/2023</td>
                        <td>Female</td>
                        <td className="confirmed">Confirmed</td>
                      </tr>
                      <tr>
                        <td>Thomas Jefferson</td>
                        <td>29/04/2023</td>
                        <td>Female</td>

                        <td className="rejected">Rejected</td>
                      </tr>
                      <tr>
                        <td>James Madison</td>
                        <td>29/04/2023</td>
                        <td>Female</td>

                        <td className="confirmed">Confirmed</td>
                      </tr>
                      <tr>
                        <td>Andrew Jackson</td>
                        <td>28/04/2023</td>
                        <td>Female</td>

                        <td className="confirmed">Confirmed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
