import React, { useEffect, useState, useRef } from "react";
import "remixicon/fonts/remixicon.css";
import "./StaffDashboard.scss";
import maleImg from "../../../assets/images/avt-male.jpg";
import femaleImg from "../../../assets/images/avt-female.jpg";
import user from "../../../assets/images/user.jpg";
import { api } from "../../../constants/api";
import logo from "../../../assets/images/logo.png";
import { NavLink } from "react-router-dom";
import MenuStaff from "../../../component/Staff/MenuStaff";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import LoadingOverlay from "../../../component/Loading/LoadingOverlay";
export default function Dashboard() {
  localStorage.setItem("MENU_ACTIVE", "/staff");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const menu = document.querySelector(".menu");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main--content");

    menu.onclick = function () {
      sidebar.classList.toggle("active");
      mainContent.classList.toggle("active");
    };
  }, []);

  const [countList, setCountList] = useState({
    numOfTrainer: 0,
    numOfTrainee: 0,
    numOfCourse: 0,
    numOfClass: 0,
    numOfBlog: 0,
    numOfFeedback: 0,
    traineeList: [],
    trainerList: [],
  });

  useEffect(() => {
    api
      .get("/api/AdminRepositoryAPI/GetOverallStatistics")
      .then((res) => {
        const overallStats = res.data;
        setCountList(overallStats);
        setLoading(false);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <div>
        <LoadingOverlay loading={loading} />
        {/* Header */}
        <HeaderStaff />

        {/* Main */}
        <section className="main">
          {/* Sidebar */}
          <MenuStaff />

          <div
            className="main--content  bg-light"
            style={{ overflowX: "hidden" }}
          >
            {/* Overview */}
            <section className="staff-list-area p-0 mt-2 px-4">
              <div className="overview">
                <div className="title">
                  <h2 className="section--title">Overview</h2>
                </div>
                <div className="row cards flex justify-content-lg-between">
                  <div
                    className="col-sm-3 mb-2 card card-1 text-center"
                    style={{ width: "28%" }}
                  >
                    <div className="card--data">
                      <div className="card--content">
                        <h5 className="card--title">Total Trainers</h5>
                        <h1>{countList.numOfTrainer}</h1>
                      </div>
                      <i className="ri-user-2-line card--icon--lg " />
                    </div>
                  </div>
                  <div
                    className="col-sm-3 mb-2 card card-2 text-center"
                    style={{ width: "28%" }}
                  >
                    <div className="card--data  ">
                      <div className="card--content">
                        <h5 className="card--title">Total Trainees</h5>
                        <h1>{countList.numOfTrainee}</h1>
                      </div>
                      <i className="ri-team-line card--icon--lg " />
                    </div>
                  </div>
                  <div
                    className="col-sm-3 mb-2 card card-3 text-center"
                    style={{ width: "28%" }}
                  >
                    <div className="card--data ">
                      <div className="card--content">
                        <h5 className="card--title">Courses</h5>
                        <h1>{countList.numOfCourse}</h1>
                      </div>
                      <i className="mr-4 ri-book-mark-line card--icon--lg" />
                    </div>
                  </div>
                  <div
                    className="col-sm-3 mb-2 card card-4 text-center"
                    style={{ width: "28%" }}
                  >
                    <div className="card--data">
                      <div className="card--content">
                        <h5 className="card--title">Classes</h5>
                        <h1>{countList.numOfClass}</h1>
                      </div>
                      <i className="mr-4 ri-community-line card--icon--lg" />
                    </div>
                  </div>

                  <div
                    className="col-sm-3 mb-2 card card-6 text-center"
                    style={{ width: "28%" }}
                  >
                    <div className="card--data ">
                      <div className="card--content">
                        <h5 className="card--title">Feedbacks</h5>
                        <h1>{countList.numOfFeedback}</h1>
                      </div>
                      <i className="mr-4 ri-wechat-line card--icon--lg" />
                    </div>
                  </div>

                  <div
                    className="col-sm-3 mb-2 card card-5 text-center"
                    style={{ width: "28%" }}
                  >
                    <div className="card--data ">
                      <div className="card--content">
                        <h5 className="card--title">Blogs</h5>
                        <h1>{countList.numOfBlog}</h1>
                      </div>
                      <i className="mr-4 ri-terminal-window-fill card--icon--lg" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="trainers">
                <div className="title">
                  <h2 className="section--title">Trainers</h2>
                </div>
                <div className="trainers--container flex w-100">
                  <div className="trainers--cards" style={{ display: "flex" }}>
                    {countList.trainerList.slice(0, 8).map((trainer) => (
                      <a
                        href="#"
                        className="trainer--card bg-dark"
                        key={trainer.accountID}
                      >
                        <div
                          className="img--box--cover"
                          style={{ border: "2px solid #fff" }}
                        >
                          <div className="img--box">
                            {trainer.img == "male" ? (
                              <img
                                src={maleImg}
                                alt="Image"
                                className="shadow img-user-profile"
                                style={{ borderRadius: "50%" }}
                              />
                            ) : (
                              <></>
                            )}
                            {trainer.img == "female" ? (
                              <img
                                src={femaleImg}
                                alt="Image"
                                className="shadow img-user-profile"
                                style={{ borderRadius: "50%" }}
                              />
                            ) : (
                              <></>
                            )}
                            {trainer.img != "" &&
                            trainer.img != "male" &&
                            trainer.img != "female" ? (
                              <img
                                src={trainer.img}
                                alt="Image"
                                className="shadow img-user-profile"
                                style={{
                                  borderRadius: "50%",
                                  height: "100%",
                                  width: "100%",
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        <p className="free">{`${trainer.firstName} ${trainer.lastName}`}</p>
                      </a>
                    ))}
                  </div>

                  <div className="more">
                    <NavLink to={`/staff/listTrainer`} className="updateInfo">
                      <i
                        className=" ri-arrow-right-s-line mx-4 mt-2 "
                        style={{ color: "#333", fontSize: "40px" }}
                      ></i>
                    </NavLink>
                  </div>
                </div>
              </div>

              <div className="recent--trainees">
                <div className="title">
                  <h2 className="section--title">Recent Trainees</h2>
                </div>
                <div className="table">
                  <table className="table-none-border-radius-head">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Name</th>
                        <th style={{ textAlign: "left" }}>Phone</th>
                        <th style={{ textAlign: "left" }}>Email</th>
                        <th style={{ textAlign: "left" }}>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {countList.traineeList.slice(0, 9).map((trainee) => (
                        <tr key={trainee.accountID}>
                          <td
                            style={{ textAlign: "left" }}
                          >{`${trainee.firstName} ${trainee.lastName}`}</td>
                          <td
                            style={{ textAlign: "left" }}
                          >{`${trainee.phoneNumber}`}</td>
                          <td
                            style={{ textAlign: "left" }}
                          >{`${trainee.email}`}</td>
                          <td
                            style={{ textAlign: "left" }}
                          >{`${trainee.address}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
