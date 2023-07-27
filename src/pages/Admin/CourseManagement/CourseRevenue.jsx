import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { api } from "../../../constants/api";

import "./CourseRevenue.scss";
import LoadingOverlay from "../../../component/Loading/LoadingOverlay";

export default function CourseRevenue() {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const handleYearSelection = (year) => {
    setYearLoading(true);
    setSelectedYear(year);
  };
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [revenueDetail, setRevenueDetail] = useState({});
  const [yearLoading, setYearLoading] = useState(false);

  const [available, setAvailable] = useState(false);
  const { id } = useParams();
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      currency: "VND",
    }).format(price);
  };
  useEffect(() => {
    api
      .get("/api/AdminRepositoryAPI/GetCourseRevenue", {
        params: {
          courseId: id,
          year: selectedYear,
        },
      })
      .then((res) => {
        setRevenueDetail(res.data);
        setAvailable(true);
        setLoading(false);
        setYearLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAvailable(false);
        setLoading(false);
        setYearLoading(false);
      });
  }, [id, selectedYear]);

  return (
    <>
      <LoadingOverlay loading={loading || yearLoading} />
      {available && (
        <div className="main--content bg-white revenue-area">
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
                        <NavLink
                          to={"/admin/courseManagement"}
                          className="mx-4 mt-4 course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                          style={{ fontSize: "18px", fontWeight: "500" }}
                        >
                          <i className="fa-solid fa-arrow-left"></i>
                          <span className="mx-2">Back</span>
                        </NavLink>
                      </div>
                      <div className="col-md-4 col-sm-12 text-center mt-5">
                        <img
                          src={revenueDetail.course.courseImg}
                          className="header-avatar"
                        />
                      </div>
                      <div className="col-md-8 col-sm-12 profile-info ">
                        <div
                          className="header-fullname"
                          style={{ fontSize: "24px", fontWeight: "bold" }}
                        >
                          Course: {revenueDetail.course.courseName}
                        </div>

                        <div
                          className="header-information"
                          style={{ fontSize: "20px" }}
                        >
                          <p>
                            Price: {formatPrice(revenueDetail.course.price)} VNĐ
                          </p>
                          <p>Level: {revenueDetail.course.levelName}</p>
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12 col-xs-12 profile-stats">
                        <div className="row">
                          <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                            <div className="stats-value pink">
                              {formatPrice(revenueDetail.annualRevenue)} VNĐ
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
                      <div className="year-selection mx-3">
                        <select
                          id="year-select"
                          value={selectedYear}
                          onChange={(e) => {
                            handleYearSelection(parseInt(e.target.value));
                          }}
                        >
                          <option value={new Date().getFullYear() - 1}>
                            2022
                          </option>
                          <option value={new Date().getFullYear()}>2023</option>
                          <option value={new Date().getFullYear() + 1}>
                            2024
                          </option>
                          <option value={new Date().getFullYear() + 2}>
                            2025
                          </option>
                          <option value={new Date().getFullYear() + 3}>
                            2026
                          </option>
                          {/* Add more options for additional years */}
                        </select>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="wrapper">
                        <div className="charts">
                          <div className="chart">
                            {selectedYear && (
                              <canvas
                                data-type="line"
                                data-color-datalabels="#2e2a2a"
                                id="my-chart"
                                ref={(ref) => {
                                  if (ref) {
                                    const { type, colorDatalabels } =
                                      ref.dataset;

                                    const data = {
                                      labels: MONTHS.slice(0, 12),
                                      datasets: [
                                        {
                                          label: "Revenue",
                                          backgroundColor: "rgb(255, 99, 132)",
                                          borderColor: "rgb(255, 99, 132)",
                                          data: revenueDetail.monthlyReports.map(
                                            (report) => report.monthlyRevenue
                                          ),
                                          tension: 0.2,
                                        },
                                      ],
                                    };

                                    const config = {
                                      type: type,
                                      data: data,
                                      options: {
                                        aspectRatio: 16 / 9,
                                        layout: {
                                          padding: 10,
                                        },
                                        plugins: {
                                          tooltip: {
                                            titleFont: {
                                              size: 22,
                                            },
                                            bodyFont: {
                                              size: 22,
                                            },
                                            callbacks: {
                                              label: (context) =>
                                                `Total: ${context.formattedValue} VNĐ`,
                                            },
                                          },
                                          datalabels: {
                                            color: colorDatalabels,
                                            font: { size: 18 },
                                            formatter: function (
                                              value,
                                              context
                                            ) {
                                              return value;
                                            },
                                            display: function (context) {
                                              if (type === "line")
                                                return (
                                                  context.dataIndex > 0 &&
                                                  context.dataIndex <
                                                    MONTHS.length - 1
                                                );

                                              return true;
                                            },
                                          },
                                        },
                                      },
                                    };
                                    var chartExist = Chart.getChart("my-chart");
                                    if (chartExist != undefined) {
                                      chartExist.destroy();
                                    } else {
                                      chartExist = new Chart(ref, config);
                                    }
                                  }
                                }}
                              />
                            )}
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
      )}
    </>
  );
}
