import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import "./CourseManagement.scss";
import { api } from "../../../constants/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminCourseClasses from "./AdminCourseClasses/AdminCourseClasses";
import AdminCourseFeedback from "./AdminCourseFeedback/AdminCourseFeedback";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function CourseManagement() {
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

    const formatPrice = (price) => {
        return Intl.NumberFormat("vi-VN", {
            style: "currency",
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
        let courseListStrat = [];
        let courseListEnd = [];
        api
            .get("/Course/GetAllCourseForAdmin")
            .then(async (res) => {
                setCourseList(res.data);
                setRenderCourseList(res.data);
                courseListStrat = res.data;
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(async () => {
                await courseListStrat.forEach((course) => {
                    api
                        .get("/Class/GetClassByCourseID", {
                            params: { courseid: course.courseID },
                        })
                        .then((res) => {
                            let classInfo = res.data;
                            course = { ...course, classInfo };
                        })
                        .catch((err) => {
                            let classInfo = [];
                            course = { ...course, classInfo };
                        })
                        .finally(() => {
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
                        });
                });
            });
    };

    useEffect(() => {
        renderCourseForAdmin();
    }, []);

    const resetSort = () => {
        if (
            sortedName == "Unsort" &&
            sortedDiscount == "Unsort" &&
            sortedPrice == "Unsort" &&
            sortedTotalPrice == "Unsort" &&
            sortedClasses == "Unsort"
        ) {
            setRenderCourseList(
                [...renderCourseList].sort((a, b) => a.courseID - b.courseID)
            );
        }
    };

    useEffect(() => {
        switch (sortedName) {
            case "A-Z":
                setRenderCourseList(
                    [...renderCourseList].sort((a, b) => {
                        if (a.courseName < b.courseName) {
                            return -1;
                        }
                        if (a.courseName > b.courseName) {
                            return 1;
                        }
                        return 0;
                    })
                );
                break;
            case "Z-A":
                setRenderCourseList(
                    [...renderCourseList].sort((a, b) => {
                        if (a.courseName > b.courseName) {
                            return -1;
                        }
                        if (a.courseName < b.courseName) {
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
    const handleDeleteCourseByAdmin = (courseid) => {
        api
            .delete("/Course/DeleteCourse", {
                params: { courseid: parseInt(courseid) },
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                renderCourseForAdmin();
            });
    };
    const handleReactivateByAdmin = (courseid) => {
        console.log(parseInt(courseid));
        console.log(typeof parseInt(courseid));
        api
            .put(`/Course/ReactivateCourse?CourseId=${parseInt(courseid)}`)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                renderCourseForAdmin();
            });
    };

    return (
        <>
            <HeaderAdmin />
            <section className="main" id="admin-course-management-area">
                <MenuAdmin />
                <div className="main--content pt-3">
                    <div
                        className="flex justify-content-between align-items-end"
                        style={{ width: "97%", margin: "0 auto" }}
                    >
                        <div className="">
                            <button
                                className={`px-2 pt-1 admin-course-list ${!isDeleted ? "admin-course-list-active" : ""
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
                                className={`px-2 pt-1 admin-course-list ${isDeleted ? "admin-course-list-active" : ""
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
                        <div className="my-1">
                            <span className="px-2">Search by Name</span>
                            <input
                                type="search"
                                placeholder="Enter part of name..."
                                style={{ borderRadius: "5px", border: "1px solid gray" }}
                                className="px-1"
                                value={searchedName}
                                onChange={(e) => {
                                    setSearchedName(e.target.value);
                                }}
                            />
                        </div>
                        <div className="my-1">
                            <Link
                                className="px-2 py-1 my-1 text-decoration-none text-light bg-primary border-0"
                                style={{ borderRadius: "5px" }}
                                to="/admin/courseManagement/createCourse"
                            >
                                Create New Course
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
                                            className={`${symbolSorting(sortedName)} symbol-sorting`}
                                        />
                                    </span>
                                    <select
                                        name="sortedName"
                                        id="sortedName"
                                        className="selection-button"
                                        value={sortedName}
                                        onChange={(e) => {
                                            setSortedName(e.target.value);
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
                                                class="fa fa-filter symbol-sorting"
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
                                <th style={{ textAlign: "" }}>
                                    Discount
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(
                                                sortedDiscount
                                            )} symbol-sorting`}
                                        />
                                    </span>
                                    <select
                                        name="sortedDiscount"
                                        id="sortedDiscount"
                                        className="selection-button"
                                        value={sortedDiscount}
                                        onChange={(e) => {
                                            setSortedDiscount(e.target.value);
                                        }}
                                        style={{ width: "20px" }}
                                    >
                                        <option value="ASC">ASC</option>
                                        <option value="DESC">DESC</option>
                                        <option value="Unsort">Unsort</option>
                                    </select>
                                </th>
                                <th style={{ textAlign: "right" }}>
                                    Price
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(sortedPrice)} symbol-sorting`}
                                        />
                                    </span>
                                    <select
                                        name="sortedPrice"
                                        id="sortedPrice"
                                        className="selection-button"
                                        value={sortedPrice}
                                        onChange={(e) => {
                                            setSortedPrice(e.target.value);
                                        }}
                                        style={{ width: "20px" }}
                                    >
                                        <option value="ASC">ASC</option>
                                        <option value="DESC">DESC</option>
                                        <option value="Unsort">Unsort</option>
                                    </select>
                                </th>
                                <th style={{ textAlign: "right" }}>
                                    Total
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(
                                                sortedTotalPrice
                                            )} symbol-sorting`}
                                        />
                                    </span>
                                    <select
                                        name="sortedTotalPrice"
                                        id="sortedTotalPrice"
                                        className="selection-button"
                                        value={sortedTotalPrice}
                                        onChange={(e) => {
                                            setSortedTotalPrice(e.target.value);
                                        }}
                                        style={{ width: "20px" }}
                                    >
                                        <option value="ASC">ASC</option>
                                        <option value="DESC">DESC</option>
                                        <option value="Unsort">Unsort</option>
                                    </select>
                                </th>
                                <th style={{ textAlign: "center" }}>
                                    Class
                                    <span style={{ marginLeft: "5px" }}>
                                        <i
                                            className={`${symbolSorting(
                                                sortedClasses
                                            )} symbol-sorting`}
                                        />
                                    </span>
                                    <select
                                        name="sortedClasses"
                                        id="sortedClasses"
                                        className="selection-button"
                                        value={sortedClasses}
                                        onChange={(e) => {
                                            setSortedClasses(e.target.value);
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
                                            classInfo,
                                            feedbackInfo,
                                            deleted,
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
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "left" }}>{courseName}</td>
                                                    <td style={{ textAlign: "left" }}>{levelName}</td>
                                                    <td style={{ textAlign: "" }}>{discount}</td>
                                                    <td style={{ textAlign: "right" }}>
                                                        {formatPrice(price)}
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        {formatPrice(price * (1 - discount / 100))}
                                                    </td>
                                                    <td>{classInfo != null ? classInfo.length : "0"}</td>
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
                                                                className="px-2 py-1 text-decoration-none text-info bg-info bg-opacity-10 border-0"
                                                                style={{ borderRadius: "10px" }}
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
                                                    {isDeleted ? (
                                                        <td style={{ textAlign: "center" }}>
                                                            <button
                                                                className="px-2 py-1 text-decoration-none text-success bg-success bg-opacity-10 border-0"
                                                                style={{ borderRadius: "10px" }}
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
                                                                        preConfirm: (login) => {
                                                                            // console.log(login);
                                                                        },
                                                                        allowOutsideClick: true,
                                                                    }).then((result) => {
                                                                        console.log(result);
                                                                        if (
                                                                            result.isDenied === true ||
                                                                            result.isDismissed === true
                                                                        ) {
                                                                        } else if (result.isConfirmed === true) {
                                                                            Swal.fire({
                                                                                position: "center",
                                                                                icon: "success",
                                                                                title: "Activate course successfully!",
                                                                                showConfirmButton: true,
                                                                                timer: 1000,
                                                                            });
                                                                            handleReactivateByAdmin(`${courseID}`);
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                Activate
                                                            </button>
                                                        </td>
                                                    ) : (
                                                        <td style={{ textAlign: "center" }}>
                                                            <button
                                                                className="px-2 py-1 text-decoration-none text-danger bg-danger bg-opacity-10 border-0"
                                                                style={{ borderRadius: "10px" }}
                                                                onClick={() => {
                                                                    if (
                                                                        classInfo != null &&
                                                                        classInfo.length > 0
                                                                    ) {
                                                                        Swal.fire({
                                                                            position: "center",
                                                                            icon: "warning",
                                                                            title:
                                                                                "Delete failed!</br> This course has some classes at the present.",
                                                                            showConfirmButton: true,
                                                                            timer: 3500,
                                                                        });
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
                                                                            preConfirm: (login) => {
                                                                                // console.log(login);
                                                                            },
                                                                            allowOutsideClick: true,
                                                                        }).then((result) => {
                                                                            console.log(result);
                                                                            if (
                                                                                result.isDenied === true ||
                                                                                result.isDismissed === true
                                                                            ) {
                                                                            } else if (result.isConfirmed === true) {
                                                                                Swal.fire({
                                                                                    position: "center",
                                                                                    icon: "success",
                                                                                    title: "Delete course successfully!",
                                                                                    showConfirmButton: true,
                                                                                    timer: 1000,
                                                                                });
                                                                                handleDeleteCourseByAdmin(
                                                                                    `${courseID}`
                                                                                );
                                                                            }
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    )}
                                                    <td style={{ textAlign: "center" }}>
                                                        <button
                                                            className="px-2 py-1 text-decoration-none text-primary bg-primary bg-opacity-10 border-0"
                                                            style={{ borderRadius: "10px" }}
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                                {pos != null && pos >= 0 ? (
                                                    <>
                                                        <tr
                                                            className="bg-dark bg-opacity-10"
                                                            key={`description-${courseID}`}
                                                        >
                                                            <td></td>
                                                            <td
                                                                className="text-info"
                                                                colSpan={2}
                                                                style={{
                                                                    textAlign: "right",
                                                                    fontWeight: "600",
                                                                    verticalAlign: "top",
                                                                }}
                                                            >
                                                                Description
                                                            </td>
                                                            <td colSpan={7} style={{ textAlign: "justify" }}>
                                                                {description}
                                                            </td>
                                                            <td colSpan={2}></td>
                                                        </tr>
                                                        <tr
                                                            className="bg-dark bg-opacity-10"
                                                            key={`classes-${courseID}`}
                                                        >
                                                            <td></td>
                                                            <td
                                                                className="text-info"
                                                                colSpan={2}
                                                                style={{
                                                                    textAlign: "right",
                                                                    fontWeight: "600",
                                                                    verticalAlign: "top",
                                                                }}
                                                            >
                                                                Classes
                                                            </td>
                                                            <td colSpan={9} style={{ textAlign: "left" }}>
                                                                {classInfo != null && classInfo.length > 0 ? (
                                                                    <AdminCourseClasses
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
                                                        <tr
                                                            className="bg-dark bg-opacity-10"
                                                            key={`feedback-${courseID}`}
                                                        >
                                                            <td></td>
                                                            <td
                                                                className="text-info"
                                                                colSpan={2}
                                                                style={{
                                                                    textAlign: "right",
                                                                    fontWeight: "600",
                                                                    verticalAlign: "top",
                                                                }}
                                                            >
                                                                Feedbacks
                                                            </td>
                                                            <td colSpan={9} style={{ textAlign: "left" }}>
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
                </div>
            </section>
        </>
    );
}
