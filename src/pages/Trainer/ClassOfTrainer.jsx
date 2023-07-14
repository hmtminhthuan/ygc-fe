import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { api } from "../../constants/api";
import maleImg from "../../assets/images/avt-male.jpg";
import femaleImg from "../../assets/images/avt-female.jpg";
import "./ClassOfTrainer.scss";
import Swal from "sweetalert2";
import Aos from "aos";

export default function ClassOfTrainer() {
  const navigate = useNavigate();
  const [classDetail, setClassDetail] = useState({});
  const [trainees, setTrainees] = useState([]);
  const [available, setAvailable] = useState(false);
  const { id } = useParams();
  const comeBackHomeInvalid = () => {
    Swal.fire({
      position: "middle",
      icon: "warning",
      background: "#fefbe2",
      title: `You are not allwed to access this`,
      width: "50rem",
      padding: "2rem",
      showConfirmButton: false,
      toast: true,
      timer: 1200,
    }).then(function () {
      navigate("/");
    });
  };
  useEffect(() => {
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      timer: 800,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    const USER_ID = JSON.parse(localStorage.getItem("USER_LOGIN")).accountID;
    api
      .get("/Trainer/getListClassForTrainer", {
        params: {
          id: USER_ID,
        },
      })
      .then((res) => {
        let list = [];
        list = res.data;
        list = [...list].filter((item) => item.classId == id);
        setClassDetail(list[0]);
        if (list[0] == null || list[0] == undefined) {
          comeBackHomeInvalid();
        }
        if (list[0].trainerId == USER_ID) {
          setAvailable(true);
        }
      })
      .catch((err) => {
        comeBackHomeInvalid();
      });

    api
      .get("/Trainer/GetTraineesListOfClass", {
        params: { classId: id },
      })
      .then((res) => {
        setTrainees(res.data);
      })
      .catch((err) => {});
  }, []);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };
  Aos.init();
  return (
    <>
      {available ? (
        <div className="main--content bg-white">
          <section
            className="trainer-area pt-3 pb-3"
            style={{ height: "100vh", overflowY: "scroll" }}
          >
            <div className="row flex trainer mt-2 mx-5 my-0">
              <div className="container bootstrap snippets bootdey">
                <div className="col-md-12 ">
                  <div className="profile-container mx-5">
                    <div
                      className="profile-header row"
                      data-aos="zoom-in-up"
                      data-aos-duration="150"
                      data-aos-delay="0"
                    >
                      <div className="">
                        <NavLink
                          to={"/trainer/schedule"}
                          className="mx-4 mt-4 course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                          style={{ fontSize: "18px", fontWeight: "500" }}
                        >
                          <i className="fa-solid fa-arrow-left"></i>
                          <span className="mx-2">Back</span>
                        </NavLink>
                      </div>
                      <div className="col-md-4 col-sm-12 text-center mt-5">
                        <img
                          src={classDetail.courseImg}
                          alt={classDetail.courseName}
                          className="header-avatar"
                        />
                      </div>
                      <div className="col-md-8 col-sm-12 profile-info ">
                        <div
                          className="header-fullname"
                          style={{ fontSize: "24px", fontWeight: "bold" }}
                        >
                          Class: {classDetail.className}
                        </div>
                        <div
                          className="header-information"
                          style={{ fontSize: "20px" }}
                        >
                          <p>Course name: {classDetail.courseName}</p>
                          <p>Room: {classDetail.room}</p>
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12 col-xs-12 profile-stats">
                        <div className="row">
                          <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                            <div className="stats-value pink">
                              {trainees.length}
                            </div>
                            <div className="stats-title">TRAINEES</div>
                          </div>
                          <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                            <div className="stats-value pink">
                              {formatDate(classDetail.startDate)}
                            </div>
                            <div className="stats-title">START DATE</div>
                          </div>
                          <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                            <div className="stats-value pink">
                              {formatDate(classDetail.endDate)}
                            </div>
                            <div className="stats-title">END DATE</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 mt-5 list-container">
                  <div
                    className="card-container mx-5"
                    data-aos="zoom-in-up"
                    data-aos-duration="150"
                    data-aos-delay="0"
                  >
                    <div className="card-header">
                      <h4>Trainee List</h4>
                    </div>
                    <div className="card-body">
                      <div
                        className="table-responsive"
                        id="proTeamScroll"
                        tabIndex={2}
                        style={{
                          // height: 400,
                          overflow: "hidden",
                          outline: "none",
                        }}
                      >
                        <table
                          className="table table-striped"
                          style={{ verticalAlign: "middle" }}
                        >
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Gender</th>
                              <th>Phone</th>
                            </tr>
                          </thead>
                          <tbody style={{ height: "auto" }}>
                            {trainees.map((trainee) => (
                              <tr key={trainee.id}>
                                <td className="table-img">
                                  {/* <img
                                src={trainee.img}
                                alt={`${trainee.firstName} ${trainee.lastName}`}
                                className="trainee-image"
                              /> */}
                                  {trainee.img == "male" ? (
                                    <img
                                      src={maleImg}
                                      alt="Image"
                                      className="shadow img-user-profile"
                                    />
                                  ) : (
                                    <></>
                                  )}
                                  {trainee.img == "female" ? (
                                    <img
                                      src={femaleImg}
                                      alt="Image"
                                      className="shadow img-user-profile"
                                    />
                                  ) : (
                                    <></>
                                  )}
                                  {trainee.img != "" &&
                                  trainee.img != "male" &&
                                  trainee.img != "female" ? (
                                    <img
                                      src={trainee.img}
                                      alt="Image"
                                      className="shadow img-user-profile"
                                    />
                                  ) : (
                                    <></>
                                  )}
                                </td>
                                <td>
                                  <h6 className="mb-0 font-13">
                                    {trainee.firstName}
                                  </h6>
                                </td>
                                <td>{trainee.lastName}</td>
                                <td>{trainee.gender ? "Male" : "Female"}</td>
                                <td>
                                  <div className="badge-outline col-red">
                                    {trainee.phone}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
