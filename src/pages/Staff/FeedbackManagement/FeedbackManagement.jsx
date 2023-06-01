import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import "./FeedbackManagement.scss";
import { api } from "../../../constants/api";
import AdminCourseClasses from "../../Admin/CourseManagement/AdminCourseClasses/AdminCourseClasses";
import AdminCourseFeedback from "../../Admin/CourseManagement/AdminCourseFeedback/AdminCourseFeedback";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function FeedbackManagement() {
    const [courseList, setCourseList] = useState([]);
    const [renderCourseList, setRenderCourseList] = useState([]);
    const [searchedName, setSearchedName] = useState("");
    const [sortedLevel, setSortedLevel] = useState("");
    const [sortedName, setSortedName] = useState("Unsort");
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
            .catch((err) => {
                console.log(err);
            }).finally(() => {
                courseListStart.forEach((course) => {
                    api
                        .get("/Feedback/GetCourseFeedbackbyId", {
                            params: { courseid: course.courseID },
                        })
                        .then((res) => {
                            let feedbackInfo = res.data;
                            course = { ...course, feedbackInfo };
                            courseListEnd = [...courseListEnd, course];
                        })
                        .catch((err) => {
                            let feedbackInfo = [];
                            course = { ...course, feedbackInfo };
                            courseListEnd = [...courseListEnd, course];
                        })
                        .finally(async () => {
                            courseListEnd = await courseListEnd.sort(
                                (a, b) => a.courseID - b.courseID
                            );
                            setCourseList(courseListEnd);
                            setRenderCourseList(courseListEnd);
                        });
                })
            });
    };

    console.log(renderCourseList);

    useEffect(() => {
        renderCourseForAdmin();
    }, []);

    const resetSort = () => {
        if (
            sortedName.trim().toLowerCase().includes("unsort")
        ) {
            let render = [...courseList].sort((a, b) => a.courseID - b.courseID);
            setRenderCourseList(render);
        }
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

    return (
        <>
            <HeaderAdmin />
            <section className="main" id="staff-feedback-management-area">
                <MenuAdmin />
                <div className="main--content pt-3">
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
                                <th>ID</th>
                                <th>Image</th>
                                <th style={{ textAlign: "left" }}>
                                    Name
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(sortedName)} symbol-sorting ${!priority.includes("sortedName") ? "d-none" : ""
                                                }`}
                                        />
                                    </span>
                                    <select
                                        name="sortedName"
                                        id="sortedName"
                                        className="selection-button"
                                        value={sortedName}
                                        onChange={(e) => {
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
                                <th style={{ textAlign: "left" }}>
                                    Pending
                                </th>
                                <th style={{ textAlign: "left" }}>
                                    Censored
                                </th>
                                <th style={{ textAlign: "left" }}>
                                    Deleted
                                </th>
                                <th style={{ textAlign: "left" }}>
                                    Total
                                </th>
                                <th style={{ textAlign: "left" }}>
                                    Detail
                                </th>
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
                                            feedbackInfo,
                                            deleted,
                                        },
                                        index
                                    ) => {
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
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "left" }}>{courseName}</td>
                                                    <td style={{ textAlign: "left" }}>{levelName}</td>
                                                </tr>
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