import React, { useEffect, useLayoutEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { api } from "../../constants/api";
import "./ScheduleTrainee.scss";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Swal from "sweetalert2";
import { faB } from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
import { Rating } from "@mui/material";
import { alert } from "../../component/AlertComponent/Alert";

export default function ScheduleTrainee() {
  localStorage.setItem("MENU_ACTIVE", "/trainee/schedule");
  const [schedule, setSchedule] = useState([]);
  const [timeFrames, setTimeFrames] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [listOfFinishedClasses, setListOfFinishedClasses] = useState([]);
  const [responsive, setResponsive] = useState(false);
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
  useLayoutEffect(() => {
    window.addEventListener("resize", function (event) {
      if (window.innerWidth <= 800 && !responsive) {
        setResponsive(true);
      }
      if (window.innerWidth > 800 && responsive) {
        setResponsive(false);
      }
    });
  }, []);
  const renderFeedbacks = () => {
    api
      .get(`/Trainee/getListClassForTrainee?id=${id}`)
      .then((res) => {
        setListOfFinishedClasses(res.data);
        let arr = [...res.data];
        arr.forEach((item) => {
          api
            .get(
              `/Feedback/GetCourseFeedbackbyIdForStaff?courseId=${item.courseId}`
            )
            .then((res) => {
              let fbArr = [];
              fbArr = res.data;
              fbArr = fbArr.filter((item) => item.traineeId == id);
              if (fbArr.length > 0) {
                item.feedback = fbArr[0];
              } else {
                item.feedback = {};
              }
            })
            .catch((err) => {})
            .finally(() => {
              setListOfFinishedClasses([...arr]);
            });
        });
      })
      .catch((err) => {});
  };
  useEffect(() => {
    // let timerInterval;
    // Swal.fire({
    //   title: "Loading...",
    //   timer: 800,
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    //   willClose: () => {
    //     clearInterval(timerInterval);
    //   },
    // });
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
    renderFeedbacks();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      Swal.close();
    }
  }, [isDataLoaded]);

  const handleSendFeedback = (courseId) => {
    let rate = -1;
    let des = "";
    Swal.fire({
      title: `<h3 style="font-weight:700; color:#d291bc">Thank you for your participation</h3>`,

      html: `<h5 style="text-align:center;">We hope that you would enjoy your journey with this course.
      It is our pleasure to receive your feedback to enhance more.</h5><hr>
      <h4 style="text-align:center; margin:0px; padding:0px; color:#d291bc">Rating</h4>
      <p style="text-align:center; margin:0px; padding:0px; font-size:13px">Click to rate our course</p><div>
      <div style="margin-top:10px">
      <button  type="button" value="terrible" class="btn feel btnRate"><i class="fa-solid fa-star" id="rate-star-1"></i></button>
      <button " type="button" value="bad" class="btn feel btnRate"><i class="fa-solid fa-star" id="rate-star-2"></i></button>
      <button  type="button" value="normal" class="btn feel btnRate"><i class="fa-solid fa-star" id="rate-star-3"></i></button>
      <button  type="button" value="good" class="btn feel btnRate"><i class="fa-solid fa-star" id="rate-star-4"></i></button>
      <button  type="button" value="wonderful" class="btn feel btnRate"><i class="fa-solid fa-star" id="rate-star-5"></i></button>
      </div><hr>
      <h4 style="text-align:center; margin:0px; padding:0px; color:#d291bc">How did you feel about this course?</h4>
      <p style="text-align:center; margin:0px; padding:0px; font-size:13px">Please share your opinion about our course 
      </p>
      <textarea
      style="width:90%;padding:10px 20px; margin-top:10px"
      value="${rate}"
      placeholder="Enter your opinion... (optional)"
      id="input-feedback-description"
    ></textarea>`,
      closeOnClickOutside: false,
      allowOutsideClick: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Send Feedback",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d291bc",
      cancelButtonColor: "#000",
      focusCancel: false,
      focusConfirm: false,
      buttons: {
        confirm: {
          text: "Close",
          value: "",
          visible: true,
          className: "btn btn-default",
          closeModal: true,
        },
      },
      didOpen: () => {
        for (let j = 1; j <= 5; j++) {
          Swal.getHtmlContainer().querySelector(`#rate-star-${j}`).style.color =
            "#FAAF00";
        }
        let buttons = Swal.getHtmlContainer().getElementsByClassName("btnRate");
        for (let i = 0; i <= buttons.length; i++) {
          buttons[i].addEventListener("click", () => {
            // setFeedbackRate(i + 1);
            rate = i + 1;
            for (let j = 1; j <= 5; j++) {
              Swal.getHtmlContainer().querySelector(
                `#rate-star-${j}`
              ).style.color = "#000";
            }
            for (let t = 1; t <= i + 1; t++) {
              Swal.getHtmlContainer().querySelector(
                `#rate-star-${t}`
              ).style.color = "#FAAF00";
            }
          });
          let description = Swal.getHtmlContainer().querySelector(
            `#input-feedback-description`
          );
          description.addEventListener("change", (e) => {
            // setFeedbackDes(e.target.value);
            des = e.target.value;
          });
        }
      },
    }).then((result) => {
      if (result.isDenied === true || result.isDismissed === true) {
      } else if (result.isConfirmed === true) {
        api
          .post(`/Feedback/SendFeedback`, {
            traineeId: parseInt(id),
            courseId: parseInt(courseId),
            rating: parseInt(rate),
            status: 0,
            description: des,
          })
          .then((res) => {
            alert.alertSuccessWithTime(
              "Send Feedback Successfully",
              "Thank you for your spending time",
              3000,
              "30",
              () => {}
            );
            setTimeout(() => {
              renderFeedbacks();
            }, 3000);
          })
          .catch((err) => {});
      }
    });
  };

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
            <div className="schedule-trainee">
              <table
                className="table-bordered text-center "
                style={{ fontSize: `${responsive ? "12px" : ""}` }}
              >
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
          {listOfFinishedClasses.length > 0 ? (
            <div
              className={`row flex trainer mt-5 mb-5 
            ${responsive ? "mx-4" : "mx-5"}`}
            >
              <div>
                <h4 className="mb-4 text-center" style={{ color: "#e540ae" }}>
                  <i className="ri-bookmark-line"></i> Finished Courses
                </h4>
              </div>
              <div className="row">
                {listOfFinishedClasses
                  .filter((item) => {
                    return new Date(`${item.endDate}`).getTime() -
                      new Date().getTime() <
                      0
                      ? true
                      : false;
                  })
                  .map(
                    (
                      {
                        courseId,
                        courseName,
                        courseImg,
                        level,
                        className,
                        startDate,
                        endDate,
                        feedback,
                      },
                      index
                    ) => {
                      return (
                        <>
                          <div
                            key={index}
                            className="
                          col-md-12 px-5 mb-5 mt-1"
                            style={{
                              width: `${responsive ? "" : "70%"}`,
                              margin: "0 auto",
                            }}
                          >
                            <div
                              className="py-3 px-4 w-100"
                              style={{
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                                borderRadius: "15px",
                              }}
                            >
                              <div className="row">
                                {/* <div className="col-12 mb-3 px-4">
                                {" "}
                                <img
                                  src={courseImg}
                                  style={{
                                    width: "100%",
                                    borderRadius: "8px",
                                  }}
                                />
                              </div> */}
                                <div className="col-6 px-4 text-center">
                                  <span style={{ fontWeight: "600" }}>
                                    Course:
                                  </span>{" "}
                                  <span
                                    style={{
                                      display: `${responsive ? "none" : ""}`,
                                    }}
                                  >
                                    {courseName}
                                  </span>{" "}
                                  <p
                                    className="p-0 m-0"
                                    style={{
                                      display: `${!responsive ? "none" : ""}`,
                                    }}
                                  >
                                    {" "}
                                    {courseName}
                                  </p>
                                </div>
                                <div className="col-6 px-4 text-center">
                                  <span style={{ fontWeight: "600" }}>
                                    Class:
                                  </span>{" "}
                                  <span
                                    style={{
                                      display: `${responsive ? "none" : ""}`,
                                    }}
                                  >
                                    {" "}
                                    {className}
                                  </span>
                                  <p
                                    className="p-0 m-0"
                                    style={{
                                      display: `${!responsive ? "none" : ""}`,
                                    }}
                                  >
                                    {" "}
                                    {className}
                                  </p>
                                </div>
                                <div className="col-6 px-4 text-center mt-2">
                                  <span style={{ fontWeight: "600" }}>
                                    Start Date:
                                  </span>{" "}
                                  <span
                                    style={{
                                      display: `${responsive ? "none" : ""}`,
                                    }}
                                  >
                                    {" "}
                                    {moment(new Date(startDate)).format(
                                      "DD - MM - YYYY"
                                    )}
                                  </span>
                                  <p
                                    className="p-0 m-0"
                                    style={{
                                      display: `${!responsive ? "none" : ""}`,
                                    }}
                                  >
                                    {moment(new Date(startDate)).format(
                                      "DD - MM - YYYY"
                                    )}
                                  </p>
                                </div>
                                <div className="col-6 px-4 text-center mt-2">
                                  <span style={{ fontWeight: "600" }}>
                                    End Date:
                                  </span>{" "}
                                  <span
                                    style={{
                                      display: `${responsive ? "none" : ""}`,
                                    }}
                                  >
                                    {" "}
                                    {moment(new Date(endDate)).format(
                                      "DD - MM - YYYY"
                                    )}
                                  </span>
                                  <p
                                    className="p-0 m-0"
                                    style={{
                                      display: `${!responsive ? "none" : ""}`,
                                    }}
                                  >
                                    {moment(new Date(endDate)).format(
                                      "DD - MM - YYYY"
                                    )}
                                  </p>
                                </div>
                                <div className="col-12 flex justify-content-center mt-2">
                                  <hr className="m-0 p-0 mt-2 w-75" />
                                </div>
                                <div className="col-12 px-4  mt-2">
                                  {feedback != null &&
                                  feedback != undefined &&
                                  feedback.id != undefined &&
                                  feedback.id != null ? (
                                    <>
                                      <h5
                                        className="m-0 p-0 text-center"
                                        style={{
                                          fontWeight: "600",
                                          color: "#e540ae",
                                        }}
                                      >
                                        Your Feedback
                                      </h5>
                                      <div>
                                        <div className="flex justify-content-center mt-2">
                                          <p
                                            style={{ fontWeight: "600" }}
                                            className="m-0 p-0 mx-1"
                                          >
                                            Rating:
                                          </p>
                                          <p
                                            className="m-0 p-0 mx-1"
                                            style={{
                                              transform: "translateY(2px)",
                                            }}
                                          >
                                            <Rating
                                              className="m-0 p-0 flex align-items-center"
                                              name="half-rating-read"
                                              defaultValue={feedback.rating}
                                              precision={1}
                                              readOnly
                                              style={{ fontSize: "15px" }}
                                            />
                                          </p>
                                        </div>
                                        <div className="text-center mt-2">
                                          <p
                                            style={{ fontWeight: "600" }}
                                            className="m-0 p-0 mx-1"
                                          >
                                            Feedback
                                          </p>
                                          <div className=" flex justify-content-center">
                                            <p className="m-0 p-0 mx-1 w-75">
                                              {feedback.description}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      {parseInt(feedback.rating) <= 3 ? (
                                        <div className="text-center">
                                          <button
                                            className="m-0 p-0 border-0 text-light
                            px-3 py-1 mt-2"
                                            style={{
                                              fontWeight: "600",
                                              backgroundColor: "#e540ae",
                                              borderRadius: "20px",
                                            }}
                                            onClick={() => {}}
                                          >
                                            Edit Feedback
                                          </button>
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {feedback != null &&
                                  feedback != undefined &&
                                  (feedback.id == undefined ||
                                    feedback.id == null) ? (
                                    <div className="flex justify-content-center">
                                      {/* <h5 className="m-0 p-0">
                                    You have not sent any feedback
                                  </h5> */}
                                      <button
                                        className="m-0 p-0 border-0 text-light
                            px-3 py-1 mt-2"
                                        style={{
                                          fontWeight: "600",
                                          backgroundColor: "#e540ae",
                                          borderRadius: "20px",
                                        }}
                                        onClick={() => {
                                          handleSendFeedback(courseId);
                                        }}
                                      >
                                        Send Feedback Now
                                      </button>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    }
                  )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </section>
      </div>
    </>
  );
}
