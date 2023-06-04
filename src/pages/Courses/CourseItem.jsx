import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import "./CourseItem.scss";
import { Link } from "react-router-dom";
import image from "../../assets/images/img-demo.jpg";
import { api } from "../../constants/api";
import Swal from "sweetalert2";
export default function CourseDetail({
  courseID,
  courseName,
  description,
  levelName,
  price,
  discount,
  courseImg,
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
        api
          .post(`/CheckOutVNPAY`, {
            amount: parseInt(price * (1 - discount / 100)),
            accId: USER.accountID,
            courseId: courseID,
          })
          .then((res) => {
            setLinkPayment(res.data);
          })
          .catch((err) => {});
      }
    }
  }, []);

  return (
    <div className="col-lg-4 col-sm-12 col-md-6 flex justify-content-center">
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
              <Link
                to={`/courseDetail/${courseID}`}
                className="text-decoration-none"
              >
                View More
              </Link>
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
              href={`/courseDetail/${courseID}`}
              className="course-view-detail mx-1 mt-1"
              variant=""
            >
              View Details
            </Button>
            {availablePayment ? (
              <Button
                href={linkPayment}
                className="course-register-now mx-1 mt-1"
                variant=""
                target="blank"
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
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
