import React, { useEffect, useState } from "react";
import { api } from "../../../constants/api";
import AdminCourseClasses from "../../Admin/CourseManagement/AdminCourseClasses/AdminCourseClasses";
import AdminCourseFeedback from "../../Admin/CourseManagement/AdminCourseFeedback/AdminCourseFeedback";
import MenuStaff from "../../../component/Staff/MenuStaff";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import { Rating } from "@mui/material";
import moment from "moment/moment";

export default function CourseView() {
  localStorage.setItem("MENU_ACTIVE", "/staff/course");
  const [courseList, setCourseList] = useState([]);
  const [renderCourseList, setRenderCourseList] = useState([]);
  const [infoMoreList, setInfoMoreList] = useState([]);
  const [searchedName, setSearchedName] = useState("");
  const [sortedLevel, setSortedLevel] = useState("");
  const [sortedName, setSortedName] = useState("Unsort");
  const [sortedDiscount, setSortedDiscount] = useState("Unsort");
  const [sortedPrice, setSortedPrice] = useState("Unsort");
  const [sortedTotalPrice, setSortedTotalPrice] = useState("Unsort");
  const [sortedClasses, setSortedClasses] = useState("Unsort");
  const [sortedRating, setSortedRating] = useState("Unsort");
  const [priority, setPriority] = useState("");
  const [renderCount, setRenderCount] = useState(0);
  const [renderCount2, setRenderCount2] = useState(0);
  const [viewData, setViewData] = useState(false);

  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      // style: "currency",
      currency: "VND",
    }).format(price);
  };

  const symbolSorting = (item) => {
    switch (item) {
      case "A-Z":
        return "fa-solid fa-arrow-up";
        break;
      case "ASC":
        return "fa-solid fa-arrow-up";
        break;
      case "Z-A":
        return "fa-solid fa-arrow-down";
        break;
      case "DESC":
        return "fa-solid fa-arrow-down";
        break;
      case "Unsort":
        return "";
        break;
    }
    return "";
  };

  const renderCourseForAdmin = () => {
    let courseListEnd = [];
    api
      .get("/Course/GetAllCourseForAdmin")
      .then((res) => {
        courseListEnd = res.data.sort((a, b) => a.courseID - b.courseID);
        let countNum = 0;
        courseListEnd.forEach(async (course) => {
          countNum++;
          await api
            .get("/Class/GetClassByCourseIDForAdmin", {
              params: { courseid: course.courseID },
            })
            .then((res) => {
              if (res.data.length > 0) {
                course.classInfo = res.data;
              } else {
                course.classInfo = [];
              }
            })
            .catch((err) => {
              course.classInfo = [];
            })
            .finally(() => {});

          api
            .get(
              `/Class/GetFinishedClassByCourseIDForAdmin?courseid=${course.courseID}`
            )
            .then((res) => {
              if (res.data.length > 0) {
                course.classInfoFinished = res.data;
              } else {
                course.classInfoFinished = [];
              }
            })
            .catch((err) => {
              course.classInfoFinished = [];
            })
            .finally(() => {});
          if (countNum == courseListEnd.length) {
            setRenderCount((pre) => pre + 1);
          }
        });

        let countNum2 = 0;
        courseListEnd.forEach(async (course) => {
          countNum2++;

          await api
            .get("/Feedback/GetCourseFeedbackbyIdForStaff", {
              params: { courseid: course.courseID },
            })
            .then((res) => {
              let feedbackInfo = res.data;
              let rating = 0;
              feedbackInfo.forEach((item) => {
                rating += item.rating;
              });
              if (feedbackInfo.length > 0) {
                rating = parseFloat(rating) / parseFloat(feedbackInfo.length);
                rating = rating.toFixed(2);
                course.feedbackInfo = feedbackInfo;
                course.rating = parseFloat(rating);
              } else {
                course.feedbackInfo = [];
                course.rating = 0;
              }
            })
            .catch((err) => {
              course.feedbackInfo = [];
              course.rating = 0;
            })
            .finally(() => {});

          if (countNum2 == courseListEnd.length) {
            setRenderCount2((pre) => pre + 1);
          }
        });
      })
      .catch((err) => {})
      .finally(() => {
        setRenderCourseList(courseListEnd);
        setCourseList(courseListEnd);
      });
  };

  useEffect(() => {
    renderCourseForAdmin();
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      timer: 1500,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
        setViewData(true);
      },
    });
  }, []);

  const resetSort = () => {
    if (
      sortedName.trim().toLowerCase().includes("unsort") &&
      sortedDiscount.trim().toLowerCase().includes("unsort") &&
      sortedPrice.trim().toLowerCase().includes("unsort") &&
      sortedTotalPrice.trim().toLowerCase().includes("unsort") &&
      sortedClasses.trim().toLowerCase().includes("unsort")
    ) {
      let render = [...courseList].sort((a, b) => a.courseID - b.courseID);
      setRenderCourseList(render);
    }
  };

  const resetSort2 = () => {
    let render = [...courseList].sort((a, b) => a.courseID - b.courseID);
    setRenderCourseList(render);
  };

  const unsortAll = () => {
    if (!sortedRating.trim().toLowerCase().includes("unsort")) {
      resetSort2();
      setSortedRating("Unsort");
    }
    setSortedName("Unsort");
    setSortedDiscount("Unsort");
    setSortedPrice("Unsort");
    setSortedTotalPrice("Unsort");
    setSortedClasses("Unsort");
  };

  useEffect(() => {
    switch (sortedName) {
      case "A-Z":
        setRenderCourseList(
          [...renderCourseList].sort((a, b) => {
            if (a.courseName.trim() < b.courseName.trim()) {
              return -1;
            }
            if (a.courseName.trim() > b.courseName.trim()) {
              return 1;
            }
            return 0;
          })
        );
        break;
      case "Z-A":
        setRenderCourseList(
          [...renderCourseList].sort((a, b) => {
            if (a.courseName.trim() > b.courseName.trim()) {
              return -1;
            }
            if (a.courseName.trim() < b.courseName.trim()) {
              return 1;
            }
            return 0;
          })
        );
        break;
      case "Unsort":
        resetSort();
        break;
      default:
        resetSort();
        break;
    }
  }, [sortedName]);

  useEffect(() => {
    switch (sortedDiscount) {
      case "ASC":
        setRenderCourseList(
          [...renderCourseList].sort((a, b) => a.discount - b.discount)
        );
        break;
      case "DESC":
        setRenderCourseList(
          [...renderCourseList].sort((a, b) => b.discount - a.discount)
        );
        break;
      case "Unsort":
        resetSort();
        break;
      default:
        resetSort();
        break;
    }
  }, [sortedDiscount]);

  useEffect(() => {
    switch (sortedPrice) {
      case "ASC":
        setRenderCourseList(
          [...renderCourseList].sort((a, b) => a.price - b.price)
        );
        break;
      case "DESC":
        setRenderCourseList(
          [...renderCourseList].sort((a, b) => b.price - a.price)
        );
        break;
      case "Unsort":
        resetSort();
        break;
      default:
        resetSort();
        break;
    }
  }, [sortedPrice]);

  useEffect(() => {
    switch (sortedTotalPrice) {
      case "ASC":
        setRenderCourseList(
          [...renderCourseList].sort(
            (a, b) =>
              a.price * (1 - a.discount / 100) -
              b.price * (1 - b.discount / 100)
          )
        );
        break;
      case "DESC":
        setRenderCourseList(
          [...renderCourseList].sort(
            (a, b) =>
              b.price * (1 - b.discount / 100) -
              a.price * (1 - a.discount / 100)
          )
        );
        break;
      case "Unsort":
        resetSort();
        break;
      default:
        resetSort();
        break;
    }
  }, [sortedTotalPrice]);

  useEffect(() => {
    switch (sortedClasses) {
      case "ASC":
        setRenderCourseList(
          [...renderCourseList].sort(
            (a, b) => a.classInfo.length - b.classInfo.length
          )
        );
        break;
      case "DESC":
        setRenderCourseList(
          [...renderCourseList].sort(
            (a, b) => b.classInfo.length - a.classInfo.length
          )
        );
        break;
      case "Unsort":
        resetSort();
        break;
      default:
        resetSort();
        break;
    }
  }, [sortedClasses]);

  useEffect(() => {
    switch (sortedRating) {
      case "ASC":
        setRenderCourseList(
          [...renderCourseList]
            .filter((item) => {
              return (
                item.feedbackInfo != null &&
                item.feedbackInfo != undefined &&
                item.feedbackInfo.length > 0
              );
            })
            .sort((a, b) => a.rating - b.rating)
        );
        break;
      case "DESC":
        setRenderCourseList(
          [...renderCourseList]
            .filter((item) => {
              return (
                item.feedbackInfo != null &&
                item.feedbackInfo != undefined &&
                item.feedbackInfo.length > 0
              );
            })
            .sort((a, b) => b.rating - a.rating)
        );
        break;
      case "Unsort":
        resetSort();
        break;
      default:
        resetSort();
        break;
    }
  }, [sortedRating]);

  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuStaff />
        <div className={`main--content ${!viewData ? "d-none" : ""}`}>
          {/* staff-course-view  */}
          <section class="staff-list-area p-0 mt-2 px-4">
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
            </div>
            <table>
              <thead className="table-head">
                <tr>
                  <th>No.</th>
                  {/* <th>ID</th> */}
                  <th>Image</th>
                  <th style={{ textAlign: "left" }}>
                    Name
                    <span style={{ marginLeft: "5px" }}>
                      <i
                        className={`${symbolSorting(
                          sortedName
                        )} symbol-sorting ${
                          !priority.includes("sortedName") ? "d-none" : ""
                        }`}
                      />
                    </span>
                    <select
                      name="sortedName"
                      id="sortedName"
                      className="selection-button"
                      value={sortedName}
                      onChange={(e) => {
                        unsortAll();
                        setSortedName(e.target.value);
                        if (e.target.value != "Unsort")
                          setPriority("sortedName");
                      }}
                      style={{ width: "20px" }}
                    >
                      <option value="A-Z">A-Z</option>
                      <option value="Z-A">Z-A</option>
                      <option value="Unsort">Unsort</option>
                    </select>
                  </th>
                  <th style={{ textAlign: "left" }}>
                    Level
                    <span style={{ marginLeft: "5px" }}>
                      {sortedLevel != "" ? (
                        <i
                          className="fa fa-filter symbol-sorting"
                          aria-hidden="true"
                        ></i>
                      ) : (
                        <></>
                      )}
                    </span>
                    <select
                      name="sortedLevel"
                      id="sortedLevel"
                      className="selection-button"
                      value={sortedLevel}
                      onChange={(e) => {
                        setSortedLevel(e.target.value);
                      }}
                      style={{ width: "20px" }}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="">All</option>
                    </select>
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <span>
                      <i
                        className={`${symbolSorting(
                          sortedDiscount
                        )} symbol-sorting ${
                          !priority.includes("sortedDiscount") ? "d-none" : ""
                        }`}
                      />
                    </span>
                    <select
                      name="sortedDiscount"
                      id="sortedDiscount"
                      className="selection-button"
                      value={sortedDiscount}
                      onChange={(e) => {
                        unsortAll();
                        setSortedDiscount(e.target.value);
                        if (e.target.value != "Unsort")
                          setPriority("sortedDiscount");
                      }}
                      style={{ width: "20px" }}
                    >
                      <option value="ASC">ASC</option>
                      <option value="DESC">DESC</option>
                      <option value="Unsort">Unsort</option>
                    </select>
                    {`Discount (%)`}
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <span style={{ marginLeft: "5px" }}>
                      <i
                        className={`${symbolSorting(
                          sortedPrice
                        )} symbol-sorting ${
                          !priority.includes("sortedPrice") ? "d-none" : ""
                        }`}
                      />
                    </span>
                    <select
                      name="sortedPrice"
                      id="sortedPrice"
                      className="selection-button"
                      value={sortedPrice}
                      onChange={(e) => {
                        unsortAll();
                        setSortedPrice(e.target.value);
                        if (e.target.value != "Unsort")
                          setPriority("sortedPrice");
                      }}
                      style={{ width: "20px" }}
                    >
                      <option value="ASC">ASC</option>
                      <option value="DESC">DESC</option>
                      <option value="Unsort">Unsort</option>
                    </select>
                    {`Price (VND)`}
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <span style={{ marginLeft: "5px" }}>
                      <i
                        className={`${symbolSorting(
                          sortedTotalPrice
                        )} symbol-sorting ${
                          !priority.includes("sortedTotalPrice") ? "d-none" : ""
                        }`}
                      />
                    </span>
                    <select
                      name="sortedTotalPrice"
                      id="sortedTotalPrice"
                      className="selection-button"
                      value={sortedTotalPrice}
                      onChange={(e) => {
                        unsortAll();
                        setSortedTotalPrice(e.target.value);
                        if (e.target.value != "Unsort")
                          setPriority("sortedTotalPrice");
                      }}
                      style={{ width: "20px" }}
                    >
                      <option value="ASC">ASC</option>
                      <option value="DESC">DESC</option>
                      <option value="Unsort">Unsort</option>
                    </select>
                    {`Total (VND)`}
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <span style={{ marginLeft: "5px" }}>
                      <i
                        className={`${symbolSorting(
                          sortedClasses
                        )} symbol-sorting ${
                          !priority.includes("sortedClasses") ? "d-none" : ""
                        }`}
                      />
                    </span>
                    <select
                      name="sortedClasses"
                      id="sortedClasses"
                      className="selection-button"
                      value={sortedClasses}
                      onChange={(e) => {
                        unsortAll();
                        setSortedClasses(e.target.value);
                        if (e.target.value != "Unsort")
                          setPriority("sortedClasses");
                      }}
                      style={{ width: "20px" }}
                    >
                      <option value="ASC">ASC</option>
                      <option value="DESC">DESC</option>
                      <option value="Unsort">Unsort</option>
                    </select>
                    Classes
                  </th>
                  <th style={{ textAlign: "center" }}>
                    Rate
                    <span style={{ marginLeft: "5px" }}>
                      <i
                        className={`${symbolSorting(
                          sortedRating
                        )} symbol-sorting ${
                          !priority.includes("sortedRating") ? "d-none" : ""
                        }`}
                      />
                    </span>
                    <select
                      name="sortedRating"
                      id="sortedRating"
                      className="selection-button"
                      value={sortedRating}
                      onChange={(e) => {
                        unsortAll();
                        setSortedRating(e.target.value);
                        if (e.target.value != "Unsort")
                          setPriority("sortedRating");
                      }}
                      style={{ width: "20px" }}
                    >
                      <option value="ASC">ASC</option>
                      <option value="DESC">DESC</option>
                      <option value="Unsort">Unsort</option>
                    </select>
                  </th>
                  <th style={{ textAlign: "center" }}>More</th>
                </tr>
              </thead>
              <tbody style={{ height: "auto" }}>
                {renderCourseList
                  .filter((item) =>
                    item.courseName
                      .trim()
                      .toLowerCase()
                      .includes(searchedName.trim().toLowerCase())
                  )
                  .filter((item) => item.levelName.includes(sortedLevel))
                  .map(
                    (
                      {
                        courseID,
                        courseName,
                        price,
                        discount,
                        levelId,
                        levelName,
                        description,
                        courseImg,
                        classInfo,
                        classInfoFinished,
                        feedbackInfo,
                        deleted,
                        rating,
                      },
                      index
                    ) => {
                      let pos = infoMoreList.findIndex((obj) => {
                        return obj == `more-info-id-${courseID}`;
                      });
                      return (
                        <>
                          <tr key={courseID} className={`row-bg-${index % 2}`}>
                            <td style={{ fontWeight: "600" }}>{index + 1}</td>
                            {/* <td>{courseID}</td> */}
                            <td>
                              <img
                                src={courseImg}
                                alt={`${courseName}`}
                                style={{
                                  width: "50px",
                                  height: "30px",
                                  borderRadius: "10px",
                                }}
                              />
                            </td>
                            <td style={{ textAlign: "left" }}>{courseName}</td>
                            <td style={{ textAlign: "left" }}>{levelName}</td>
                            <td style={{ textAlign: "right" }}>{discount}</td>
                            <td style={{ textAlign: "right" }}>
                              {formatPrice(price)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {formatPrice(price * (1 - discount / 100))}
                            </td>
                            {renderCount > 0 &&
                            classInfo != null &&
                            classInfo != undefined ? (
                              <td style={{ textAlign: "right" }}>
                                {classInfo != null &&
                                classInfo.filter((item) => {
                                  return (
                                    moment(new Date(`${item.endDate}`)) >=
                                    moment(new Date())
                                  );
                                }).length > 0 ? (
                                  classInfo.filter((item) => {
                                    return (
                                      moment(new Date(`${item.endDate}`)) >=
                                      moment(new Date())
                                    );
                                  }).length
                                ) : (
                                  <span>Not yet</span>
                                )}
                              </td>
                            ) : (
                              <td></td>
                            )}
                            {renderCount2 > 0 &&
                            feedbackInfo != null &&
                            feedbackInfo != undefined ? (
                              <td
                                style={{ textAlign: "center" }}
                                className={`
                              ${
                                feedbackInfo.length > 0 && rating >= 4
                                  ? "text-success"
                                  : ""
                              }
                                ${
                                  feedbackInfo.length > 0 &&
                                  rating >= 3 &&
                                  rating < 4
                                    ? "text-primary"
                                    : ""
                                }
                                ${
                                  feedbackInfo.length > 0 && rating < 3
                                    ? "text-danger"
                                    : ""
                                }
                              `}
                              >
                                {feedbackInfo.length > 0 ? (
                                  <>
                                    <p className="p-0 m-0 text-center">
                                      {rating}
                                    </p>
                                    <p className="p-0 m-0 text-center">
                                      {" "}
                                      <Rating
                                        name="half-rating-read"
                                        defaultValue={rating}
                                        precision={0.5}
                                        readOnly
                                        style={{ fontSize: "15px" }}
                                      />
                                    </p>
                                  </>
                                ) : (
                                  "Not yet"
                                )}
                              </td>
                            ) : (
                              <td></td>
                            )}
                            <td style={{ textAlign: "center" }}>
                              {pos >= 0 ? (
                                <button
                                  className="px-2 py-1 text-decoration-none text-light bg-dark border-0"
                                  style={{ borderRadius: "10px" }}
                                  onClick={() => {
                                    // infoMoreList.splice(pos, 1);
                                    setInfoMoreList(
                                      infoMoreList.filter(
                                        (item) =>
                                          item != `more-info-id-${courseID}`
                                      )
                                    );
                                  }}
                                >
                                  Hide
                                </button>
                              ) : (
                                <button
                                  className="px-2 py-1 text-decoration-none text-light bg-dark bg-opacity-75 view-staff-course-more border-0"
                                  style={{
                                    borderRadius: "10px",
                                  }}
                                  onClick={() => {
                                    setInfoMoreList([
                                      ...infoMoreList,
                                      `more-info-id-${courseID}`,
                                    ]);
                                  }}
                                >
                                  View
                                </button>
                              )}
                            </td>
                          </tr>
                          {pos != null && pos >= 0 ? (
                            <>
                              <tr
                                className="bg-dark bg-opacity-10"
                                key={`description-${courseID}`}
                              >
                                <td
                                  className="text-black"
                                  colSpan={2}
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "600",
                                    verticalAlign: "top",
                                  }}
                                >
                                  Description
                                </td>
                                <td
                                  colSpan={6}
                                  style={{ textAlign: "justify" }}
                                >
                                  {description}
                                </td>
                                <td colSpan={2}></td>
                              </tr>
                              <tr
                                className="bg-dark bg-opacity-10"
                                key={`classes-${courseID}`}
                              >
                                <td
                                  className="text-black"
                                  colSpan={2}
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "600",
                                    verticalAlign: "top",
                                  }}
                                >
                                  Classes
                                </td>
                                <td
                                  colSpan={9}
                                  className=""
                                  style={{ textAlign: "left" }}
                                >
                                  {classInfo != null &&
                                  classInfoFinished != null &&
                                  [...classInfo, ...classInfoFinished].length >
                                    0 ? (
                                    <AdminCourseClasses
                                      courseClasses={classInfo}
                                      courseFinishedClasses={classInfoFinished}
                                      className="flex justify-content-start"
                                    />
                                  ) : (
                                    <p className="text-danger m-0 p-0">
                                      No classes yet
                                    </p>
                                  )}
                                </td>
                              </tr>
                              <tr
                                className="bg-dark bg-opacity-10"
                                key={`feedback-${courseID}`}
                              >
                                <td
                                  className="text-black"
                                  colSpan={2}
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "600",
                                    verticalAlign: "top",
                                  }}
                                >
                                  Feedbacks
                                </td>
                                <td colSpan={8} style={{ textAlign: "left" }}>
                                  {feedbackInfo != null &&
                                  feedbackInfo.length > 0 ? (
                                    <AdminCourseFeedback
                                      courseFeedback={feedbackInfo}
                                    />
                                  ) : (
                                    <p className="text-danger m-0 p-0">
                                      No feedbacks yet
                                    </p>
                                  )}
                                </td>
                              </tr>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    }
                  )}
              </tbody>
            </table>
          </section>
        </div>
      </section>
    </>
  );
}
