import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { api } from "../../constants/api";
import "./ScheduleTrainee.scss";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Swal from "sweetalert2";

export default function ScheduleTrainee() {
  localStorage.setItem("MENU_ACTIVE", "/trainee/schedule");
  const [schedule, setSchedule] = useState([]);
  const [timeFrames, setTimeFrames] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // const { id } = useParams();
  const id = JSON.parse(localStorage.getItem("USER_LOGIN")).accountID;
  const listOfDay = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
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
    api
      .get("/Timeframe/GetTimeFrameList")
      .then((res) => {
        setTimeFrames(res.data);
      })
      .catch((err) => {});

    api
      .get("/Trainee/getCurrentListClassForTrainee", {
        params: { id: id },
      })
      .then((res) => {
        setSchedule(res.data);
      })
      .catch((err) => {});
  }, [id]);

  useEffect(() => {
    if (isDataLoaded) {
      Swal.close();
    }
  }, [isDataLoaded]);
  return (
    <>
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>
      <div className="main--content bg-white">
        {/* <div className="timetable-img text-center">
        <img src="img/content/timetable.png" alt />
      </div> */}
        <section className="trainer-area pt-3 pb-3">
          <div className="row flex trainer mt-2 mx-5 mb-5">
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
            <div className="schedule-trainee">
              <table className="table-bordered text-center ">
                <thead>
                  <tr className="bg-light-gray">
                    <th className="text-uppercase">Time</th>
                    {listOfDay.map((item, index) => {
                      return (
                        <th key={`${item}${index}`} className="text-uppercase">
                          {`${item}`}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {timeFrames.map((timeFrame) => (
                    <tr key={timeFrame.id}>
                      <td className="align-middle">{timeFrame.timeFrame1}</td>
                      {listOfDay.map((theDay, index) => {
                        return (
                          <td
                            key={`${theDay}+${timeFrame.id}+${index}`}
                            className="p-1"
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
                                      width: "100px",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <NavLink
                                    className="title text-decoration-none"
                                    to={`/trainee/classDetail/${filteredItem.classId}`}
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
                                  {/* <p className="m-0 p-0">
                                    Start: {filteredItem.startDate}
                                  </p>
                                  <p className="m-0 p-0">
                                    End: {filteredItem.endDate}
                                  </p> */}
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
          </div>
        </section>
      </div>
    </>
  );
}
