import React, { useEffect } from "react";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Banner from "../../component/Banner/Banner";
import { Button, Card } from "react-bootstrap";
import image from "../../assets/images/banner-1.jpg";
import "./Course.scss";
import CourseDetail from "./CourseDetail";
import axios from "axios";
import { stringify } from "postcss";
export default function Course() {
    let courseList = [];

    useEffect(() => {
        axios
            .get("http://localhost:5000/Course/GetCourseList")
            .then((res) => {
                courseList = res.data;
                console.log(courseList);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            <HeaderHome />
            <Banner title={"Yoga Courses"} descripton={"Yoga Healthy Courses"} />
            <section className="w-100">
                <div className="course-contaier flex justify-content-center align-content-center">
                    <div className="row">
                        {courseList.map(
                            (courseName, description, levelName, price, index) => {
                                console.log(courseName, description, levelName, price, "asfaf");
                                return (
                                    <div key={index}>
                                        <CourseDetail
                                            courseName={courseName}
                                            description={description}
                                            levelName={levelName}
                                            price={price.toString()}
                                        />{" "}
                                    </div>
                                );
                            }
                        )}
                        <CourseDetail />
                    </div>
                </div>
            </section>
        </div>
    );
}
