import React, { useEffect, useState } from "react";
import { api } from "../../../constants/api";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import ClassViewMore from "./ClassViewMore/ClassViewMore";
import "./ClassManagement.scss";

export default function ClassManagement() {
  localStorage.setItem("MENU_ACTIVE", "staff-class");
  const [courseList, setCourseList] = useState([]);
  const [renderCourseList, setRenderCourseList] = useState([]);
  const [infoMoreList, setInfoMoreList] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [searchedName, setSearchedName] = useState("");
  const [sortedLevel, setSortedLevel] = useState("");
  const [sortedName, setSortedName] = useState("Unsort");
  const [sortedDiscount, setSortedDiscount] = useState("Unsort");
  const [filteredPrice, setFilteredPrice] = useState();
  const [filteredCalPrice, setFilteredCalPrice] = useState("");
  const [sortedPrice, setSortedPrice] = useState("Unsort");
  const [sortedTotalPrice, setSortedTotalPrice] = useState("Unsort");
  const [sortedClasses, setSortedClasses] = useState("Unsort");
  const [sortedRating, setSortedRating] = useState("Unsort");
  const [priority, setPriority] = useState("");

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
    let courseListStart = [];
    let courseListEnd = [];
    api
      .get("/Course/GetAllCourseForAdmin")
      .then(async (res) => {
        setCourseList(res.data);
        setRenderCourseList(res.data);
        courseListStart = res.data;
      })
      .catch((err) => {})
      .finally(async () => {
        await courseListStart.forEach((course) => {
          api
            .get("/Class/GetClassByCourseIDForAdmin", {
              params: { courseid: course.courseID },
            })
            .then((res) => {
              let classInfo = res.data;
              course = { ...course, classInfo };
              courseListEnd = [...courseListEnd, course];
            })
            .catch((err) => {
              let classInfo = [];
              course = { ...course, classInfo };
              courseListEnd = [...courseListEnd, course];
            })
            .finally(() => {
              courseListEnd = courseListEnd.sort(
                (a, b) => a.courseID - b.courseID
              );
              setCourseList(courseListEnd);
              setRenderCourseList(courseListEnd);
            });
        });
      });
  };

  useEffect(() => {
    renderCourseForAdmin();
  }, []);

  const resetSort = () => {
    if (
      sortedName.trim().toLowerCase().includes("unsort") &&
      sortedClasses.trim().toLowerCase().includes("unsort")
    ) {
      let render = [...courseList].sort((a, b) => a.courseID - b.courseID);
      setRenderCourseList(render);
    }
  };

  const unsortAll = () => {
    setSortedName("Unsort");
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
    switch (sortedClasses) {
      case "ASC":
        setRenderCourseList(
          [...renderCourseList].sort(
            (a, b) =>
              a.classInfo.filter((item) => {
                return (
                  moment(new Date(`${item.endDate}`)).format("DD-MM-YYYY") >=
                  moment(new Date()).format("DD-MM-YYYY")
                );
              }).length -
              b.classInfo.filter((item) => {
                return (
                  moment(new Date(`${item.endDate}`)).format("DD-MM-YYYY") >=
                  moment(new Date()).format("DD-MM-YYYY")
                );
              }).length
          )
        );
        break;
      case "DESC":
        setRenderCourseList(
          [...renderCourseList].sort(
            (a, b) =>
              b.classInfo.filter((item) => {
                return (
                  moment(new Date(`${item.endDate}`)).format("DD-MM-YYYY") >=
                  moment(new Date()).format("DD-MM-YYYY")
                );
              }).length -
              a.classInfo.filter((item) => {
                return (
                  moment(new Date(`${item.endDate}`)).format("DD-MM-YYYY") >=
                  moment(new Date()).format("DD-MM-YYYY")
                );
              }).length
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

  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuStaff />
        <div className="main--content pt-3" id="staff-class-management-area">
          <div
            className="flex justify-content-between align-items-end"
            style={{ width: "97%", margin: "0 auto" }}
          >
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
              <Link
                className="px-2 py-1 my-1 text-decoration-none text-light staff-create-class-button border-0"
                style={{ borderRadius: "5px" }}
                to=""
                //create class
              >
                Create New Class
              </Link>
            </div>
          </div>
          <table>
            <thead className="table-head">
              <tr>
                <th>No.</th>
                <th>ID</th>
                <th>Image</th>
                <th style={{ textAlign: "left" }}>
                  Name
                  <span style={{ marginLeft: "5px" }}>
                    <i
                      className={`${symbolSorting(sortedName)} symbol-sorting ${
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
                      if (e.target.value != "Unsort") setPriority("sortedName");
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
                <th style={{ textAlign: "center" }}>
                  Class
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
                </th>
                <th style={{ textAlign: "center" }}>More</th>
              </tr>
            </thead>
            <tbody style={{ height: "auto" }}>
              {renderCourseList
                .filter((item) => item.deleted == false)
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
                          <td>{courseID}</td>
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
                          {classInfo != null && classInfo != undefined ? (
                            <td style={{ textAlign: "center" }}>
                              {classInfo != null &&
                              classInfo.filter((item) => {
                                return (
                                  moment(new Date(`${item.endDate}`)).format(
                                    "DD-MM-YYYY"
                                  ) >= moment(new Date()).format("DD-MM-YYYY")
                                );
                              }).length > 0 ? (
                                classInfo.filter((item) => {
                                  return (
                                    moment(new Date(`${item.endDate}`)).format(
                                      "DD-MM-YYYY"
                                    ) >= moment(new Date()).format("DD-MM-YYYY")
                                  );
                                }).length
                              ) : (
                                <span>Not yet</span>
                              )}
                            </td>
                          ) : (
                            <td></td>
                          )}

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
                                className="px-2 py-1 text-decoration-none staff-view-more-class-button border-0  text-center"
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
                        </tr>
                        {pos != null && pos >= 0 ? (
                          <tr
                            className="bg-dark bg-opacity-10"
                            key={`classes-${courseID}`}
                          >
                            <td colSpan={9} style={{ textAlign: "center" }}>
                              {classInfo != null && classInfo.length > 0 ? (
                                <ClassViewMore
                                  courseClasses={classInfo}
                                  className="flex justify-content-start"
                                />
                              ) : (
                                <p className="text-danger m-0 p-0">
                                  No classes yet
                                </p>
                              )}
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
