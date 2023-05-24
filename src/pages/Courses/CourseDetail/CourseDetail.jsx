import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import HeaderHome from "../../../component/HeaderHome/HeaderHome";
import axios from "axios";
import image from "../../../assets/images/img-demo.jpg";
import { Link } from "react-router-dom";
import "./CourseDetail.scss";
import { Button } from "react-bootstrap";
import CourseClasses from "./CourseClasses/CourseClasses";
import CourseFeedback from "./CourseFeedback/CourseFeedback";

export default function CourseDetail() {
    const param = useParams();
    const [courseDetail, setCourseDetail] = useState([]);
    const [courseClasses, setCourseClasses] = useState([]);
    const formatPrice = (price) => {
        return Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };
    useEffect(() => {
        axios
            .get("http://localhost:5000/Course/GetCourseByID", {
                params: { id: param.id },
            })
            .then((res) => {
                setCourseDetail(res.data);
            })
            .catch((err) => {
                // console.log(err);
            });

        axios
            .get("http://localhost:5000/Class/GetClassByCourseID", {
                params: { courseid: param.id },
            })
            .then((res) => {
                setCourseClasses(res.data);
            })
            .catch((err) => {
                // console.log(err);
            });
    }, []);
    let { courseName, levelName, description, price, discount, ...restParams } =
        courseDetail;

    return (
        <div>
            <div className="header-top m-4 mx-0 mt-0">
                <HeaderHome />
            </div>
            <main>
                <div className="box course-detail-area">
                    {/* <div className="inner-box flex"> */}
                    {/* <div className="container flex"> */}
                    <div className="course-detail-info w-100 form-container flex-column justify-content-start align-items-start p-3">
                        <h2 className="course-detail-title m-4 mt-3">{courseName}
                        </h2>
                        <div className="row d-lg-flex align-items-stretch justify-content-center">
                            <div className="course-detail-img col-lg-5 col-10 flex justify-content-start">
                                <img className="h-100" style={{ width: "100%" }} src={image} />
                                {discount != null && discount != "" && discount >= 0 ? (
                                    <div className="course-tag-discount py-2 pt-1 px-2">
                                        <p>{discount}&#37;</p>
                                        <p>Discount</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="course-detail-des col-lg-5 col-10 mt-lg-0 mt-sm-4 px-4 h-10">
                                <p className="course-detail-des-level">
                                    {" "}
                                    <span className="sub-title">Level: </span> {levelName}
                                </p>
                                <p className="course-detail-des-description">
                                    <span className="sub-title">Description: </span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                                    aut rem vel debitis incidunt necessitatibus, enim iure eum quo
                                    veniam voluptatibus accusantium sapiente optio ipsum? Natus
                                    doloribus hic amet ducimus.{" "}
                                </p>
                                <div className="course-detail-des-price d-flex">
                                    <span className="sub-title" style={{ margin: "0 10px 0 0" }}>
                                        Price:
                                    </span>
                                    {discount != null && discount != "" && discount >= 0 ? (
                                        <div className="d-flex">
                                            <p className="course-price-before-discount p-0">
                                                {formatPrice(price)}
                                            </p>
                                            <p className="course-price-after-discount mx-2 p-0">
                                                {formatPrice(price - (price * discount) / 100)}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="course-price my-2">{formatPrice(price)} </p>
                                    )}
                                </div>
                                <div className="flex justify-content-center mt-2">
                                    <Button className="w-75 flex">Register Now</Button>
                                </div>
                            </div>
                        </div>
                        <h2 className="sub-title course-detail-title mt-5">Available Classes</h2>
                        <CourseClasses courseClasses={courseClasses} />
                        <h2 className="sub-title course-detail-title mt-5">Feedbacks</h2>
                        <CourseFeedback />
                    </div>
                    {/* </div> */}
                    {/* </div> */}
                </div>
            </main>
        </div>
    );
}
