import React, { useEffect, useLayoutEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { api } from "../../constants/api";
import Swal from "sweetalert2";

import "./ClassOfTrainee.scss";
import Aos from "aos";

export default function ClassOfTrainee() {
  const navigate = useNavigate();
  const [classDetail, setClassDetail] = useState({});
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
      .get("/Trainee/getListClassForTrainee", {
        params: {
          id: JSON.parse(localStorage.getItem("USER_LOGIN")).accountID,
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
      })
      .catch((err) => {
        comeBackHomeInvalid();
      });
  }, []);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const levelName = classDetail.level ? classDetail.level.levelName : "";

  Aos.init();

  return (
    <div className="main--content bg-white">
      <section className="trainer-area pt-3 pb-3">
        <div className="row flex trainer mt-2 mx-5 mb-5">
          <div className="container bootstrap snippets bootdey">
            <div className="col-md-12 ">
              <div className="profile-container mx-5">
                <div
                  className="profile-header row"
                  data-aos="zoom-in-up"
                  data-aos-duration="150"
                  data-aos-delay="600"
                >
                  <div className="">
                    <NavLink
                      to={"/trainee/schedule"}
                      className="mx-4 mt-4 course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                      style={{ fontSize: "18px", fontWeight: "500" }}
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                      <span className="mx-2">Back</span>
                    </NavLink>
                  </div>
                  <div className="col-lg-4 col-md-12 col-sm-12 text-center mt-5">
                    <img
                      src={classDetail.courseImg}
                      alt={classDetail.courseName}
                      className="header-avatar"
                    />
                  </div>
                  <div className="col-lg-8 col-md-12 col-sm-12 profile-info text-center my-0 py-0">
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
                      <p className="m-0 p-0 my-0 text-center">
                        Course name: {classDetail.courseName}
                      </p>
                      <p className="m-0 p-0 my-2 text-center">
                        Room: {classDetail.room}
                      </p>
                      <p className="m-0 p-0 my-2 text-center">
                        Trainer: {classDetail.firstName} {classDetail.lastName}
                      </p>
                      <p className="m-0 p-0 my-2 text-center">
                        Phone: {classDetail.phone}
                      </p>
                    </div>
                  </div>
                  <div
                    className="col-md-12 col-sm-12 col-xs-12 profile-stats
                 "
                  >
                    <div className="row">
                      <div className="mb-0 col-md-4 col-sm-4 col-xs-12 stats-col">
                        <div
                          className="stats-value pink"
                          style={{ fontSize: "20px" }}
                        >
                          {levelName}
                        </div>
                        <div className="stats-title">LEVEL</div>
                      </div>
                      <div className="mb-0 col-md-4 col-sm-4 col-xs-12 stats-col">
                        <div
                          className="stats-value pink"
                          style={{ fontSize: "20px" }}
                        >
                          {formatDate(classDetail.startDate)}
                        </div>
                        <div className="stats-title">START DATE</div>
                      </div>
                      <div className="mb-0 col-md-4 col-sm-4 col-xs-12 stats-col">
                        <div
                          className="stats-value pink"
                          style={{ fontSize: "20px" }}
                        >
                          {formatDate(classDetail.endDate)}
                        </div>
                        <div className="stats-title">END DATE</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
