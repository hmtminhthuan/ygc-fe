import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import "./CourseItem.scss";
import { useNavigate, NavLink } from "react-router-dom";
import image from "../../assets/images/img-demo.jpg";
import { api } from "../../constants/api";
import Swal from "sweetalert2";
import { alert } from "../../component/AlertComponent/Alert";
export default function CourseDetail({
  courseID,
  courseName,
  description,
  levelName,
  price,
  discount,
  courseImg,
  deleted,
  ...restParams
}) {
  const [availablePayment, setAvailablePayment] = useState(false);
  const [linkPayment, setLinkPayment] = useState("");
  const [userLogin, setUserLogin] = useState({});
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const navigate = useNavigate();

  useEffect(() => {
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
        //     courseId: courseID,
        //   })
        //   .then((res) => {
        //     setLinkPayment(res.data);
        //   })
        //   .catch((err) => {});
      }
    }
  }, []);

  return (
    <Card style={{ width: "85%" }} className="my-4">
      <div className="w-100 text-center" style={{ height: "250px" }}>
        <Card.Img
          variant="top"
          src={courseImg == null || courseImg == "" ? image : courseImg}
        />
      </div>
      {discount != null && discount != "" && discount >= 0 ? (
        <div className="course-tag-discount py-2 pt-1 px-2">
          <p>{discount}&#37;</p>
          <p>Discount</p>
        </div>
      ) : (
        <></>
      )}
      <Card.Body>
        <p className="course-level my-2 mt-2"> Level: {levelName}</p>
        <Card.Title>{courseName}</Card.Title>
        <Card.Text className="course-des">
          {description.length >= 100
            ? description.substring(0, 100).trim() + "..."
            : description}{" "}
          {description.length >= 100 ? (
            <NavLink
              to={`/courseDetail/${courseID}`}
              className="text-decoration-none"
            >
              View More
            </NavLink>
          ) : (
            <></>
          )}
        </Card.Text>
        {discount != null && discount != "" && discount >= 0 ? (
          <p className="my-2" style={{ fontWeight: "600" }}>
            <span className="course-price-before-discount p-0">
              {formatPrice(price)}
            </span>
            <span className="course-price-after-discount mx-2 p-0">
              {formatPrice(price - (price * discount) / 100)}
            </span>
          </p>
        ) : (
          <p className="course-price my-2" style={{ fontWeight: "600" }}>
            {formatPrice(price)}{" "}
          </p>
        )}

        <div className="button text-center pt-1">
          <Button
            // to={`/courseDetail/${courseID}`}
            className="course-view-detail mx-1 mt-1"
            variant=""
          >
            <NavLink
              style={{ textDecoration: "none", color: "white" }}
              to={`/courseDetail/${courseID}`}
            >
              View Details
            </NavLink>
          </Button>
          {availablePayment ? (
            <Button
              href={`courseDetail/${courseID}`}
              className="course-register-now mx-1 mt-1"
              variant=""
              onClick={() => {
                localStorage.setItem("NOTIFICATION_CHOOSE_CLASS", "true");
              }}
              // target="blank"
            >
              Register Now
            </Button>
          ) : (
            <button
              className="course-register-now m-0 mx-1 mt-1 border-0
                py-2 px-2"
              variant=""
              target="blank"
              style={{ borderRadius: "5px", transform: "translateY(2px)" }}
              onClick={() => {
                if (userLogin.role == null || userLogin.role == undefined) {
                  Swal.fire({
                    title: `You need to log in first`,
                    html: `Do you want to log in or register now?`,
                    icon: "info",
                    confirmButtonText: "Log in now",
                    denyButtonText: "Register now",
                    showCancelButton: false,
                    showDenyButton: true,
                    showConfirmButton: true,
                    allowOutsideClick: false,
                    showCloseButton: true,
                    focusCancel: false,
                    focusConfirm: false,
                    focusDeny: false,
                    confirmButtonColor: "#42c4ee",
                    denyButtonColor: "#d08fba",
                  }).then((result) => {
                    if (result.isDenied === true) {
                      localStorage.setItem("NOTIFICATION_CHOOSE_CLASS", `true`);
                      navigate(`/register?redirect=/courseDetail/${courseID}`);
                    } else if (result.isConfirmed === true) {
                      localStorage.setItem("NOTIFICATION_CHOOSE_CLASS", `true`);
                      navigate(`/login?redirect=/courseDetail/${courseID}`);
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
                } else {
                  navigate(`/courseDetail/${courseID}`);
                }
              }}
            >
              Register Now
            </button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
