import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import { api } from "../../../constants/api";
import "./AdminDashboard.scss";

export default function AdminDashboard() {
  localStorage.setItem("MENU_ACTIVE", "/admin");
  const [countList, setCountList] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  useEffect(() => {
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      timer: 1000,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    api
      .get("/api/AdminRepositoryAPI/GetOverallStatistics")
      .then((res) => {
        const total = res.data;
        setCountList(total);
        setIsDataLoaded(true);
      })
      .catch((err) => {});
  }, []);

  //Trainerlist;
  const [trainerList, setTrainerList] = useState([]);
  useEffect(() => {
    api
      .get("/Account/AccountListByRole?id=3")
      .then((res) => {
        const filteredTrainers = res.data
          .filter((item) => !item.deleted)
          .sort((a, b) => b.accountID - a.accountID)
          .slice(0, 7);
        setTrainerList(filteredTrainers);
      })
      .catch((err) => {});
  }, []);

  // Traineelist
  const [traineeList, setTraineeList] = useState([]);
  useEffect(() => {
    api
      .get("/Account/AccountListByRole?id=4")
      .then((res) => {
        const filteredTrainees = res.data
          .filter((item) => !item.deleted)
          .sort((a, b) => b.accountID - a.accountID);
        setTraineeList(filteredTrainees);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      Swal.close();
    }
  }, [isDataLoaded]);
  return (
    <>
      <HeaderAdmin />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        <div className="main--content">
          <section class="staff-list-area p-0 mt-2 px-4">
            <div className="overview">
              <div className="title">
                <h2 className="section--title">Overview</h2>
              </div>
              <div className="row cards flex justify-content-between">
                <div
                  className="col-sm-3 card card-1 text-center"
                  style={{ width: "28%" }}
                >
                  <div className="card--data ">
                    <div className="card--content">
                      <h5 className="card--title">Total Staffs</h5>
                      <h1>{countList.numOfStaff}</h1>
                    </div>
                    <i className="ri-user-star-line card--icon--lg " />
                  </div>
                </div>
                <div
                  className="col-sm-3 card card-2 text-center"
                  style={{ width: "28%" }}
                >
                  <div className="card--data ">
                    <div className="card--content">
                      <h5 className="card--title">Total Trainers</h5>
                      <h1>{countList.numOfTrainer}</h1>
                    </div>
                    <i className="ri-user-2-line card--icon--lg " />
                  </div>
                </div>
                <div
                  className="col-sm-3 card card-3 text-center"
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
                  className="col-sm-3 card card-4 text-center"
                  style={{ width: "28%" }}
                >
                  <div className="card--data ">
                    <div className="card--content">
                      <h5 className="card--title">Courses</h5>
                      <h1>{countList.numOfCourse}</h1>
                    </div>
                    <i className="mr-4  ri-book-mark-line card--icon--lg" />
                  </div>
                </div>
                <div
                  className="col-sm-3 card card-5 text-center"
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

                {/* <div className="col-sm-3 card card-6 text-center"
              style={{ width: "30%" }}>
                <div className="card--data ">
                  <div className="card--content">
                    <h5 className="card--title">Feedbacks</h5>
                    <h1>{countList.numOfFeedback}</h1>
                  </div>
                  <i className="mr-4 ri-wechat-line card--icon--lg" />
                </div>
              </div> */}

                <div
                  className="col-sm-3 card card-7 text-center"
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
                {/* <div className="trainers--right--btns">
                  <button className="add">
                    <i className="ri-add-line" />
                    Add Trainer
                  </button>
                </div> */}
              </div>
              <div className="trainers--container flex w-100">
                <div className="trainers--cards" style={{ display: "flex" }}>
                  {trainerList.map((trainer, index) => (
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
                          {/* <img
                            src={`/path/to/images/${trainer.img}.png`}
                            alt="Trainer"
                          /> */}
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

                {/* <div className="more">
                    <NavLink to={`/staff/listTrainer`} className="updateInfo">
                      <i
                        className=" ri-arrow-right-s-line mx-4 mt-2 "
                        style={{ color: "#333", fontSize: "40px" }}
                      ></i>
                    </NavLink>
                  </div> */}
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
                    {traineeList.slice(0, 9).map((trainee) => (
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
    </>
  );
}
