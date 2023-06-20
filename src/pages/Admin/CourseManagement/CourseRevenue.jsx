import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../constants/api";

import "./CourseRevenue.scss";

export default function CourseRevenue() {
  const [revenueDetail, setRevenueDetail] = useState({});

  const [available, setAvailable] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    api
      .get("/api/AdminRepositoryAPI/GetCourseRevenue", {
        params: {
          courseId: id,
          year: new Date().getFullYear(),
        },
      })
      .then((res) => {
        setRevenueDetail(res.data);
        setAvailable(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

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
                    <div className="profile-header row">
                      <div className="">
                        <Link
                          to={"/admin/courseManagement"}
                          className="mx-4 mt-4 course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                          style={{ fontSize: "18px", fontWeight: "500" }}
                        >
                          <i className="fa-solid fa-arrow-left"></i>
                          <span className="mx-2">Back</span>
                        </Link>
                      </div>
                      <div className="col-md-4 col-sm-12 text-center mt-5">
                        {/* <img
                          src={classDetail.courseImg}
                          alt={classDetail.courseName}
                          className="header-avatar"
                        /> */}
                      </div>
                      <div className="col-md-8 col-sm-12 profile-info ">
                        <div
                          className="header-fullname"
                          style={{ fontSize: "24px", fontWeight: "bold" }}
                        >
                          Course:
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
                          <p>Annual Revenue: </p>
                          <p>Number Of Class: </p>
                          <p>Number Of Trainees: </p>
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12 col-xs-12 profile-stats">
                        <div className="row">
                          <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                            <div className="stats-value pink">
                              {revenueDetail.annualRevenue}
                            </div>
                            <div className="stats-title">Annual Revenue</div>
                          </div>
                          <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                            <div className="stats-value pink">
                              {revenueDetail.numOfClass}
                            </div>
                            <div className="stats-title">Number Of Classes</div>
                          </div>
                          <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                            <div className="stats-value pink">
                              {revenueDetail.numOfTrainee}
                            </div>
                            <div className="stats-title">
                              Number Of Trainees
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 mt-5 list-container">
                  <div className="card-container mx-5">
                    <div className="card-header">
                      <h4>Monthly Reports</h4>
                    </div>
                    <div className="card-body">
                      <div
                        className="table-responsive"
                        id="proTeamScroll"
                        tabIndex={2}
                        style={{
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
                              <th>Month</th>
                              {/* <th>NumOfClass</th> */}
                              <th>NumOfTrainee</th>
                              <th>MonthlyRevenue</th>
                            </tr>
                          </thead>
                          <tbody style={{ height: "auto" }}>
                            {revenueDetail.monthlyReports &&
                              revenueDetail.monthlyReports.map((report) => (
                                <tr key={report.month}>
                                  <td>{report.month}</td>
                                  {/* <td>{report.numOfClass}</td> */}
                                  <td>{report.numOfTrainee}</td>
                                  <td>{report.monthlyRevenue}</td>
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
