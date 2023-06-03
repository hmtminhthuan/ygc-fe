import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import "./Dashboard.scss";
import "./Slider.scss";
import user from "../../assets/images/user.jpg";
import { api } from "../../constants/api";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
export default function Dashboard() {
  // const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  // let USER = {};
  // USER = JSON.parse(USER_LOGIN);
  // if (
  //   USER_LOGIN == null ||
  //   USER_LOGIN == undefined ||
  //   !(USER.role.id == 1 || USER.role.id == 2)
  // ) {
  //   window.location.href = "/";
  // }

  useEffect(() => {
    const menu = document.querySelector(".menu");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main--content");

    menu.onclick = function () {
      sidebar.classList.toggle("active");
      mainContent.classList.toggle("active");
    };
  }, []);

  //Trainerlist;
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

  //Count
  const [countList, setCountList] = useState([]);
  useEffect(() => {
    api
      .get("/api/Admin/GetNumberOfAdmin")
      .then((res) => {
        const total = res.data;
        setCountList(total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div>
        {/* Header */}
        <section className="headerdb">
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
                <img src={user} alt="" />
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
                  <span className="sidebar--item">Classes</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="icon icon-6">
                    <i className=" ri-community-line" />
                  </span>
                  <span className="sidebar--item">Feedbacks</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="icon icon-6">
                    <i className="ri-terminal-window-fill" />
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
              </div>
              <div className="row cards ">
                <div className="col-sm-3 card card-1 text-center">
                  <div className="card--data mt-5 mx-3">
                    <div className="card--content">
                      <h5 className="card--title">Total Trainers</h5>
                      <h1 className=" mt-4">{countList.numOfTrainer}</h1>
                    </div>
                    <i className="ri-user-2-line card--icon--lg" />
                  </div>
                </div>
                <div className="col-sm-3 card card-2 text-center">
                  <div className="card--data mt-5 mx-3">
                    <div className="card--content">
                      <h5 className="card--title">Total Trainees</h5>
                      <h1 className=" mt-4">{countList.numOfTrainee}</h1>
                    </div>
                    <i className=" mr-4 ri-user-line card--icon--lg " />
                  </div>
                </div>
                <div className="col-sm-3 card card-3 text-center">
                  <div className="card--data mt-5 mx-3">
                    <div className="card--content">
                      <h5 className="card--title">Courses</h5>
                      <h1 className=" mt-4">{countList.numOfCourse}</h1>
                    </div>
                    <i className="mr-4 ri-book-open-fill card--icon--lg" />
                  </div>
                </div>
                <div className="col-sm-3 card card-4 text-center">
                  <div className="card--data mt-5 mx-3">
                    <div className="card--content">
                      <h5 className="card--title">Classes</h5>
                      <h1 className=" mt-4">{countList.numOfClass}</h1>
                    </div>
                    <i className="mr-4 ri-community-line card--icon--lg" />
                  </div>
                </div>

                <div className="col-sm-3 card card-6 text-center">
                  <div className="card--data mt-5 mx-3">
                    <div className="card--content">
                      <h5 className="card--title">Feedbacks</h5>
                      <h1 className=" mt-4">{countList.numOfFeedback}</h1>
                    </div>
                    <i className="mr-4 ri-community-line card--icon--lg" />
                  </div>
                </div>

                <div className="col-sm-3 card card-5 text-center">
                  <div className="card--data mt-5 mx-3">
                    <div className="card--content">
                      <h5 className="card--title">Blogs</h5>
                      <h1 className=" mt-4">{countList.numOfBlog}</h1>
                    </div>
                    <i className="mr-4 ri-terminal-window-fill card--icon--lg" />
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

              <div className="carousel">
                <div className="carousel__body">
                  <div className="carousel__prev">
                    <i className="far fa-angle-left"></i>
                  </div>

                  <div className="carousel__next">
                    <i className="far fa-angle-right"></i>
                  </div>

                  <div className="carousel__slider">
                    <div className="doctors--cards">
                      {trainerList.map((trainer) => (
                        <a
                          href="#"
                          className="doctor--card"
                          key={trainer.accountID}
                        >
                          <div className="img--box--cover">
                            <div className="img--box">
                              <img src={`/path/to/images/${trainer.img}.png`} />
                            </div>
                          </div>
                          <p className="free">{`${trainer.firstName} ${trainer.lastName}`}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
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
        </section>
      </div>
    </>
  );
}
