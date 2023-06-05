import React, { useEffect, useState, useRef } from "react";
import "remixicon/fonts/remixicon.css";
import "./Dashboard.scss";

import user from "../../assets/images/user.jpg";
import { api } from "../../constants/api";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import MenuStaff from "../../component/Staff/MenuStaff";
import HeaderStaff from "../../component/Staff/HeaderStaff";
export default function Dashboard() {
  localStorage.setItem("MENU_ACTIVE", "staff-dashboard");
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
        const filteredTrainers = res.data.slice(0, 7);
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
      .get("/api/AdminRepositoryAPI/GetNumberOfAdmin")
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
        <HeaderStaff />

        {/* Main */}
        <section className="main">
          {/* Sidebar */}
          <MenuStaff />

          <div className="main--content">
            {/* Overview */}
            <div className="overview">
              <div className="title">
                <h2 className="section--title">Overview</h2>
              </div>
              <div className="row cards ">
                <div className="col-sm-3 card card-1 text-center">
                  <div className="card--data ">
                    <div className="card--content">
                      <h5 className="card--title">Total Trainers</h5>
                      <h1>{countList.numOfTrainer}</h1>
                    </div>
                    <i className="ri-user-2-line card--icon--lg " />
                  </div>
                </div>
                <div className="col-sm-3 card card-2 text-center">
                  <div className="card--data  ">
                    <div className="card--content">
                      <h5 className="card--title">Total Trainees</h5>
                      <h1>{countList.numOfTrainee}</h1>
                    </div>
                    <i className=" ri-user-line card--icon--lg " />
                  </div>
                </div>
                <div className="col-sm-3 card card-3 text-center">
                  <div className="card--data ">
                    <div className="card--content">
                      <h5 className="card--title">Courses</h5>
                      <h1>{countList.numOfCourse}</h1>
                    </div>
                    <i className="mr-4 ri-book-open-fill card--icon--lg" />
                  </div>
                </div>
                <div className="col-sm-3 card card-4 text-center">
                  <div className="card--data">
                    <div className="card--content">
                      <h5 className="card--title">Classes</h5>
                      <h1>{countList.numOfClass}</h1>
                    </div>
                    <i className="mr-4 ri-community-line card--icon--lg" />
                  </div>
                </div>

                <div className="col-sm-3 card card-6 text-center">
                  <div className="card--data ">
                    <div className="card--content">
                      <h5 className="card--title">Feedbacks</h5>
                      <h1>{countList.numOfFeedback}</h1>
                    </div>
                    <i className="mr-4 ri-community-line card--icon--lg" />
                  </div>
                </div>

                <div className="col-sm-3 card card-5 text-center">
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
                {/* <div className="trainers--right--btns">
                  <button className="add">
                    <i className="ri-add-line" />
                    Add Trainer
                  </button>
                </div> */}
              </div>
              <div className="trainers--container flex">
                <div className="trainers--cards" style={{ display: "flex" }}>
                  {trainerList.map((trainer, index) => (
                    <a
                      href="#"
                      className="trainer--card"
                      key={trainer.accountID}
                    >
                      <div className="img--box--cover">
                        <div className="img--box">
                          <img
                            src={`/path/to/images/${trainer.img}.png`}
                            alt="Trainer"
                          />
                        </div>
                      </div>
                      <p className="free">{`${trainer.firstName} ${trainer.lastName}`}</p>
                    </a>
                  ))}
                </div>

                <div className="more">
                  <Link to={`/staff/listTrainer`} className="updateInfo">
                    <i
                      className=" ri-arrow-right-s-line mx-4 mt-2 "
                      style={{ color: "#333", fontSize: "40px" }}
                    ></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="recent--trainees">
              <div className="title">
                <h2 className="section--title">Recent Trainees</h2>
                {/* <button className="add">
                  <i className="ri-add-line" />
                  Add Trainee
                </button> */}
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
