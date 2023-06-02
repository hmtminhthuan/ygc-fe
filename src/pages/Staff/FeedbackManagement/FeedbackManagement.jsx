import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import "./FeedbackManagement.scss";
import { api } from "../../../constants/api";
import AdminCourseClasses from "../../Admin/CourseManagement/AdminCourseClasses/AdminCourseClasses";
import AdminCourseFeedback from "../../Admin/CourseManagement/AdminCourseFeedback/AdminCourseFeedback";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import MenuStaff from "../../../component/Staff/MenuStaff";
import HeaderStaff from "../../../component/Staff/HeaderStaff";

export default function FeedbackManagement() {
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
            })
            .finally(() => {
                courseListStart.forEach((course) => {
                    api
                        .get("/Feedback/GetCourseFeedbackbyId", {
                            params: { courseid: course.courseID },
                        })
                        .then((res) => {
                            let feedbackInfo = res.data;
                            let pending = feedbackInfo.filter(
                                (item) => item.status == 0
                            ).length;
                            let censored = feedbackInfo.filter(
                                (item) => item.status == 1
                            ).length;
                            let deletedFb = feedbackInfo.filter(
                                (item) => item.status == 2
                            ).length;
                            let rating = 0;
                            feedbackInfo.forEach((item) => {
                                rating += item.rating;
                            });
                            if (feedbackInfo.length > 0) {
                                rating = rating / feedbackInfo.length;
                                rating = rating.toFixed(2);
                            }
                            course = {
                                ...course,
                                feedbackInfo,
                                pending,
                                censored,
                                deletedFb,
                                rating,
                            };
                            courseListEnd = [...courseListEnd, course];
                        })
                        .catch((err) => {
                            let feedbackInfo = [];
                            let pending = 0;
                            let censored = 0;
                            let deletedFb = 0;
                            let rating = 0;
                            course = {
                                ...course,
                                feedbackInfo,
                                pending,
                                censored,
                                deletedFb,
                                rating,
                            };
                            courseListEnd = [...courseListEnd, course];
                        })
                        .finally(async () => {
                            courseListEnd = await courseListEnd.sort(
                                (a, b) => a.courseID - b.courseID
                            );
                            setCourseList(courseListEnd);
                            setRenderCourseList(courseListEnd);
                        });
                });
            });
    };

    console.log(renderCourseList);

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
                    [...renderCourseList].sort((a, b) => a.pending - b.pending)
                );
                break;
            case "DESC":
                setRenderCourseList(
                    [...renderCourseList].sort((a, b) => b.pending - a.pending)
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
        switch (sortedCensored) {
            case "ASC":
                setRenderCourseList(
                    [...renderCourseList].sort((a, b) => a.censored - b.censored)
                );
                break;
            case "DESC":
                setRenderCourseList(
                    [...renderCourseList].sort((a, b) => b.censored - a.censored)
                );
                break;
            case "Unsort":
                resetSort();
                break;
            default:
                resetSort();
                break;
        }
    }, [sortedCensored]);

    useEffect(() => {
        switch (sortedDeleted) {
            case "ASC":
                setRenderCourseList(
                    [...renderCourseList].sort((a, b) => a.deletedFb - b.deletedFb)
                );
                break;
            case "DESC":
                setRenderCourseList(
                    [...renderCourseList].sort((a, b) => b.deletedFb - a.deletedFb)
                );
                break;
            case "Unsort":
                resetSort();
                break;
            default:
                resetSort();
                break;
        }
    }, [sortedDeleted]);

    useEffect(() => {
        switch (sortedTotalFb) {
            case "ASC":
                setRenderCourseList(
                    [...renderCourseList].sort(
                        (a, b) => a.feedbackInfo.length - b.feedbackInfo.length
                    )
                );
                break;
            case "DESC":
                setRenderCourseList(
                    [...renderCourseList].sort(
                        (a, b) => b.feedbackInfo.length - a.feedbackInfo.length
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
    }, [sortedTotalFb]);

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
            <section className="main" id="staff-feedback-management-area">
                <MenuStaff />
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
                                    Pending
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(
                                                sortedPending
                                            )} symbol-sorting ${!priority.includes("sortedPending") ? "d-none" : ""
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
                                </th>
                                <th style={{ textAlign: "center" }}>
                                    Censored
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(
                                                sortedCensored
                                            )} symbol-sorting ${!priority.includes("sortedCensored") ? "d-none" : ""
                                                }`}
                                        />
                                    </span>
                                    <select
                                        name="sortedCensored"
                                        id="sortedCensored"
                                        className="selection-button"
                                        value={sortedCensored}
                                        onChange={(e) => {
                                            unsortAll();
                                            setSortedCensored(e.target.value);
                                            if (e.target.value != "Unsort")
                                                setPriority("sortedCensored");
                                        }}
                                        style={{ width: "20px" }}
                                    >
                                        <option value="ASC">ASC</option>
                                        <option value="DESC">DESC</option>
                                        <option value="Unsort">Unsort</option>
                                    </select>
                                </th>
                                <th style={{ textAlign: "center" }}>
                                    Deleted
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(
                                                sortedDeleted
                                            )} symbol-sorting ${!priority.includes("sortedDeleted") ? "d-none" : ""
                                                }`}
                                        />
                                    </span>
                                    <select
                                        name="sortedDeleted"
                                        id="sortedDeleted"
                                        className="selection-button"
                                        value={sortedDeleted}
                                        onChange={(e) => {
                                            unsortAll();
                                            setSortedDeleted(e.target.value);
                                            if (e.target.value != "Unsort")
                                                setPriority("sortedDeleted");
                                        }}
                                        style={{ width: "20px" }}
                                    >
                                        <option value="ASC">ASC</option>
                                        <option value="DESC">DESC</option>
                                        <option value="Unsort">Unsort</option>
                                    </select>
                                </th>
                                <th style={{ textAlign: "center" }}>
                                    Total
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(
                                                sortedTotalFb
                                            )} symbol-sorting ${!priority.includes("sortedTotalFb") ? "d-none" : ""
                                                }`}
                                        />
                                    </span>
                                    <select
                                        name="sortedTotalFb"
                                        id="sortedTotalFb"
                                        className="selection-button"
                                        value={sortedTotalFb}
                                        onChange={(e) => {
                                            unsortAll();
                                            setSortedTotalFb(e.target.value);
                                            if (e.target.value != "Unsort")
                                                setPriority("sortedTotalFb");
                                        }}
                                        style={{ width: "20px" }}
                                    >
                                        <option value="ASC">ASC</option>
                                        <option value="DESC">DESC</option>
                                        <option value="Unsort">Unsort</option>
                                    </select>
                                </th>
                                <th style={{ textAlign: "center" }}>
                                    Rate
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(
                                                sortedRating
                                            )} symbol-sorting ${!priority.includes("sortedRating") ? "d-none" : ""
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
                                            feedbackInfo,
                                            deleted,
                                            pending,
                                            censored,
                                            deletedFb,
                                            rating,
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
                                                    <td
                                                        className={`${pending > 0 ? "text-primary" : ""}`}
                                                        style={{ textAlign: "center" }}
                                                    >
                                                        {pending}
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>{censored}</td>
                                                    <td style={{ textAlign: "center" }}>{deletedFb}</td>
                                                    {feedbackInfo != null && feedbackInfo != undefined ? (
                                                        <td style={{ textAlign: "center" }}>
                                                            {feedbackInfo.length > 0
                                                                ? feedbackInfo.length
                                                                : "Not yet"}
                                                        </td>
                                                    ) : (
                                                        <td></td>
                                                    )}
                                                    {feedbackInfo != null && feedbackInfo != undefined ? (
                                                        <td style={{ textAlign: "center" }}>
                                                            {feedbackInfo.length > 0
                                                                ? `${rating}`
                                                                : "Not yet"}
                                                        </td>
                                                    ) : (
                                                        <td></td>
                                                    )}
                                                    <td style={{ textAlign: "center" }}>
                                                        <button
                                                            className="px-2 py-1 text-decoration-none text-primary bg-primary bg-opacity-10 border-0"
                                                            style={{ borderRadius: "10px" }}
                                                            onClick={() => { }}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
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