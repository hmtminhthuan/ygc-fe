import React, { useEffect, useState } from "react";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Banner from "../../component/Banner/Banner";
import { Button, Card } from "react-bootstrap";
import image from "../../assets/images/banner-1.jpg";
import "./Course.scss";
import CourseDetail from "./CourseItem";
import axios from "axios";
import { stringify } from "postcss";
export default function Course() {
    let [courseList, setCourseList] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/Course/GetCourseList")
            .then((res) => {
                setCourseList(res.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            <HeaderHome />
            <Banner title={"Yoga Courses"} descripton={"Yoga Healthy Courses"} />
            <section className="w-100 courlist-area">
                <div className="course-contaier flex justify-content-center align-content-center">
                    <div className="row">
                        {
                            courseList.map(
                                (course, index) => {
                                    return (
                                        <CourseDetail key={index}
                                            courseID={course.courseID}
                                            courseName={course.courseName}
                                            description={course.description}
                                            levelName={course.levelName}
                                            price={course.price.toString()}
                                        />
                                    );
                                }
                            )
                        }
                    </div>
                </div>
            </section>
        </div >
    );
}
