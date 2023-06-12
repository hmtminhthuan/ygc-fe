import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { api } from "../../constants/api";
import "./ClassOfTrainer.scss";

export default function ClassOfTrainer() {
  const [classDetail, setClassDetail] = useState({});
  const [trainees, setTrainees] = useState([]);
  const { id } = useParams();
  const [availableView, setAvailableView] = useState(false);
  console.log(classDetail);
  useEffect(() => {
    const USER_LOGIN_ID = JSON.parse(
      localStorage.getItem("USER_LOGIN")
    ).accountID;
    api
      .get("/Trainer/getListClassForTrainer", {
        params: {
          id: USER_LOGIN_ID,
        },
      })
      .then((res) => {
        let list = [];
        list = res.data;
        list = [...list].filter((item) => item.classId == id);
        setClassDetail(list[0]);
        if (list[0] == null || list[0] == undefined) {
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
            window.location.href = "/";
          });
        } else if (list[0].trainerId == USER_LOGIN_ID) {
          setAvailableView(true);
        } else {
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
            window.location.href = "/";
          });
        }
        console.log("api", res);
      })
      .catch((err) => {
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
          window.location.href = "/";
        });
      });

    api
      .get("/Trainer/GetTraineesListOfClass", {
        params: { classId: id },
      })
      .then((res) => {
        setTrainees(res.data);
      })
      .catch((err) => {});
  }, [id]);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };
  return (
    <>
      {availableView ? (
        <div className="main--content bg-white">
          <section className="trainer-area pt-3 pb-3">
            <div className="row flex trainer mt-2 mx-5 mb-5">
              <div className="container bootstrap snippets bootdey">
                <div className="col-md-12 ">
                  <div className="profile-container mx-5">
                    <div className="profile-header row">
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
                        <a
                          href="#"
                          className="btn btn-palegreen btn-sm  btn-follow mt-3"
                        >
                          <i className="fa fa-check" />
                          Active
                        </a>
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
                  <div className="card-container mx-5">
                    <div className="card-header">
                      <h4>Trainee List</h4>
                    </div>
                    <div className="card-body">
                      <div
                        className="table-responsive"
                        id="proTeamScroll"
                        tabIndex={2}
                        style={{
                          height: 400,
                          overflow: "hidden",
                          outline: "none",
                        }}
                      >
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Gender</th>
                              <th>Phone</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trainees.map((trainee) => (
                              <tr key={trainee.id}>
                                <td className="table-img">
                                  <img
                                    src={trainee.img}
                                    alt={`${trainee.firstName} ${trainee.lastName}`}
                                    className="trainee-image"
                                  />
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
