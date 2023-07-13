import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Login.scss";
import Swal from "sweetalert2";
import video from "../../assets/video.mp4";
import { Form, Input, Select } from "antd";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useFormik } from "formik";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import { api } from "../../constants/api";
import FooterHome from "../../component/FooterHome/FooterHome";
import { alert } from "../../component/AlertComponent/Alert";
import GoogleButton from "react-google-button";
import { UserAuth } from "../../constants/AuthContext";

import Aos from "aos";

export default function Login() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  let USER = {};
  USER = JSON.parse(USER_LOGIN);
  if (
    !(
      USER_LOGIN == null ||
      USER_LOGIN == undefined ||
      USER.accountID == undefined
    ) &&
    (localStorage.getItem("USER_LOGIN_GMAIL_ACTION") == null ||
      localStorage.getItem("USER_LOGIN_GMAIL_ACTION") == undefined)
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      width: "25rem",
      padding: "2rem",
      background: "#e8ffff",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "info",
      title: `You have logged in already.`,
    });
    return <Navigate to="/" />;
  } else if (
    !(
      localStorage.getItem("USER_LOGIN_GMAIL_ACTION") == null ||
      localStorage.getItem("USER_LOGIN_GMAIL_ACTION") == undefined
    )
  ) {
    localStorage.removeItem("USER_LOGIN_GMAIL_ACTION");
  }
  localStorage.setItem("MENU_ACTIVE", "/login");
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect");

  const { googleSignIn, user, logOut } = UserAuth();
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user != null) {
      api
        .get(`/Account/AccountList`)
        .then((res) => {
          let arr = [];
          arr = res.data;
          let pos = arr.findIndex(
            (account) =>
              account.email.trim().toString() == user.email.trim().toString() &&
              !account.deleted
          );
          if (pos >= 0) {
            localStorage.removeItem("USER_LOGIN");
            localStorage.setItem("USER_LOGIN", JSON.stringify(arr[pos]));
            localStorage.setItem("USER_LOGIN_GMAIL_ACTION", "true");
            Swal.fire({
              position: "center",
              icon: "success",
              title: `<h1>Welcome ${arr[pos].firstName} ${arr[pos].lastName}</h1>`,
              html: `<h3>Log In Successfully</h3>`,
              showConfirmButton: false,
              timer: 1600,
            }).then(function () {
              if (arr[pos].role.id == 1) {
                navigate("/admin");
              } else if (arr[pos].role.id == 2) {
                navigate("/staff");
              } else if (arr[pos].role.id == 3) {
                navigate("/");
              } else if (arr[pos].role.id == 4) {
                navigate("/");
              }
            });
          } else {
            alert.alertFailedWithTime(
              "Failed To Log In",
              "This Email has not been registered",
              3300,
              "33",
              () => {}
            );
          }
        })
        .catch((err) => {})
        .finally(async () => {
          await logOut();
        });
    }
  }, [user]);

  useEffect(() => {
    document.querySelector("#google_button span").innerHTML =
      "Log In With Gmail";
  }, []);

  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const [form] = Form.useForm();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      phoneNumber: "",
      password: "",
    },

    onSubmit: (values) => {
      let timerInterval;
      Swal.fire({
        title: "Loading",
        html: "Please wait a few seconds...",
        timer: 10000,
        timerProgressBar: false,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      api
        .post("/Account/CheckLogin", values)
        .then((res) => {
          localStorage.removeItem("USER_LOGIN");
          localStorage.setItem("USER_LOGIN", JSON.stringify(res.data));
          Swal.close();
          setTimeout(() => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: `<h1>Welcome ${res.data.firstName} ${res.data.lastName}</h1>`,
              html: `<h3>Log In Successfully</h3>`,
              showConfirmButton: false,
              timer: 1600,
            }).then(function () {
              if (res.data.role.id == 1) {
                navigate("/admin");
              } else if (res.data.role.id == 2) {
                navigate("/staff");
              } else if (res.data.role.id == 3) {
                if (redirect) {
                  navigate(redirect);
                } else {
                  navigate("/");
                }
              } else if (res.data.role.id == 4) {
                if (redirect) {
                  navigate(redirect);
                } else {
                  navigate("/");
                }
              }
            });
          }, 200);
        })
        .catch((err) => {
          alert.alertFailedWithTime(
            "Failed To Log In",
            "Your phone number or password is not correct",
            3300,
            "33",
            () => {}
          );
        });
    },
  });

  const handleResetPassword = (validationCode, email, accountID, time) => {
    Swal.fire({
      title: `Verify your Account`,
      html: `We have sent a code to your Email: </br> ${email}. <br/>
  Please check and enter this code here. <br/> This will close in <b class="time"></b> seconds.
  </br><b>Send another code?</b> <a class="again" style="cursor:pointer; text-decoration: none"></a>`,
      input: "text",
      timer: time,
      timerProgressBar: true,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      didOpen: () => {
        const sendCodeAgainHTML =
          Swal.getHtmlContainer().querySelector("a.again");
        sendCodeAgainHTML.addEventListener("click", () => {
          Swal.fire({
            position: "center",
            title: `We have sent another code to your Email.</br>Please check your Email again.`,
            showConfirmButton: false,
            timer: 2000,
          }).then(function () {
            let timerInterval;
            Swal.fire({
              title: "Loading",
              html: "Please wait a few seconds...",
              timer: 10000,
              timerProgressBar: false,
              didOpen: () => {
                Swal.showLoading();
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            });
            api
              .post(`/Account/CreateValidationCode?email=${email}`)
              .then((res) => {
                handleResetPassword(
                  res.data.validationCode,
                  email,
                  res.data.accountID,
                  180000
                );
              });
          });
        });
        sendCodeAgainHTML.textContent = `Click here`;
        const b = Swal.getHtmlContainer().querySelector("b.time");
        let timerInterval = setInterval(() => {
          b.textContent = Math.floor(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      preConfirm: (login) => {},
      allowOutsideClick: false,
    })
      .then((result) => {
        let timeLeft = Swal.getTimerLeft();
        if (result.isDenied === true || result.isDismissed === true) {
          Swal.fire({
            title: `Are you sure to cancel?`,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            allowOutsideClick: false,
            focusCancel: true,
            confirmButtonColor: "red",
            cancelButtonColor: "green",
          }).then((result) => {
            if (result.isDenied === true || result.isDismissed === true) {
              handleResetPassword(validationCode, email, accountID, timeLeft);
            } else if (result.isConfirmed === true) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed To Reset Password</br>Please try again",
                showConfirmButton: false,
                timer: 1000,
              });
            }
          });
        } else if (result.isConfirmed === true) {
          if (result.value == validationCode) {
            localStorage.setItem("CHECK_VERIFY_EMAIL_FORGET", "true");
            localStorage.setItem("accountID", `${accountID}`);
            navigate(`/resetPassword`);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Incorrect Code</br>Please enter again",
              showConfirmButton: false,
              timer: 1000,
            }).then(function () {
              handleResetPassword(validationCode, email, accountID, timeLeft);
            });
          }
        }
      })
      .catch((err) => {});
  };

  const handleForgetPassword = () => {
    Swal.fire({
      title: `Enter your Email`,
      html: `Please enter Email you have registered`,
      input: "email",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      allowOutsideClick: false,
    })
      .then(async (result) => {
        if (result.isConfirmed === true) {
          let checkEmail = false;
          await api
            .get("/Account/CheckResetEmail", {
              params: { email: result.value },
            })
            .then((res) => {
              checkEmail = res.data;
            })
            .catch((err) => {});
          if (checkEmail) {
            let timerInterval;
            Swal.fire({
              title: "Loading",
              html: "Please wait a few seconds...",
              timer: 10000,
              timerProgressBar: false,
              didOpen: () => {
                Swal.showLoading();
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            });
            api
              .post(`/Account/CreateValidationCode?email=${result.value}`)
              .then((res) => {
                handleResetPassword(
                  res.data.validationCode,
                  result.value,
                  res.data.accountID,
                  180000
                );
              })
              .catch((err) => {});
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Incorrect Email",
              html: "This Email has not been registered</br>Please try again",
              showConfirmButton: false,
              timer: 1500,
            }).then(function () {
              handleForgetPassword();
            });
          }
        }
      })
      .catch((err) => {});
  };

  Aos.init();

  return (
    <div>
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>

      <main>
        <div
          className="box m-0 mt-5"
          style={{ height: "90vh" }}
          data-aos="fade-in"
          data-aos-duration="300"
        >
          <div className="inner-box inner-log-in flex justify-content-center">
            <div className="container flex justify-content-center">
              <div
                className="videoDiv d-none d-lg-flex d-md-none d-sm-none"
                data-aos="fade-up-right"
                data-aos-delay="50"
              >
                <video src={video} autoPlay muted loop>
                  <source src={video} type="video/mp4" />
                </video>

                <div className="textDiv py-2">
                  <h2 className="title">Log In</h2>
                  <p className="py-2">
                    YogaCenter - Do Yoga today for a better tomorrow
                  </p>
                </div>

                <div className="footerDiv flex">
                  <span className="text">Don't have an account yet?</span>
                  <NavLink to={"/register"}>
                    <button className="btn flex">Register</button>
                  </NavLink>
                </div>
              </div>
              <div
                className="form-container form-login-container flex justify-content-center row"
                data-aos="fade-down-left"
                data-aos-delay="50"
              >
                <div className="col-11 flex justify-content-center">
                  <Form
                    onFinish={formik.handleSubmit}
                    {...formItemLayout}
                    form={form}
                    size="large"
                    autoComplete="off"
                  >
                    <div className="flex row align-items-start justify-content-between">
                      <p className="col-sm-12 col-md-5  p-0 m-0 px-2 pt-2 flex">
                        <span className="text-danger px-1">
                          <i
                            className="fa-solid fa-star-of-life text-danger"
                            style={{
                              fontSize: "6px",
                              verticalAlign: "middle",
                            }}
                          ></i>{" "}
                        </span>
                        <span>Phone Number:</span>
                      </p>
                      <Form.Item
                        className="mx-0 px-0 col-sm-12 col-md-7"
                        name="phoneNumber"
                        // label="Phone Number"
                        rules={[
                          {
                            required: true,
                            message: "Phone cannot be blank",
                          },
                          {
                            message: "Phone must be 10-11 numbers",
                            pattern: /^([0-9]{10,11})$/,
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          style={{ width: "100%" }}
                          name="phoneNumber"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          placeholder="Enter Phone Number"
                        />
                      </Form.Item>
                    </div>
                    <div className="flex row align-items-start justify-content-between">
                      <p className="col-sm-12 col-md-5  p-0 m-0 px-2 pt-2 flex">
                        <span className="text-danger px-1">
                          <i
                            className="fa-solid fa-star-of-life text-danger"
                            style={{
                              fontSize: "6px",
                              verticalAlign: "middle",
                            }}
                          ></i>{" "}
                        </span>
                        <span>Password:</span>
                      </p>
                      <Form.Item
                        className="mx-0 px-0 col-sm-12 col-md-7"
                        name="password"
                        label=""
                        rules={[
                          {
                            required: true,
                            message: "Password cannot be blank",
                          },
                          {
                            min: 6,
                            message: "Password must be at least 6 characters",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input.Password
                          name="password"
                          type="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          placeholder="Enter Password"
                        />
                      </Form.Item>{" "}
                    </div>
                    <button
                      className="bg-green-500 text-gray-100 text-xl p-2 w-96 rounded-full tracking-wide
                          font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-green-600
                          shadow-lg mt-3 pt-1"
                      type="submit"
                    >
                      Log In
                    </button>
                    <div className="text-center mt-3">
                      <span
                        className="text-black"
                        style={{ fontWeight: "500" }}
                      >
                        Forget Password?
                      </span>{" "}
                      <NavLink
                        onClick={handleForgetPassword}
                        className="mt-3 text-center text-decoration-none text-danger text-forget-password"
                        style={{ fontWeight: "bolder" }}
                      >
                        Click here
                      </NavLink>
                    </div>
                  </Form>
                </div>
                <h3
                  className="text-center my-3"
                  style={{
                    fontWeight: "bolder",
                  }}
                >
                  OR
                </h3>
                <div className="col-11 flex justify-content-center">
                  <GoogleButton
                    className="border-0 "
                    id="google_button"
                    style={{
                      backgroundColor: "#000",
                    }}
                    onClick={handleGoogleSignIn}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="0">
        <FooterHome />
      </div>
    </div>
  );
}
