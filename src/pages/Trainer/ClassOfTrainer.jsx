import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../constants/api";
import "./ClassOfTrainer.scss";

export default function ClassOfTrainer() {
  const [classDetail, setClassDetail] = useState({});
  const [trainees, setTrainees] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    api
      .get("/Trainer/getListClassForTrainer", {
        params: { id: id },
      })
      .then((res) => {
        setClassDetail(res.data[0]);
      })
      .catch((err) => {});

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
                      Class:
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
                      <p>Room:</p>
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 profile-stats">
                    <div className="row">
                      <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                        <div className="stats-value pink">?</div>
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
                    style={{ height: 400, overflow: "hidden", outline: "none" }}
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
                        {trainees.map((trainee) => {
                          <tr key={trainee.classId}>
                            <td className="table-img">
                              {/* <img
                              src="https://bootdey.com/img/Content/avatar/avatar8.png"
                              alt
                            /> */}
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
                              {/* <p className="m-0 font-12">
                                Assigned to
                                <span className="col-green font-weight-bold">
                                  {" "}
                                  Airi Satou
                                </span>
                              </p> */}
                            </td>

                            <td>{trainee.lastName}</td>

                            <td>{trainee.gender ? "Male" : "Female"}</td>
                            <td>
                              <div className="badge-outline col-red">
                                {trainee.phone}
                              </div>
                            </td>
                          </tr>;
                        })}
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
  );
}
