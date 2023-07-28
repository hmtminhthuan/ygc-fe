import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import "./CourseManagement.scss";
import { api } from "../../../constants/api";
import AdminCourseClasses from "./AdminCourseClasses/AdminCourseClasses";
import AdminCourseFeedback from "./AdminCourseFeedback/AdminCourseFeedback";
import Swal from "sweetalert2";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { Rating, Stack } from "@mui/material";
import { alert } from "../../../component/AlertComponent/Alert";
import { menuAction } from "../../../component/Admin/MenuAdmin/MenuAction";
import LoadingOverlay from "../../../component/Loading/LoadingOverlay";

export default function CourseManagement() {
  localStorage.setItem("MENU_ACTIVE", "/admin/courseManagement");
  const [courseList, setCourseList] = useState([]);
  const [renderCourseList, setRenderCourseList] = useState([]);
  const [infoMoreList, setInfoMoreList] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [searchedName, setSearchedName] = useState("");
  const [sortedLevel, setSortedLevel] = useState("");
  const [sortedName, setSortedName] = useState("Unsort");
  const [sortedDiscount, setSortedDiscount] = useState("Unsort");
  const [sortedPrice, setSortedPrice] = useState("Unsort");
  const [sortedTotalPrice, setSortedTotalPrice] = useState("Unsort");
  const [sortedClasses, setSortedClasses] = useState("Unsort");
  const [sortedRating, setSortedRating] = useState("Unsort");
  const [priority, setPriority] = useState("");
  const [viewData, setViewData] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setRenderCourseList(courseListEnd);
        setCourseList(courseListEnd);
        setViewData(true);
        setLoading(false);
        courseListEnd.forEach(async (course) => {
          api
            .get("/Class/GetUnfinisedClassByCourseIDForAdmin", {
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
        });
        courseListEnd.forEach(async (course) => {
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
          [...renderCourseList].sort((a, b) => a.numberClass - b.numberClass)
        );
        break;
      case "DESC":
        setRenderCourseList(
          [...renderCourseList].sort((a, b) => b.numberClass - a.numberClass)
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
              return item.averageRating != null;
            })
            .sort((a, b) => a.averageRating - b.averageRating)
        );
        break;
      case "DESC":
        setRenderCourseList(
          [...renderCourseList]
            .filter((item) => {
              return item.averageRating != null;
            })
            .sort((a, b) => b.averageRating - a.averageRating)
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

  const navigate = useNavigate();

  const handleDeleteCourseByAdmin = (courseid) => {
    setLoading(true);
    api
      .put(`/Course/DeleteCourse?courseid=${parseInt(courseid)}`)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setTimeout(() => {
          renderCourseForAdmin();
          setIsDeleted(true);
          setLoading(false);
          alert.alertSuccessWithTime(
            "Delete Successfully",
            "",
            2000,
            "25",
            () => {}
          );
        }, 4000);
      });
  };

  const handleReactivateByAdmin = (courseid) => {
    setLoading(true);
    api
      .put(`/Course/ReactivateCourse?CourseId=${parseInt(courseid)}`)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setTimeout(() => {
          renderCourseForAdmin();
          setIsDeleted(false);
          setLoading(false);
          alert.alertSuccessWithTime(
            "Activate Successfully",
            "",
            2000,
            "25",
            () => {}
          );
        }, 4000);
      });
  };

  return (
    <section className="pt-0" style={{ height: "100vh" }}>
      <LoadingOverlay loading={loading} />
      <HeaderAdmin />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        <div className={`main--content ${!viewData ? "d-none" : ""}`}>
          <section className="staff-list-area p-0 mt-2 px-4">
            <div
              className="flex justify-content-between align-items-end"
              style={{ width: "97%", margin: "0 auto" }}
            >
              <div className="">
                <button
                  className={`px-2 pt-1 admin-course-list ${
                    !isDeleted ? "admin-course-list-active" : ""
                  }`}
                  style={{
                    border: "none",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                  onClick={() => {
                    setIsDeleted(false);
                  }}
                >
                  Available
                </button>
                <button
                  className={`px-2 pt-1 admin-course-list ${
                    isDeleted ? "admin-course-list-active" : ""
                  }`}
                  style={{
                    border: "none",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                  onClick={() => {
                    setIsDeleted(true);
                  }}
                >
                  Deleted
                </button>
              </div>
              <div className="my-1 flex align-items-center">
                <h5 className="m-0 p-0 px-2">Search by Name</h5>
                <input
                  type="search"
                  placeholder="Enter part of name..."
                  style={{
                    borderRadius: "5px",
                    border: "1px solid gray",
                    outline: "none",
                    fontSize: "14px",
                    padding: "2px 0",
                  }}
                  className="px-1"
                  value={searchedName}
                  onChange={(e) => {
                    setSearchedName(e.target.value);
                  }}
                />
              </div>
              <div className="my-1">
                <NavLink
                  className="px-2 py-1 my-1 text-decoration-none text-light bg-black bg-opacity-75 border-0"
                  style={{ borderRadius: "5px" }}
                  to="/admin/courseManagement/createCourse"
                >
                  Create New Course
                </NavLink>
              </div>
            </div>
            <table>
              <thead className="table-head" style={{ fontSize: "12px" }}>
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
                  {isDeleted ? (
                    <th style={{ textAlign: "center" }}>Activate</th>
                  ) : (
                    <th style={{ textAlign: "center" }}>Delete</th>
                  )}
                  <th style={{ textAlign: "center" }}>Edit</th>
                </tr>
              </thead>
              <tbody style={{ height: "auto" }}>
                {renderCourseList
                  .filter((item) => item.deleted == isDeleted)
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
                        deleted,
                        classInfo,
                        classInfoFinished,
                        feedbackInfo,
                        rating,
                        numberClass,
                        averageRating,
                      },
                      index
                    ) => {
                      let pos = infoMoreList.findIndex((obj) => {
                        return obj == `more-info-id-${courseID}`;
                      });
                      if (averageRating != null) {
                        averageRating = parseFloat(averageRating).toFixed(2);
                      }
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
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  Swal.fire({
                                    imageUrl: `${courseImg}`,
                                  });
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
                            <td style={{ textAlign: "right" }}>
                              {numberClass}
                            </td>
                            <td
                              style={{ textAlign: "center" }}
                              className={`
                              ${
                                averageRating != null && averageRating >= 4
                                  ? "text-success"
                                  : ""
                              }
                                ${
                                  averageRating != null &&
                                  averageRating >= 3 &&
                                  averageRating < 4
                                    ? "text-primary"
                                    : ""
                                }
                                ${
                                  averageRating != null && averageRating < 3
                                    ? "text-danger"
                                    : ""
                                }
                              `}
                            >
                              {averageRating != null ? (
                                <>
                                  <p className="p-0 m-0 text-center">
                                    {averageRating}
                                  </p>
                                  <p className="p-0 m-0 text-center">
                                    <Rating
                                      name="half-rating-read"
                                      defaultValue={averageRating}
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
                            <td style={{ textAlign: "center" }}>
                              {pos >= 0 ? (
                                <button
                                  className="px-2 py-1 text-decoration-none text-light bg-dark border-0  text-center"
                                  style={{
                                    borderRadius: "50%",
                                    fontSize: "12px",
                                  }}
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
                                  <i className="fa-solid fa-eye-slash" />
                                </button>
                              ) : (
                                <button
                                  className="px-2 py-1 text-decoration-none text-info bg-info bg-opacity-10 border-0  text-center"
                                  style={{
                                    borderRadius: "50%",
                                    fontSize: "15px",
                                  }}
                                  onClick={() => {
                                    setInfoMoreList([
                                      ...infoMoreList,
                                      `more-info-id-${courseID}`,
                                    ]);
                                  }}
                                >
                                  <i className="fa-solid fa-book-open-reader" />
                                </button>
                              )}
                            </td>
                            {isDeleted ? (
                              <td style={{ textAlign: "center" }}>
                                <button
                                  className="px-2 py-1 text-decoration-none text-success bg-success bg-opacity-10 border-0  text-center"
                                  style={{
                                    borderRadius: "50%",
                                    fontSize: "15px",
                                  }}
                                  onClick={() => {
                                    Swal.fire({
                                      title: `Are you sure to activate this course?`,
                                      inputAttributes: {
                                        autocapitalize: "off",
                                      },
                                      showCancelButton: true,
                                      showConfirmButton: true,
                                      confirmButtonText: "Confirm",
                                      cancelButtonText: "Cancel",
                                      preConfirm: (login) => {},
                                      allowOutsideClick: true,
                                    }).then((result) => {
                                      if (
                                        result.isDenied === true ||
                                        result.isDismissed === true
                                      ) {
                                      } else if (result.isConfirmed === true) {
                                        handleReactivateByAdmin(`${courseID}`);
                                      }
                                    });
                                  }}
                                >
                                  <i className="fa-solid fa-circle-check" />
                                </button>
                              </td>
                            ) : (
                              <td style={{ textAlign: "center" }}>
                                <button
                                  className="px-2 py-1 text-decoration-none text-danger bg-danger bg-opacity-10 border-0  text-center"
                                  style={{
                                    borderRadius: "50%",
                                    fontSize: "15px",
                                  }}
                                  onClick={() => {
                                    if (
                                      classInfo != null &&
                                      classInfo.filter((item) => {
                                        return (
                                          new Date(`${item.endDate}`) >=
                                          new Date()
                                        );
                                      }).length > 0
                                    ) {
                                      alert.alertFailedWithTime(
                                        "Failed to delete",
                                        "This course has some classes at the present",
                                        2000,
                                        "33",
                                        () => {}
                                      );
                                    } else {
                                      Swal.fire({
                                        title: `Are you sure to delete this course?`,
                                        inputAttributes: {
                                          autocapitalize: "off",
                                        },
                                        showCancelButton: true,
                                        showConfirmButton: true,
                                        confirmButtonText: "Confirm",
                                        cancelButtonText: "Cancel",
                                        preConfirm: (login) => {},
                                        allowOutsideClick: true,
                                      }).then((result) => {
                                        if (
                                          result.isDenied === true ||
                                          result.isDismissed === true
                                        ) {
                                        } else if (
                                          result.isConfirmed === true
                                        ) {
                                          handleDeleteCourseByAdmin(
                                            `${courseID}`
                                          );
                                        }
                                      });
                                    }
                                  }}
                                >
                                  <i className="fa-solid fa-trash" />
                                </button>
                              </td>
                            )}
                            <td style={{ textAlign: "center" }}>
                              <button
                                className="text-decoration-none text-primary bg-primary bg-opacity-10 border-0  text-center"
                                style={{
                                  borderRadius: "50%",
                                  fontSize: "15px",
                                }}
                              >
                                <NavLink
                                  className="px-2 py-1 "
                                  to={`/admin/courseManagement/editCourse/${courseID}`}
                                >
                                  <i className="fa-solid fa-pen-to-square py-2" />
                                </NavLink>
                              </button>
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
                                  colSpan={8}
                                  style={{ textAlign: "justify" }}
                                >
                                  {description}
                                </td>
                                <td colSpan={2}></td>
                              </tr>
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
                                  Revenue
                                </td>
                                <td
                                  colSpan={8}
                                  style={{ textAlign: "justify" }}
                                >
                                  <NavLink to={`/admin/revenue/${courseID}`}>
                                    View Detail Of Revenue
                                  </NavLink>
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
                                <td colSpan={10} style={{ textAlign: "left" }}>
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
                                <td colSpan={10} style={{ textAlign: "left" }}>
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
    </section>
  );
}
