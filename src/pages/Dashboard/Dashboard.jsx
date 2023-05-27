import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import "./Dashboard.scss";
import user from "../../assets/images/user.jpg";
import { api } from "../../constants/api";
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

  // Trainerlist
  const [trainerList, setTrainerList] = useState([]);
  useEffect(() => {
    api
      .get("/Account/AccountListByRole?id=3")
      .then((res) => {
        const filteredTrainers = res.data;
        setTrainerList(filteredTrainers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Traineelist
  const [traineeList, setTraineeList] = useState([]);
  useEffect(() => {
    api
      .get("/Account/AccountListByRole?id=4")
      .then((res) => {
        const filteredTrainees = res.data;
        setTraineeList(filteredTrainees);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    // <>
    //   {!(USER.role.id == 1 || USER.role.id == 2) ? (
    //     <></>
    //   ) : (

    //   )}{" "}
    // </>

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
      </section>
      {/* </section> */}
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
                <span className="icon icon-7">
                  <i className=" ri-wallet-3-line" />
                </span>
                <span className="sidebar--item">Payment</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span className="icon icon-8">
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
                    <h1>{trainerList.length}</h1>
                  </div>
                  <i className="ri-user-2-line card--icon--lg" />
                </div>
              </div>

              <div className="card card-2 text-center">
                <div className="card--data mt-5 mx-3">
                  <div className="card--content">
                    <h5 className="card--title">Total Trainees</h5>
                    <h1>{traineeList.length}</h1>
                  </div>
                  <i className=" mr-4 ri-user-line card--icon--lg " />
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
              {trainerList.map((trainer) => (
                <a href="#" className="doctor--card" key={trainer.accountID}>
                  <div className="img--box--cover">
                    <div className="img--box">
                      <img src={trainer.image} />
                    </div>
                  </div>
                  <p className="free">{`${trainer.firstName} ${trainer.lastName}`}</p>
                </a>
              ))}
            </div>
          </div>
          <div class="recent--patients">
            <div class="title">
              <h2 class="section--title">Recent Trainees</h2>
              <button class="add">
                <i class="ri-add-line"></i>Add Trainee
              </button>
            </div>

            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {traineeList.slice(-10).map((trainee) => (
                    <tr key={trainee.accountID}>
                      <td>{`${trainee.firstName} ${trainee.lastName}`}</td>
                      <td>{`${trainee.gender ? "Male" : "Female"}`}</td>
                      <td>{`${trainee.address}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>{" "}
    </div>
  );
}
