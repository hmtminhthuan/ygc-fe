import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../constants/api";
import "./ScheduleTrainee.scss";

export default function ScheduleTrainee() {
  const [schedule, setSchedule] = useState([]);
  const [timeFrames, setTimeFrames] = useState([]);

  // const { id } = useParams();
  const id = JSON.parse(localStorage.getItem("USER_LOGIN")).accountID;
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
    <div className="main--content bg-white">
      {/* <div className="timetable-img text-center">
        <img src="img/content/timetable.png" alt />
      </div> */}
      <section className="trainee-area pt-3 pb-3">
        <div className="row flex trainee mt-2 mx-5 mb-5">
          <div className="headerlist mt-3">
            <h1 className="m-0 p-0 mb-4">
              <i className="ri-bookmark-line"></i> Schedule
            </h1>
          </div>
          <div className="">
            <Link
              to={"/"}
              className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
              style={{ fontSize: "18px", fontWeight: "500" }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span className="mx-2">Back</span>
            </Link>
          </div>
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
                </tr>
              </thead>
              <tbody>
                {timeFrames.map((timeFrame) => (
                  <tr key={timeFrame.id}>
                    <td className="align-middle">{timeFrame.timeFrame1}</td>
                    <td>
                      {schedule
                        .filter((item) =>
                          item.schedule.some(
                            (s) =>
                              s.date === "Monday" &&
                              s.timeframeId === timeFrame.id
                          )
                        )
                        .map((filteredItem) => (
                          <div className="content" key={filteredItem.courseId}>
                            <img
                              src={filteredItem.courseImg}
                              style={{ width: "100px" }}
                            />
                            <p
                              style={{ fontWeight: "bold", cursor: "pointer" }}
                            >
                              {filteredItem.courseName}
                            </p>
                            <p>Class:</p>
                            <p>Room: </p>
                          </div>
                        ))}
                    </td>
                    <td>
                      {schedule
                        .filter((item) =>
                          item.schedule.some(
                            (s) =>
                              s.date === "Tuesday" &&
                              s.timeframeId === timeFrame.id
                          )
                        )
                        .map((filteredItem) => (
                          <div className="content" key={filteredItem.courseId}>
                            <img
                              src={filteredItem.courseImg}
                              style={{ width: "100px" }}
                            />
                            <p
                              style={{ fontWeight: "bold", cursor: "pointer" }}
                            >
                              {filteredItem.courseName}
                            </p>
                            <p>Class:</p>
                            <p>Room: </p>
                          </div>
                        ))}
                    </td>
                    <td>
                      {schedule
                        .filter((item) =>
                          item.schedule.some(
                            (s) =>
                              s.date === "Wednesday" &&
                              s.timeframeId === timeFrame.id
                          )
                        )
                        .map((filteredItem) => (
                          <div className="content" key={filteredItem.courseId}>
                            <img
                              src={filteredItem.courseImg}
                              style={{ width: "100px" }}
                            />
                            <p
                              style={{ fontWeight: "bold", cursor: "pointer" }}
                            >
                              {filteredItem.courseName}
                            </p>
                            <p>Class:</p>
                            <p>Room: </p>
                          </div>
                        ))}
                    </td>
                    <td>
                      {schedule
                        .filter((item) =>
                          item.schedule.some(
                            (s) =>
                              s.date === "Thursday" &&
                              s.timeframeId === timeFrame.id
                          )
                        )
                        .map((filteredItem) => (
                          <div className="content" key={filteredItem.courseId}>
                            <img
                              src={filteredItem.courseImg}
                              style={{ width: "100px" }}
                            />
                            <p
                              style={{ fontWeight: "bold", cursor: "pointer" }}
                            >
                              {filteredItem.courseName}
                            </p>
                            <p>Class:</p>
                            <p>Room: </p>
                          </div>
                        ))}
                    </td>
                    <td>
                      {schedule
                        .filter((item) =>
                          item.schedule.some(
                            (s) =>
                              s.date === "Friday" &&
                              s.timeframeId === timeFrame.id
                          )
                        )
                        .map((filteredItem) => (
                          <div className="content" key={filteredItem.courseId}>
                            <img
                              src={filteredItem.courseImg}
                              style={{ width: "100px" }}
                            />
                            <p
                              style={{ fontWeight: "bold", cursor: "pointer" }}
                            >
                              {filteredItem.courseName}
                            </p>
                            <p>Class:</p>
                            <p>Room: </p>
                          </div>
                        ))}
                    </td>
                    <td>
                      {schedule
                        .filter((item) =>
                          item.schedule.some(
                            (s) =>
                              s.date === "Saturday" &&
                              s.timeframeId === timeFrame.id
                          )
                        )
                        .map((filteredItem) => (
                          <div className="content" key={filteredItem.courseId}>
                            <img
                              src={filteredItem.courseImg}
                              style={{ width: "100px" }}
                            />
                            <p
                              style={{ fontWeight: "bold", cursor: "pointer" }}
                            >
                              {filteredItem.courseName}
                            </p>
                            <p>Class:</p>
                            <p>Room: </p>
                          </div>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
