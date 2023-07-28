import React, { useEffect, useState } from "react";
import "./FeedbackManagement.scss";
import { api } from "../../../constants/api";
import { NavLink } from "react-router-dom";
import MenuStaff from "../../../component/Staff/MenuStaff";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import { Rating } from "@mui/material";
import LoadingOverlay from "../../../component/Loading/LoadingOverlay";

export default function FeedbackManagement() {
  localStorage.setItem("MENU_ACTIVE", "/staff/feedbackManagement");
  const [courseList, setCourseList] = useState([]);
  const [renderCourseList, setRenderCourseList] = useState([]);
  const [searchedName, setSearchedName] = useState("");
  const [sortedLevel, setSortedLevel] = useState("");
  const [sortedName, setSortedName] = useState("Unsort");
  const [sortedPending, setSortedPending] = useState("Unsort");
  const [sortedCensored, setSortedCensored] = useState("Unsort");
  const [sortedDeleted, setSortedDeleted] = useState("Unsort");
  const [sortedTotalFb, setSortedTotalFb] = useState("Unsort");
  const [sortedRating, setSortedRating] = useState("Unsort");
  const [priority, setPriority] = useState("");
  const [viewData, setViewData] = useState(false);
  const [loading, setLoading] = useState(true);

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
    api
      .get("/Feedback/GetCoursesFeedbackForAdminstrator")
      .then((res) => {
        let arr = res.data.sort((a, b) => b.numberPending - a.numberPending);
        setCourseList(arr);
        setRenderCourseList(arr);
      })
      .catch((err) => {})
      .finally(() => {
        setViewData(true);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      });
  };

  useEffect(() => {
    renderCourseForAdmin();
  }, []);

  const resetSort = () => {
    if (
      sortedName.trim().toLowerCase().includes("unsort") &&
      sortedPending.trim().toLowerCase().includes("unsort") &&
      sortedCensored.trim().toLowerCase().includes("unsort") &&
      sortedDeleted.trim().toLowerCase().includes("unsort") &&
      sortedTotalFb.trim().toLowerCase().includes("unsort") &&
      sortedRating.trim().toLowerCase().includes("unsort")
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
    setSortedPending("Unsort");
    setSortedCensored("Unsort");
    setSortedDeleted("Unsort");
    setSortedTotalFb("Unsort");
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
    switch (sortedPending) {
      case "ASC":
        setRenderCourseList(
          [...renderCourseList].sort(
            (a, b) => a.numberPending - b.numberPending
          )
        );
        break;
      case "DESC":
        setRenderCourseList(
          [...renderCourseList].sort(
            (a, b) => b.numberPending - a.numberPending
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
  }, [sortedPending]);

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

  return (
    <>
      <LoadingOverlay loading={loading} />
      <HeaderStaff />
      <section className="main bg-light" id="staff-feedback-management-area">
        <MenuStaff />
        <div className={`main--content  ${!viewData ? "d-none" : ""}`}>
          <section className="staff-list-area p-0 mt-2 px-4">
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
                  <th style={{ textAlign: "right", width: "220px" }}>
                    <span style={{ marginLeft: "5px" }}>
                      <i
                        className={`${symbolSorting(
                          sortedPending
                        )} symbol-sorting ${
                          !priority.includes("sortedPending") ? "d-none" : ""
                        }`}
                      />
                    </span>
                    <select
                      name="sortedPending"
                      id="sortedPending"
                      className="selection-button"
                      value={sortedPending}
                      onChange={(e) => {
                        unsortAll();
                        setSortedPending(e.target.value);
                        if (e.target.value != "Unsort")
                          setPriority("sortedPending");
                      }}
                      style={{ width: "20px" }}
                    >
                      <option value="ASC">ASC</option>
                      <option value="DESC">DESC</option>
                      <option value="Unsort">Unsort</option>
                    </select>
                    Number Of Pending
                  </th>
                  <th style={{ textAlign: "center", width: "250px" }}>
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
                  <th style={{ textAlign: "center" }}>Detail</th>
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
                        numberPending,
                        averageRating,
                      },
                      index
                    ) => {
                      let pending = numberPending;
                      if (averageRating != null) {
                        averageRating = parseFloat(averageRating).toFixed(2);
                      }
                      return (
                        <>
                          <tr key={courseID} className={`row-bg-${index % 2}`}>
                            <td style={{ fontWeight: "600" }}>{index + 1}</td>
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
                            <td
                              className={`${pending > 0 ? "text-danger" : ""}`}
                              style={{
                                textAlign: "right",
                                fontWeight: `${pending > 0 ? "bolder" : ""}`,
                                fontSize: "16px",
                              }}
                            >
                              {pending}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
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
                                      style={{ fontSize: "14px" }}
                                    />
                                  </p>
                                </>
                              ) : (
                                "Not yet"
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button
                                className="text-decoration-none text-dark bg-dark bg-opacity-10 border-0 text-center"
                                style={{
                                  borderRadius: "50%",
                                  display: `${
                                    averageRating == null ? "none" : ""
                                  }`,
                                }}
                              >
                                <NavLink
                                  className="px-2 py-1 text-dark bg-dark bg-opacity-10"
                                  style={{ borderRadius: "50%" }}
                                  to={`/staff/feedbackManagement/${courseID}`}
                                >
                                  <i className="fa-solid fa-eye" />
                                </NavLink>
                              </button>
                            </td>
                          </tr>
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
