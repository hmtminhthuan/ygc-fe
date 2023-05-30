import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import "./CourseManagement.scss";
import { api } from "../../../constants/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminCourseClasses from "./AdminCourseClasses/AdminCourseClasses";

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

    console.log(renderCourseList);
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
    useEffect(() => {
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
                            courseListEnd = [...courseListEnd, course];
                        })
                        .catch((err) => {
                            let classInfo = [];
                            course = { ...course, classInfo };
                            courseListEnd = [...courseListEnd, course];
                            courseListEnd = courseListEnd.sort(
                                (a, b) => a.courseID - b.courseID
                            );
                        })
                        .finally(() => {
                            setCourseList(courseListEnd);
                            setRenderCourseList(courseListEnd);
                        });
                });
            });
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
                        <div className="">
                            <button
                                className="px-2 py-1 my-1 text-decoration-none text-light bg-primary border-0"
                                style={{ borderRadius: "5px" }}
                                onClick={() => { }}
                            >
                                Create New Course
                            </button>
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
                                <th style={{ textAlign: "center" }}>Delete</th>
                                <th style={{ textAlign: "center" }}>Edit</th>
                            </tr>
                        </thead>
                        <tbody style={{ height: "auto" }}>
                            {renderCourseList
                                .filter((item) => item.deleted == isDeleted)
                                .filter((item) =>
                                    item.courseName
                                        .toLowerCase()
                                        .includes(searchedName.toLowerCase())
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
                                                                className="px-2 py-1 text-decoration-none text-info bg-info bg-opacity-25 border-0"
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
                                                    <td style={{ textAlign: "center" }}>
                                                        <button
                                                            className="px-2 py-1 text-decoration-none text-danger bg-danger bg-opacity-25 border-0"
                                                            style={{ borderRadius: "10px" }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <button
                                                            className="px-2 py-1 text-decoration-none text-primary bg-primary bg-opacity-25 border-0"
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
                                                                }}
                                                            >
                                                                Description
                                                            </td>
                                                            <td colSpan={7} style={{ textAlign: "left" }}>
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
                                                                }}
                                                            >
                                                                Classes
                                                            </td>
                                                            <td
                                                                className="text-danger"
                                                                colSpan={9}
                                                                style={{ textAlign: "left" }}
                                                            >
                                                                {classInfo != null && classInfo.length > 0 ? (
                                                                    <AdminCourseClasses
                                                                        courseClasses={classInfo}
                                                                    />
                                                                ) : (
                                                                    "No classes yet"
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
