import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../constants/api";
import "./ScheduleTrainee.scss";
import HeaderHome from "../../component/HeaderHome/HeaderHome";

export default function ScheduleTrainee() {
  const [schedule, setSchedule] = useState([]);
  const [timeFrames, setTimeFrames] = useState([]);

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
    api
      .get("/Timeframe/GetTimeFrameList")
      .then((res) => {
        setTimeFrames(res.data);
      })
      .catch((err) => {});

    api
      .get("/Trainee/getListClassForTrainee", {
        params: { id: id },
      })
      .then((res) => {
        setSchedule(res.data);
      })
      .catch((err) => {});
  }, [id]);
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
              <h1 className="m-0 p-0 mb-4">
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
                    <th className="text-uppercase">Monday</th>
                    <th className="text-uppercase">Tuesday</th>
                    <th className="text-uppercase">Wednesday</th>
                    <th className="text-uppercase">Thursday</th>
                    <th className="text-uppercase">Friday</th>
                    <th className="text-uppercase">Saturday</th>
                    <th className="text-uppercase">Sunday</th>
                  </tr>
                </thead>
                <tbody>
                  {timeFrames.map((timeFrame) => (
                    <tr key={timeFrame.id}>
                      <td className="align-middle">{timeFrame.timeFrame1}</td>
                      {listOfDay.map((theDay, index) => {
                        return (
                          <td key={`${theDay}+${timeFrame.id}`} className="p-1">
                            {schedule
                              .filter((item) =>
                                item.schedule.some(
                                  (s) =>
                                    s.date.trim().includes(theDay) &&
                                    s.timeframeId === timeFrame.id
                                )
                              )
                              .map((filteredItem) => (
                                <div
                                  className="content"
                                  key={filteredItem.courseId}
                                >
                                  <img
                                    src={filteredItem.courseImg}
                                    style={{
                                      width: "100px",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <Link
                                    className="title text-decoration-none"
                                    to={`/trainee/classDetail/${filteredItem.classId}`}
                                  >
                                    <p
                                      className="m-0 p-0 mt-2"
                                      title="View detail"
                                    >
                                      {filteredItem.courseName}
                                    </p>
                                  </Link>

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
          </div>
        </section>
      </div>
    </>
  );
}
