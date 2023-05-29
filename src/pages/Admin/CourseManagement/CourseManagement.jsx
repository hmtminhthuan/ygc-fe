import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import "./CourseManagement.scss";
import { Link } from "react-router-dom";
import { api } from "../../../constants/api";

export default function CourseManagement() {
    const [courseList, setCourseList] = useState([]);
    const [renderCourseList, setRenderCourseList] = useState([]);

    useEffect(() => {
        api
            .get("/Course/GetCourseList")
            .then(async (res) => {
                setCourseList(res.data);
                setRenderCourseList(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <HeaderAdmin />
            <section className="main" id="admin-course-management-area">
                <MenuAdmin />
                <div className="main--content pt-3">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Level</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderCourseList.map(
                                ({
                                    courseID,
                                    courseName,
                                    price,
                                    discount,
                                    levelId,
                                    levelName,
                                    description,
                                    courseImg,
                                }) => (
                                    <tr key={courseID}>
                                        <td>{courseID}</td>
                                        <td>{courseImg}</td>
                                        <td>{courseName}</td>
                                        <td>{levelName}</td>
                                        <td>{price}</td>
                                        <td>{discount}</td>
                                        <td>{price * (1 - discount / 100)}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
