import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Register.scss";
import Swal from "sweetalert2";
import video from "../../assets/video.mp4";
import { Form, Input, Select } from "antd";
import {
  Await,
  Link,
  useNavigate,
  useLocation,
  NavLink,
  Navigate,
} from "react-router-dom";
import { useFormik } from "formik";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import { api } from "../../constants/api";
import FooterHome from "../../component/FooterHome/FooterHome";
import TextArea from "antd/es/input/TextArea";
import { alert } from "../../component/AlertComponent/Alert";
import Aos from "aos";
import GoogleButton from "react-google-button";
import { UserAuth } from "../../constants/AuthContext";

export default function Register() {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const [registerByEmail, setRegisterByEmail] = useState(false);
  const [emailRegisterByEmail, setEmailRegisterByEmail] = useState("");
  let USER = {};
  USER = JSON.parse(USER_LOGIN);
  if (
    !(
      USER_LOGIN == null ||
      USER_LOGIN == undefined ||
      USER.accountID == undefined
    )
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      width: "35rem",
      padding: "2rem",
      background: "#e8ffff",
      showConfirmButton: false,
      timer: 7000,
      timerProgressBar: true,
      showCloseButton: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "info",
      title: `You have logged in already.`,
      html: `In case you want to register another account.</br>Please log out first.`,
    });
    return <Navigate to="/" />;
  }
  localStorage.setItem("MENU_ACTIVE", "/register");
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect");
  const { googleSignIn, user, logOut } = UserAuth();
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {}
  };

  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const [form] = Form.useForm();

  const handleRegister = (values) => {
    const roleId = 4;
    values = { ...values, roleId };
    values.img =
      "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--female.jpg?alt=media&token=f58778d6-9193-453b-93e4-ddbab5db5e37";
    if (values.gender) {
      values.img =
        "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--male.jpg?alt=media&token=b62e9e4f-0e8e-43f9-ae9d-fba29d67d112";
    }
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
      .post("/Account/CreateAccount", values)
      .then((res) => {
        api
          .get("/Account/AccountList")
          .then((res) => {
            let userList = [];
            userList = res.data;
            let pos = userList.findIndex((obj) => {
              return (
                obj.email.toString().trim() == values.email.toString().trim()
              );
            });
            localStorage.removeItem("USER_LOGIN");
            localStorage.setItem("USER_LOGIN", JSON.stringify(userList[pos]));
            Swal.fire({
              position: "center",
              icon: "success",
              title: `Register successfully</br>Welcome ${values.firstname} ${values.lastname}`,
              showConfirmButton: false,
              timer: 2000,
            }).then(function () {
              if (userList[pos].role.id == 1) {
                navigate("/admin");
              } else if (userList[pos].role.id == 2) {
                navigate("/staff");
              } else if (userList[pos].role.id == 3) {
                if (redirect) {
                  navigate(redirect);
                } else {
                  navigate("/");
                }
              } else if (userList[pos].role.id == 4) {
                if (redirect) {
                  navigate(redirect);
                } else {
                  navigate("/");
                }
              }
            });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        alert.alertFailedWithTime(
          "Failed To Register",
          "This Email or Phone number has been registered",
          3300,
          "33",
          () => {}
        );
      });
  };

  const handleEnterVerifyCode = (values, validationCode, email, time) => {
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
            handleVerifyEmail(values);
          });
        });
        sendCodeAgainHTML.textContent = `Click here`;
        const b = Swal.getHtmlContainer().querySelector("b.time");
        let timerInterval = setInterval(() => {
          b.textContent = Math.floor(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      preConfirm: (login) => {},
      allowOutsideClick: () => false,
    })
      .then((result) => {
        let timeLeft = Swal.getTimerLeft();
        if (result.isDenied === true || result.isDismissed === true) {
          Swal.fire({
            title: `Are you sure to cancel to verify Email?`,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            allowOutsideClick: false,
            focusCancel: true,
            cancelButtonColor: "green",
            confirmButtonColor: "red",
          }).then((result) => {
            if (result.isDenied === true || result.isDismissed === true) {
              handleEnterVerifyCode(values, validationCode, email, timeLeft);
            } else if (result.isConfirmed === true) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed To Register</br>Please try again",
                showConfirmButton: false,
                timer: 1000,
              });
            }
          });
        } else if (result.isConfirmed === true) {
          if (result.value == validationCode) {
            handleRegister(values);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Incorrect Code</br> Please enter again",
              showConfirmButton: false,
              timer: 1000,
            }).then(function () {
              handleEnterVerifyCode(values, validationCode, email, timeLeft);
            });
          }
        }
      })
      .catch((err) => {});
  };

  const handleVerifyEmail = (values) => {
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
      .get(`/Account/SendCodeRegister?email=${values.email}`)
      .then((res) => {
        handleEnterVerifyCode(values, res.data, values.email, 180000);
      })
      .catch((err) => {});
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstname: "",
      lastname: "",
      gender: true,
      phoneNumber: "",
      email: "",
      address: "",
      password: "",
      img: "",
    },

    onSubmit: (values) => {
      if (registerByEmail) {
        values.email = emailRegisterByEmail;
        handleRegister(values);
      } else {
        handleVerifyEmail(values);
      }
    },
  });

  useEffect(() => {
    if (user != null) {
      setRegisterByEmail(false);
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
            alert.alertInfoNotiForTrainee(
              "This Email has been already registered",
              "",
              3300,
              "33",
              () => {}
            );
          } else {
            let fullname = user.displayName.split(" ");
            let firstname = fullname[0];
            let lastname = "";
            for (let i = 1; i < fullname.length; i++) {
              lastname += fullname[i];
            }
            formik.setFieldValue("firstname", firstname);
            formik.setFieldValue("lastname", lastname);
            formik.setFieldValue("email", user.email);
            form.setFieldsValue({
              firstname: firstname,
              lastname: lastname,
              email: user.email,
            });
            setRegisterByEmail(true);
            setEmailRegisterByEmail(user.email);
            alert.alertSuccessWithTime(
              "Verify Email Successfully",
              "Please complete other information to finish your registration",
              6000,
              "38",
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
      "Register With Gmail";
  }, []);

  const handleChangeGender = (gender) => {
    formik.setFieldValue("gender", gender);
  };

  Aos.init();

  return (
    <div>
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>
      <main>
        <div
          className="box m-0 mt-5 register-scroll"
          style={{ height: "90vh" }}
          data-aos="fade-in"
          data-aos-duration="300"
        >
          <div className="inner-box inner-register flex align-items-center">
            <div className="container flex justify-content-center align-items-center">
              <div
                className="row form-container form-register-container flex justify-content-center"
                data-aos="fade-down-right"
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
                        <span>Firstname:</span>
                      </p>
                      <Form.Item
                        className="mx-0 px-0 col-sm-12 col-md-7"
                        name="firstname"
                        label=""
                        rules={[
                          {
                            required: true,
                            message: "Firstname cannot be blank",
                          },
                          {
                            message: "Firstname is not in correct form",
                            pattern:
                              /^(([\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,}[\S^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,})|([\S^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,1}))$/,
                          },
                          // { min: 3, message: '' },
                        ]}
                        hasFeedback
                      >
                        <Input
                          name="firstname"
                          value={formik.values.firstname}
                          onChange={formik.handleChange}
                          placeholder="Enter Firstname"
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
                        <span>Lastname:</span>
                      </p>
                      <Form.Item
                        className="mx-0 px-0 col-sm-12 col-md-7"
                        name="lastname"
                        label=""
                        rules={[
                          {
                            required: true,
                            message: "Lastname cannot be blank",
                          },
                          {
                            message: "Lastname is not in correct form",
                            pattern:
                              /^(([\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,}[\S^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,})|([\S^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,1}))$/,
                          },
                          // { min: 3, message: '' },
                        ]}
                        hasFeedback
                      >
                        <Input
                          name="lastname"
                          value={formik.values.lastname}
                          onChange={formik.handleChange}
                          placeholder="Enter Lastname"
                        />
                      </Form.Item>{" "}
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
                        <span>Phone Number:</span>
                      </p>
                      <Form.Item
                        className="mx-0 px-0 col-sm-12 col-md-7"
                        name="phoneNumber"
                        label=""
                        rules={[
                          {
                            required: true,
                            message: "Phone Number cannot be blank",
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
                      <p className="col-sm-12 col-md-5 p-0 m-0 px-2 pt-2 flex">
                        <span className="text-danger px-1">
                          <i
                            className="fa-solid fa-star-of-life text-danger"
                            style={{
                              fontSize: "6px",
                              verticalAlign: "middle",
                            }}
                          ></i>{" "}
                        </span>
                        <span>Email:</span>
                      </p>
                      <Form.Item
                        className="mx-0 px-0 col-sm-12 col-md-7"
                        name="email"
                        label=""
                        rules={[
                          {
                            required: true,
                            message: "Email cannot be blank",
                          },
                          {
                            type: "email",
                            message: "Email is not in correct form",
                          },
                        ]}
                        style={{
                          display: `${registerByEmail ? "none" : ""}`,
                        }}
                        hasFeedback
                      >
                        <Input
                          id="input_email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          placeholder="Enter Email"
                        />
                      </Form.Item>
                      <p
                        className="ps-1 p-0 m-0 col-sm-12 col-md-7 mb-4"
                        style={{
                          display: `${!registerByEmail ? "none" : ""}`,
                          transform: "translateY(5px)",
                        }}
                      >
                        {emailRegisterByEmail}
                      </p>
                    </div>

                    <div className="flex row align-items-start justify-content-between">
                      <p className="col-sm-12 col-md-5 p-0 m-0 px-2 pt-2 flex">
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
                            message: "Password is at least 6 characters",
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

                    <div className="flex row align-items-start justify-content-between">
                      <p className="col-sm-12 col-md-5 p-0 m-0 px-2 pt-2 flex">
                        <span className="text-danger px-1">
                          <i
                            className="fa-solid fa-star-of-life text-danger"
                            style={{
                              fontSize: "6px",
                              verticalAlign: "middle",
                            }}
                          ></i>{" "}
                        </span>
                        <span>Confirm Password:</span>
                      </p>
                      <Form.Item
                        className="mx-0 px-0 col-sm-12 col-md-7"
                        name="confirm_password"
                        label=""
                        dependencies={["password"]}
                        rules={[
                          {
                            required: true,
                            message: "Confirm Password is required",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject("Confirm does not match");
                            },
                          }),
                        ]}
                        hasFeedback
                      >
                        <Input.Password
                          name="confirm_password"
                          type="password"
                          placeholder="Enter Password Again"
                        />
                      </Form.Item>
                    </div>

                    <div className="flex row align-items-start justify-content-between">
                      <p className="col-sm-12 col-md-5 p-0 m-0 px-2 pt-2 flex">
                        <span className="text-danger px-1">
                          <i
                            className="fa-solid fa-star-of-life text-danger"
                            style={{
                              fontSize: "6px",
                              verticalAlign: "middle",
                            }}
                          ></i>{" "}
                        </span>
                        <span>Gender:</span>
                      </p>
                      <Form.Item
                        className="mx-0 px-0 col-sm-12 col-md-7"
                        label=""
                        name="gender"
                        rules={[
                          {
                            required: true,
                            message: "Gender must be selected",
                          },
                        ]}
                        hasFeedback
                      >
                        <Select
                          name="gender"
                          width="200px"
                          placeholder="Select Gender"
                          value={formik.values.gender}
                          onChange={handleChangeGender}
                        >
                          <Select.Option value={true}>Male</Select.Option>
                          <Select.Option value={false}>Female</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="flex row align-items-start justify-content-between">
                      <p className="col-sm-12 col-md-5 p-0 m-0 px-2 pt-2 flex">
                        <span className="text-danger px-1"></span>
                        <span>Address:</span>
                      </p>
                      <Form.Item
                        className="mx-0 px-0 col-sm-12 col-md-7"
                        name="address"
                        label=""
                        rules={[
                          {
                            required: false,
                          },
                          {
                            pattern: /^(([]{0,0})|([\w]{1,1}[\w\s,]{0,}))$/,
                            message: "Address is not in correct form",
                          },
                        ]}
                        hasFeedback
                      >
                        <TextArea
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          placeholder="Enter Address (Optional)"
                        />
                      </Form.Item>
                    </div>

                    <Form.Item className="text-center">
                      <button
                        className="bg-green-500 text-gray-100 text-xl p-2 w-96 rounded-full tracking-wide
                          font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-green-600
                          shadow-lg"
                        type="submit"
                      >
                        Register
                      </button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
              <div
                className="videoDiv d-none d-lg-flex d-md-none d-sm-none"
                data-aos="fade-up-left"
                data-aos-delay="50"
              >
                <video src={video} autoPlay muted loop></video>

                <div className="textDiv py-2">
                  <h2 className="title">Register</h2>
                  <p className="py-2">
                    YogaCenter - Do Yoga today for a better tomorrow
                  </p>
                </div>

                <div className="footerDiv flex">
                  <div
                    className=" flex justify-content-center w-100"
                    style={{
                      position: "absolute",
                      left: "0",
                    }}
                  >
                    <GoogleButton
                      className="border-0 "
                      id="google_button"
                      style={{
                        backgroundColor: "#000",
                        transform: "translateY(-65px)",
                        width: "100%",
                      }}
                      onClick={handleGoogleSignIn}
                    />
                  </div>
                  <span className="text" style={{ zIndex: "999" }}>
                    Already have an account?
                  </span>
                  <NavLink to={"/login"} style={{ zIndex: "999" }}>
                    <button className="btn flex">Log In</button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="footer-register">
        <FooterHome />
      </div>
    </div>
  );
}
