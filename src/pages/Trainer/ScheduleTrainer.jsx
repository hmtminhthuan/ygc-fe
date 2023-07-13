import React, { useEffect, useLayoutEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { api } from "../../constants/api";
import "./ScheduleTrainer.scss";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Swal from "sweetalert2";
import Aos from "aos";

export default function ScheduleTrainer() {
  localStorage.setItem("MENU_ACTIVE", "/trainer/schedule");
  const [schedule, setSchedule] = useState([]);
  const [timeFrames, setTimeFrames] = useState([]);
  const [classList, setClassList] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const [responsiveMobile, setResponsiveMobile] = useState(false);
  const [scheduelTableWidth, setScheduelTableWidth] = useState(-1);
  const listOfDay = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  // const { id } = useParams();
  const id = JSON.parse(localStorage.getItem("USER_LOGIN")).accountID;

  useEffect(() => {
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      timer: 1200,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });

    let schedule_table_area = document.querySelector("div#schedule-table-area");

    if (
      schedule_table_area.offsetWidth > 0 &&
      schedule_table_area.offsetWidth <= 800
    ) {
      setResponsive(true);
    } else {
      setResponsive(false);
    }

    if (
      schedule_table_area.offsetWidth > 0 &&
      schedule_table_area.offsetWidth <= 680
    ) {
      setResponsiveMobile(true);
    } else {
      setResponsiveMobile(false);
    }

    let the_table_area = document.querySelector("table#the-table-area");
    setInterval(() => {
      if (
        the_table_area.offsetWidth > 0 &&
        the_table_area.offsetWidth != scheduelTableWidth
      ) {
        setScheduelTableWidth(parseInt(the_table_area.offsetWidth));
      }
    }, 100);

    api
      .get("/Timeframe/GetTimeFrameList")
      .then((res) => {
        setTimeFrames(res.data);
      })
      .catch((err) => {});

    api
      .get("/Trainer/getListClassForTrainer", {
        params: { id: id },
      })
      .then((res) => {
        setSchedule(
          res.data.filter(
            (classItem) => new Date(classItem.endDate) >= new Date()
          )
        );
        setIsDataLoaded(true);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      Swal.close();
    }
  }, [isDataLoaded]);

  useEffect(() => {
    let schedule_table_area = document.querySelector("div#schedule-table-area");
    if (
      schedule_table_area.offsetWidth < 800 ||
      schedule_table_area.offsetWidth > 886
    ) {
      let interval = setInterval(() => {
        let res = responsive;
        if (
          schedule_table_area.offsetWidth > 0 &&
          schedule_table_area.offsetWidth <= 800 &&
          !res
        ) {
          setResponsive(true);
          clearInterval(interval);
        }
        if (schedule_table_area.offsetWidth > 800 && res) {
          setResponsive(false);
          clearInterval(interval);
        }
      }, 100);
    } else {
      if (!responsive) {
        setResponsive(true);
      }
    }
  }, [responsive]);

  useEffect(() => {
    let schedule_table_area = document.querySelector("div#schedule-table-area");

    let interval = setInterval(() => {
      let resMobile = responsiveMobile;
      if (
        schedule_table_area.offsetWidth > 0 &&
        schedule_table_area.offsetWidth <= 680 &&
        !resMobile
      ) {
        setResponsiveMobile(true);
        setResponsive(false);
        clearInterval(interval);
      }
      if (schedule_table_area.offsetWidth > 680 && resMobile) {
        setResponsiveMobile(false);
        setResponsive(true);
        clearInterval(interval);
      }
    }, 100);
  }, [responsiveMobile]);

  useEffect(() => {
    let the_table_area = document.querySelector("table#the-table-area");
    let interval = setInterval(() => {
      if (
        the_table_area.offsetWidth > 0 &&
        the_table_area.offsetWidth != scheduelTableWidth
      ) {
        setScheduelTableWidth(parseInt(the_table_area.offsetWidth));
        clearInterval(interval);
      }
    }, 100);
  }, [scheduelTableWidth]);

  Aos.init();
  return (
    <>
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>
      <div className="main--content bg-white">
        <section className="trainer-area pt-3 pb-3">
          <div
            className={`row flex trainer mt-2 mb-4 
          ${responsive ? "mx-1" : "mx-5"}`}
          >
            <div className="headerlist mt-5">
              <h1
                className="m-0 p-0 mb-4"
                style={{ color: "rgb(229, 64, 174)" }}
              >
                <i className="ri-bookmark-line"></i> Schedule
              </h1>
            </div>
            {/* <div className="">
              <Link
                to={"/"}
                className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                style={{ fontSize: "18px", fontWeight: "500" }}
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span className="mx-2">Back</span>
              </Link>
            </div> */}
            <div
              className="schedule-trainee"
              id="schedule-table-area"
              style={{
                width: "100vw",
                overflowX: `${responsiveMobile ? "scroll" : ""}`,
              }}
            >
              <table
                className="table-bordered text-center"
                id="the-table-area"
                style={{
                  fontSize: `${responsive ? "12px" : ""}`,
                  borderBottomLeftRadius: `${responsiveMobile ? "0" : ""}`,
                  borderBottomRightRadius: `${responsiveMobile ? "0" : ""}`,
                }}
                data-aos="zoom-in-down"
                data-aos-duration="100"
                data-aos-delay="300"
                data-aos-offset="0"
              >
                <thead>
                  <tr className="bg-light-gray">
                    <th
                      className="text-uppercase"
                      style={{
                        width: `${(scheduelTableWidth / 8).toString() + "px"}`,
                        border: "2px solid gray",
                      }}
                    >
                      Time
                    </th>
                    {listOfDay.map((item, index) => {
                      return (
                        <th
                          key={`${item}${index}`}
                          style={{
                            width: `${
                              (scheduelTableWidth / 8).toString() + "px"
                            }`,
                            border: "2px solid gray",
                          }}
                          className="text-uppercase"
                        >
                          {item}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {timeFrames.map((timeFrame) => (
                    <tr key={timeFrame.id}>
                      <td
                        className="align-middle"
                        style={{
                          fontWeight: "bold",
                          width: `${
                            (scheduelTableWidth / 8).toString() + "px"
                          }`,
                        }}
                      >
                        {responsive ? (
                          <>
                            {timeFrame.timeFrame1
                              .split("-")
                              .map((item, index) => {
                                if (index === 0) {
                                  return (
                                    <span key={index}>
                                      {item}
                                      <br></br>- - -<br></br>
                                    </span>
                                  );
                                }
                                return <span key={index}>{item}</span>;
                              })}
                          </>
                        ) : (
                          <>
                            {timeFrame.timeFrame1
                              .split("-")
                              .map((item, index) => {
                                if (index === 0) {
                                  return <span key={index}>{item} - </span>;
                                }
                                return <span key={index}>{item}</span>;
                              })}
                          </>
                        )}
                      </td>
                      {listOfDay.map((theDay, index) => {
                        return (
                          <td
                            key={`${theDay}+${timeFrame.id}+${index}`}
                            className="p-1"
                            style={{
                              width: `${
                                (scheduelTableWidth / 8).toString() + "px"
                              }`,
                            }}
                          >
                            {schedule
                              .filter((item) =>
                                item.schedule.some(
                                  (s) =>
                                    s.date
                                      .trim()
                                      .toLowerCase()
                                      .includes(theDay.toLowerCase()) &&
                                    s.timeframeId === timeFrame.id
                                )
                              )
                              .map((filteredItem) => (
                                <div
                                  className="content py-3"
                                  key={filteredItem.courseId}
                                >
                                  <img
                                    src={filteredItem.courseImg}
                                    style={{
                                      width: "80px",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <NavLink
                                    className="title text-decoration-none"
                                    to={`/trainer/classDetail/${filteredItem.classId}`}
                                  >
                                    <p
                                      className="m-0 p-0 mt-2"
                                      title="View detail"
                                      style={{ color: "rgb(229, 64, 174)" }}
                                    >
                                      {filteredItem.courseName}
                                    </p>
                                  </NavLink>

                                  <p className="m-0 p-0">
                                    Class: {filteredItem.className}
                                  </p>
                                  <p className="m-0 p-0">
                                    Room: {filteredItem.room}
                                  </p>
                                </div>
                              ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p
              className="m-0 p-0 mt-1 ms-3"
              style={{ fontSize: "18px", fontWeight: "bold" }}
            >
              Current Class:{" "}
              {
                schedule.filter(
                  (classItem) => new Date(classItem.endDate) >= new Date()
                ).length
              }
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
