import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import HeaderHome from "../../../component/HeaderHome/HeaderHome";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./CourseDetail.scss";
import { Button } from "react-bootstrap";
import CourseClasses from "./CourseClasses/CourseClasses";
import CourseFeedback from "./CourseFeedback/CourseFeedback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "../../../constants/api";
import FooterHome from "../../../component/FooterHome/FooterHome";
import { alert } from "../../../component/AlertComponent/Alert";
import Aos from "aos";
import LoadingOverlay from "../../../component/Loading/LoadingOverlay";

export default function CourseDetail() {
  localStorage.setItem("MENU_ACTIVE", "/course");

  const param = useParams();
  const [courseDetail, setCourseDetail] = useState([]);
  const [courseClasses, setCourseClasses] = useState([]);
  const [courseFeedback, setCourseFeedback] = useState([]);
  const [availablePayment, setAvailablePayment] = useState(false);
  const [linkPayment, setLinkPayment] = useState("");
  const [userLogin, setUserLogin] = useState({});
  const [viewData, setViewData] = useState(false);
  const [viewClassFirst, setViewClassFirst] = useState(false);
  const [loading, setLoading] = useState(true);
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  let arr = [];
  useEffect(() => {
    window.scrollTo(0, 0);
    api
      .get("/Course/GetCourseByID", {
        params: { id: param.id },
      })
      .then((res) => {
        setCourseDetail(res.data.course);
        setCourseClasses(res.data.listClass);
        setCourseFeedback(res.data.listFeedback);
        arr = res.data.listClass;
        setLoading(false);
      })
      .catch((err) => {})
      .finally(() => {
        setViewData(true);
        setTimeout(() => {
          setLoading(false);
        }, 150);
        if (
          localStorage.getItem("NOTIFICATION_CHOOSE_CLASS") == "true" &&
          arr.length > 0
        ) {
          setViewClassFirst(true);
          if (
            localStorage.getItem("NOTIFICATION_CHOOSE_CLASS_NONE") == "true"
          ) {
            setTimeout(() => {
              alert.alertFailedWithTime(
                "Failed To Pay",
                "Please try to pay again",
                3500,
                "30",
                () => {}
              );
              localStorage.removeItem("NOTIFICATION_CHOOSE_CLASS_NONE");
            }, 1300);
          } else {
            alert.alertInfoNotiForTrainee(
              "Please choose the class you want to register",
              "",
              () => {}
            );
          }
          localStorage.removeItem("NOTIFICATION_CHOOSE_CLASS");
        }
        if (
          localStorage.getItem("NOTIFICATION_CHOOSE_CLASS") == "true" &&
          arr.length == 0
        ) {
          alert.alertInfoNotiForTrainee(
            "We Are Sorry",
            "This course does not have any classess at the present</br>Please contact with us for more support",
            () => {}
          );
          localStorage.removeItem("NOTIFICATION_CHOOSE_CLASS");
        }
      });

    const USER_LOGIN = localStorage.getItem("USER_LOGIN");
    let USER = {};
    if (USER_LOGIN != null) {
      USER = JSON.parse(USER_LOGIN);
      setUserLogin(USER);
      if (
        !(
          USER.accountID == null ||
          USER.accountID == undefined ||
          USER.role == null ||
          USER.role == undefined ||
          USER.role.id != 4
        )
      ) {
        setAvailablePayment(true);
      }
    }
  }, []);

  let {
    courseName,
    levelName,
    description,
    price,
    discount,
    courseImg,
    ...restParams
  } = courseDetail;

  return (
    <div>
      <LoadingOverlay loading={loading} />
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>
      <main className="pt-5">
        <div
          className={`box course-detail-area mt-5 my-5
         ${viewData ? "" : "d-none"}`}
        >
          <div className="course-detail-info w-100 form-container flex-column justify-content-start align-items-start p-3">
            <div className="row justify-content-center">
              <div className="col-10 mt-3">
                <NavLink
                  to={"/course"}
                  className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                  style={{ fontSize: "18px", fontWeight: "500" }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span className="mx-2">Back</span>
                </NavLink>
              </div>{" "}
            </div>
            {viewClassFirst ? (
              <>
                <h2 className="course-detail-title course-detail-name m-4 mt-0 pt-3">
                  Available Classes
                </h2>
                <CourseClasses
                  courseClasses={courseClasses}
                  courseId={param.id}
                  discount={discount}
                  price={price}
                />
              </>
            ) : (
              <></>
            )}
            <h2
              className={`course-detail-title m-4 mt-0
             ${!viewClassFirst ? " course-detail-name " : "pt-3"}`}
            >
              {courseName}
            </h2>
            <div className="row d-lg-flex align-items-stretch justify-content-center">
              <div className="course-detail-img col-lg-4 col-10 flex justify-content-start">
                <img
                  className="h-100"
                  style={{ width: "100%" }}
                  src={courseImg}
                />
                {discount != null && discount != "" && discount >= 0 ? (
                  <div className="course-tag-discount py-2 pt-1 px-2">
                    <p>{discount}&#37;</p>
                    <p>Discount</p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="course-detail-des col-lg-5 col-10 mt-lg-0 mt-sm-3 mt-sm-4 px-4 h-10">
                <p className="course-detail-des-level">
                  {" "}
                  <span className="sub-title">Level: </span> {levelName}
                </p>
                <p className="course-detail-des-description">
                  <span className="sub-title">Description: </span>
                  {description}
                </p>
                <div className="course-detail-des-price d-flex">
                  <span className="sub-title" style={{ margin: "0 10px 0 0" }}>
                    Price:
                  </span>
                  {discount != null && discount != "" && discount >= 0 ? (
                    <div className="d-lg-flex">
                      <p className="course-price-before-discount p-0">
                        {formatPrice(price)}
                      </p>
                      <p className="course-price-after-discount mx-lg-2 p-0">
                        {formatPrice(price - (price * discount) / 100)}
                      </p>
                    </div>
                  ) : (
                    <p className="course-price course-price-after-discount">
                      {formatPrice(price)}{" "}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {!viewClassFirst ? (
              <>
                <h2 className="sub-title course-detail-title mt-4">
                  Available Classes
                </h2>
                <CourseClasses
                  courseClasses={courseClasses}
                  courseId={param.id}
                  discount={discount}
                  price={price}
                />
              </>
            ) : (
              <></>
            )}
            <h2 className="sub-title course-detail-title mt-4">
              Rating &amp; Feedbacks
            </h2>
            <CourseFeedback courseFeedback={courseFeedback} />
          </div>
        </div>
      </main>
      <div>
        <FooterHome />
      </div>
    </div>
  );
}
