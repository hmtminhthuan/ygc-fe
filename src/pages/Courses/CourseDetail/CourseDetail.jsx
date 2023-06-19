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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "../../../constants/api";
import FooterHome from "../../../component/FooterHome/FooterHome";
import Swal from "sweetalert2";
import { alert } from "../../../component/AlertComponent/Alert";

export default function CourseDetail() {
  localStorage.setItem("MENU_ACTIVE", "home-course");

  const param = useParams();
  const [courseDetail, setCourseDetail] = useState([]);
  const [courseClasses, setCourseClasses] = useState([]);
  const [courseFeedback, setCourseFeedback] = useState([]);
  const [availablePayment, setAvailablePayment] = useState(false);
  const [linkPayment, setLinkPayment] = useState("");
  const [userLogin, setUserLogin] = useState({});
  const [viewData, setViewData] = useState(false);
  const [viewClassFirst, setViewClassFirst] = useState(false);
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  useEffect(() => {
    api
      .get("/Course/GetCourseByID", {
        params: { id: param.id },
      })
      .then((res) => {
        setCourseDetail(res.data);
      })
      .catch((err) => {});
    let arr = [];
    api
      .get("/Class/GetClassByCourseID", {
        params: { courseid: param.id },
      })
      .then((res) => {
        setCourseClasses(res.data);
        arr = res.data;
      })
      .catch((err) => {})
      .finally(() => {
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
            setTimeout(() => {
              alert.alertInfoNotiForTrainee(
                "Please choose the class you want to register",
                "",
                () => {}
              );
            }, 1300);
          }
          localStorage.removeItem("NOTIFICATION_CHOOSE_CLASS");
        }
        if (
          localStorage.getItem("NOTIFICATION_CHOOSE_CLASS") == "true" &&
          arr.length == 0
        ) {
          setTimeout(() => {
            alert.alertInfoNotiForTrainee(
              "We Are Sorry",
              "This course does not have any classess at the present</br>Please contact with us for more support",
              () => {}
            );
          }, 1200);
          localStorage.removeItem("NOTIFICATION_CHOOSE_CLASS");
        }
      });

    api
      .get("/Feedback/GetCourseFeedbackbyId", {
        params: { courseid: param.id },
      })
      .then((res) => {
        setCourseFeedback(res.data);
      })
      .catch((err) => {});

    let timerInterval;
    Swal.fire({
      title: "Loading...",
      timer: 1300,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        setViewData(true);
        clearInterval(timerInterval);
      },
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
        // api
        //   .post(`/CheckOutVNPAY`, {
        //     amount: parseInt(price * (1 - discount / 100)),
        //     accId: USER.accountID,
        //     courseId: param.id,
        //   })
        //   .then((res) => {
        //     setLinkPayment(res.data);
        //   })
        //   .catch((err) => {});
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
                <Link
                  to={"/course"}
                  className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                  style={{ fontSize: "18px", fontWeight: "500" }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span className="mx-2">Back</span>
                </Link>
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
                {/* <div className="flex justify-content-center mt-2">
                  {availablePayment ? (
                    <Button
                      href={linkPayment}
                      target="blank"
                      className="w-75 flex"
                      variant=""
                    >
                      <p
                        className="p-0 m-0 bg-success text-light py-2 bg-opacity-100"
                        style={{ borderRadius: "8px", fontWeight: "bolder" }}
                      >
                        Register Now
                      </p>
                    </Button>
                  ) : (
                    <button
                      className="w-75 flex justify-content-center text-cente py-2 border-0"
                      style={{ borderRadius: "8px" }}
                      onClick={() => {
                        if (
                          userLogin.role == null ||
                          userLogin.role == undefined
                        ) {
                          Swal.fire({
                            title: `You need to Log in first`,
                            html: `Do you want to Log in now?`,
                            icon: "info",
                            showCancelButton: true,
                            showConfirmButton: true,
                            confirmButtonText: "Yes",
                            cancelButtonText: "No",
                            allowOutsideClick: false,
                          }).then((result) => {
                            if (
                              result.isDenied === true ||
                              result.isDismissed === true
                            ) {
                            } else if (result.isConfirmed === true) {
                              window.location.href = "/login";
                            }
                          });
                        } else if (userLogin.role.id != 4) {
                          Swal.fire({
                            title: `Your account cannot register course.`,
                            icon: "info",
                            showCancelButton: false,
                            showConfirmButton: true,
                            confirmButtonText: "Confirm",
                            allowOutsideClick: true,
                          });
                        }
                      }}
                    >
                      Register Now
                    </button>
                  )}
                </div> */}
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
