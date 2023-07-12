import React, { useEffect, useState } from "react";
import { api } from "../../../../constants/api";
import Swal from "sweetalert2";
import { NavLink, useParams } from "react-router-dom";
import MenuStaff from "../../../../component/Staff/MenuStaff";
import HeaderStaff from "../../../../component/Staff/HeaderStaff";
import maleImg from "../../../../assets/images/avt-male.jpg";
import femaleImg from "../../../../assets/images/avt-female.jpg";

export default function FeedbackManagementDetail() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [sortedStatus, setSortedStatus] = useState("");
  const [searchedName, setSearchedName] = useState("");
  const [listOfSearchedName, setListOfSearchedName] = useState([]);
  const [course, setCourse] = useState({});
  const param = useParams();
  const [recently, setRecently] = useState([]);
  const [sortedRecently, setSortedRecently] = useState(false);

  const renderCourseName = () => {
    api
      .get(`Course/GetCourseByID?id=${param.id}`)
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {});
  };

  const renderFeedbackList = () => {
    let feedbackListStart = [];
    api
      .get(`Feedback/GetCourseFeedbackbyIdForStaff?courseId=${param.id}`)
      .then((res) => {
        feedbackListStart = res.data;
        feedbackListStart = feedbackListStart.sort(
          (a, b) => a.courseId - b.courseId
        );
        feedbackListStart = feedbackListStart.sort(
          (a, b) => a.status - b.status
        );
        setFeedbackList(feedbackListStart);
      })
      .catch((err) => {})
      .finally(() => {
        feedbackListStart.forEach((item) => {
          let newList = [];
          api
            .get(`/Feedback/GetFeedbackDetailForAdmin?feedbackId=${item.id}`)
            .then((res) => {
              item.detail = res.data;
              newList = [...feedbackListStart].filter((fb) => {
                return fb.id.toString() != item.id.toString();
              });
              newList = [...newList, item];
            })
            .catch((err) => {})
            .finally(() => {
              newList = newList.sort((a, b) => a.courseId - b.courseId);
              newList = newList.sort((a, b) => a.status - b.status);
              setFeedbackList(newList);
            });
        });
      });
  };

  useEffect(() => {
    renderCourseName();
    renderFeedbackList();
  }, []);

  useEffect(() => {
    if (searchedName == "") {
      setListOfSearchedName([]);
    } else {
      let list = [];
      let values = searchedName.split(" ");
      values.forEach((item) => {
        if (item.trim() != "") {
          list = [...list, item.trim()];
          setListOfSearchedName(list);
        }
      });
    }
  }, [searchedName]);

  const handleFeedback = (fb, stt) => {
    let { id, traineeId, courseId, rating, status, description } = fb;
    let feedback = { id, traineeId, courseId, rating, status, description };
    feedback.status = stt;
    setRecently([...recently, id]);
    api
      .put(`/Feedback/UpdateFeedback`, feedback)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        renderFeedbackList();
      });
  };

  return (
    <>
      <HeaderStaff />
      <section className="main" id="staff-feedback-management-area">
        <MenuStaff />
        <div className="main--content">
          <section class="staff-list-area p-0 mt-2 px-4">
            <div className="w-100">
              <div className="text-start">
                <NavLink
                  to={"/staff/feedbackManagement"}
                  className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                  style={{ fontSize: "18px", fontWeight: "500" }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span className="mx-2">Back</span>
                </NavLink>
              </div>
              <h2
                className="m-0 p-0 text-center"
                // style={{ color: "#3b42c9" }}
              >
                Feedback Details
              </h2>
              <h5
                className="m-0 p-0 py-1 my-3 mt-0 text-center"
                // style={{ color: "#3b42c9" }}
              >
                Course Name: {course.courseName}{" "}
              </h5>
            </div>
            <div
              className="flex justify-content-between align-items-end"
              style={{ width: "97%", margin: "0 auto" }}
            >
              <div className="my-1">
                <span className="px-2">Search by Name</span>
                <input
                  type="search"
                  placeholder="Enter part of name..."
                  style={{
                    borderRadius: "5px",
                    border: "1px solid gray",
                    outline: "none",
                  }}
                  className="px-1"
                  value={searchedName}
                  onChange={(e) => {
                    setSearchedName(e.target.value);
                  }}
                />
              </div>
              <div className="my-1">
                {recently.length > 0 && !sortedRecently ? (
                  <button
                    className="border-0 p-0 m-0 px-2 text-light"
                    style={{ borderRadius: "3px", backgroundColor: "#e36bc9" }}
                    onClick={() => {
                      setSortedStatus("");
                      setSortedRecently(true);
                    }}
                  >
                    Recently
                  </button>
                ) : (
                  <></>
                )}
                {recently.length > 0 && sortedRecently ? (
                  <button
                    className="border-0 p-0 m-0 px-2 bg-black bg-opacity-75 text-light"
                    style={{ borderRadius: "3px" }}
                    onClick={() => {
                      setSortedStatus("");
                      setSortedRecently(false);
                    }}
                  >
                    View All
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <table>
              <thead className="table-head">
                <tr>
                  <th>No.</th>
                  <th style={{ textAlign: "center" }}>Detail</th>
                  <th
                    style={{ textAlign: "center" }}
                    className="flex justify-content-center"
                  >
                    Status
                    <span style={{ marginLeft: "5px" }}>
                      {sortedStatus != "" ? (
                        <i
                          className="fa fa-filter symbol-sorting"
                          aria-hidden="true"
                        ></i>
                      ) : (
                        <></>
                      )}
                    </span>
                    <select
                      name="sortedStatus"
                      id="sortedStatus"
                      className="selection-button"
                      value={sortedStatus}
                      onChange={(e) => {
                        setSortedStatus(e.target.value);
                      }}
                      style={{ width: "20px" }}
                    >
                      <option value="0">Pending</option>
                      <option value="1">Censored</option>
                      <option value="2">Deleted</option>
                      <option value="">All</option>
                    </select>
                  </th>
                  <th style={{ textAlign: "center" }}>Censor</th>
                  <th style={{ textAlign: "center" }}>Delete</th>
                </tr>
              </thead>
              <tbody style={{ height: "auto" }}>
                {feedbackList
                  .filter((item) => {
                    if (item.detail != null && item.detail != undefined) {
                      if (listOfSearchedName.length <= 0) {
                        return true;
                      } else if (listOfSearchedName.length <= 1) {
                        for (let i = 0; i < listOfSearchedName.length; i++) {
                          if (
                            item.detail.firstname
                              .trim()
                              .toLowerCase()
                              .includes(
                                listOfSearchedName[i]
                                  .toString()
                                  .trim()
                                  .toLowerCase()
                              ) ||
                            item.detail.lastname
                              .trim()
                              .toLowerCase()
                              .includes(
                                listOfSearchedName[i]
                                  .toString()
                                  .trim()
                                  .toLowerCase()
                              )
                          ) {
                            return true;
                          }
                        }
                      } else {
                        let fullname = `${item.detail.firstname} ${item.detail.lastname}`;
                        let fullnameReverse = `${item.detail.lastname} ${item.detail.firstname}`;
                        if (
                          searchedName
                            .trim()
                            .toLowerCase()
                            .includes(fullname.toLowerCase()) ||
                          searchedName
                            .trim()
                            .toLowerCase()
                            .includes(fullnameReverse.toLowerCase())
                        ) {
                          return true;
                        }
                      }
                      return false;
                    } else {
                      return true;
                    }
                  })
                  .filter((item) =>
                    item.status.toString().trim().includes(sortedStatus)
                  )
                  .filter((item) => {
                    if (sortedRecently) {
                      if (
                        recently.findIndex((obj) => {
                          return obj == item.id;
                        }) >= 0
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    } else {
                      return true;
                    }
                  })
                  .map((feedback, index) => {
                    const {
                      id,
                      traineeId,
                      courseId,
                      rating,
                      status,
                      description,
                      coursename,
                      detail,
                    } = feedback;
                    return (
                      <tr key={index} className={`row-bg-${index % 2} `}>
                        <td
                          className={`${
                            recently.findIndex((obj) => {
                              return obj == id;
                            }) >= 0
                              ? "new-row-feedback-handle"
                              : ""
                          }`}
                          style={{ verticalAlign: "top", fontWeight: "bolder" }}
                        >
                          {index + 1}
                        </td>
                        <td>
                          <div className="row flex justify-content-start align-items-start">
                            <div className="col-2 flex justify-content-end align-items-start mx-2">
                              <img
                                className={`course-feedback-trainee-img-null-`}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  border: "1px solid #33333330",
                                }}
                                src={
                                  detail != null &&
                                  detail != undefined &&
                                  detail.img != null &&
                                  detail.img != undefined &&
                                  detail.img.toLowerCase().trim() == "male"
                                    ? maleImg
                                    : femaleImg
                                }
                              />
                            </div>
                            <div className="col-9">
                              <p
                                className="p-0 m-0 text-start"
                                style={{ fontWeight: "600" }}
                              >
                                {detail != null && detail != undefined ? (
                                  <>
                                    <span> {detail.firstname}</span>{" "}
                                    <span> {detail.lastname}</span>{" "}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </p>
                              <p className="p-0 mt-2 text-start">
                                <span
                                  style={{
                                    color: "#e47200",
                                    fontWeight: "500",
                                  }}
                                >
                                  Rating:
                                </span>{" "}
                                <i
                                  className={`fa-solid fa-star ${
                                    rating >= 1 ? "star-active" : ""
                                  }`}
                                ></i>
                                <i
                                  className={`fa-solid fa-star ${
                                    rating >= 2 ? "star-active" : ""
                                  }`}
                                ></i>
                                <i
                                  className={`fa-solid fa-star ${
                                    rating >= 3 ? "star-active" : ""
                                  }`}
                                ></i>
                                <i
                                  className={`fa-solid fa-star ${
                                    rating >= 4 ? "star-active" : ""
                                  }`}
                                ></i>
                                <i
                                  className={`fa-solid fa-star ${
                                    rating >= 5 ? "star-active" : ""
                                  }`}
                                ></i>
                              </p>

                              <p style={{ textAlign: "justify" }}>
                                {description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          {status == 0 ? (
                            <span
                              style={{ fontWeight: "600" }}
                              className="text-warning"
                            >
                              Pending
                            </span>
                          ) : (
                            ""
                          )}
                          {status == 1 ? (
                            <span
                              style={{ fontWeight: "600" }}
                              className="text-success"
                            >
                              Censored
                            </span>
                          ) : (
                            ""
                          )}
                          {status == 2 ? (
                            <span
                              style={{ fontWeight: "600" }}
                              className="text-danger"
                            >
                              Deleted
                            </span>
                          ) : (
                            ""
                          )}
                        </td>
                        <td>
                          {status != 1 ? (
                            <button
                              className="px-2 py-1 text-decoration-none text-success bg-success bg-opacity-10 border-0  text-center"
                              style={{ borderRadius: "50%", fontSize: "15px" }}
                              onClick={() => {
                                handleFeedback(feedback, 1);
                              }}
                            >
                              <i className="fa-solid fa-circle-check" />
                            </button>
                          ) : (
                            <></>
                          )}
                        </td>
                        <td>
                          {status != 2 ? (
                            <button
                              className="px-2 py-1 text-decoration-none text-danger bg-danger bg-opacity-10 border-0  text-center"
                              style={{ borderRadius: "50%", fontSize: "15px" }}
                              onClick={() => {
                                handleFeedback(feedback, 2);
                              }}
                            >
                              <i className="fa-solid fa-trash" />
                            </button>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </section>
        </div>
      </section>
    </>
  );
}
