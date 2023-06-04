import React from "react";
import axios from "axios";
import "./Login.scss";
import Swal from "sweetalert2";
import video from "../../assets/video.mp4";
import { Form, Input, Select } from "antd";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import { api } from "../../constants/api";
import FooterHome from "../../component/FooterHome/FooterHome";

export default function Login() {
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
        title: "Loading...",
        timer: 1000,
        timerProgressBar: true,
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

          Swal.fire({
            position: "center",
            icon: "success",
            title: `Log in successfully! </br> Welcome ${res.data.firstName} ${res.data.lastName}`,
            showConfirmButton: true,
            timer: 2000,
          }).then(function () {
            if (res.data.role.id == 1) {
              window.location.href = "/admin";
            } else if (res.data.role.id == 2) {
              window.location.href = "/staff";
            } else if (res.data.role.id == 3) {
              window.location.href = "/trainer";
            } else if (res.data.role.id == 4) {
              window.location.href = "/trainee";
            }
          });
        })
        .catch((err) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title:
              "Log in failed!</br> Your phone number or password is not correct. </br> Please check again",
            showConfirmButton: true,
            timer: 2000,
          });
        });
    },
  });

  const handleChangePassword = (accountID) => {
    Swal.fire({
      title: `Enter your new Password`,
      html: `Your Password must be at least 6 chacracters`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      allowOutsideClick: false,
    })
      .then(async (result) => {
        if (result.isDenied === true || result.isDismissed === true) {
          Swal.fire({
            title: `Are you sure to cancel to reset Password?`,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isDenied === true || result.isDismissed === true) {
              handleChangePassword(accountID);
            } else if (result.isConfirmed === true) {
            }
          });
        } else if (result.isConfirmed === true) {
          if (result.value.trim().length < 6) {
            await Swal.fire({
              position: "center",
              icon: "error",
              title:
                "Your password must be at least 6 chacracters. </br> Please enter again!",
              showConfirmButton: false,
              timer: 2000,
            }).then(function () {
              handleChangePassword(accountID);
            });
          } else {
            api
              .put(`/Account/UpdatePasswordAccount?id=${accountID}`, {
                password: result.value.trim(),
              })
              .then((res) => {
                if (res.status == 200) {
                  api
                    .get("/Account/AccountList")
                    .then((res) => {
                      let userList = [];
                      userList = res.data;
                      let pos = userList.findIndex((obj) => {
                        return (
                          obj.accountID.toString().trim() ==
                          accountID.toString().trim()
                        );
                      });
                      localStorage.removeItem("USER_LOGIN");
                      localStorage.setItem(
                        "USER_LOGIN",
                        JSON.stringify(userList[pos])
                      );
                      Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Reset Password Successfully</br>Welcome ${userList[pos].firstName} ${userList[pos].lastName}`,
                        showConfirmButton: true,
                        timer: 1500,
                      }).then(function () {
                        if (userList[pos].role.id == 1) {
                          window.location.href = "/admin";
                        } else if (userList[pos].role.id == 2) {
                          window.location.href = "/staff";
                        } else if (userList[pos].role.id == 3) {
                          window.location.href = "/trainer";
                        } else if (userList[pos].role.id == 4) {
                          window.location.href = "/trainee";
                        }
                      });
                    })
                    .catch((err) => {});
                }
              })
              .catch((err) => {});
          }
        }
      })
      .catch((err) => {});
  };

  const handleResetPassword = (validationCode, email, accountID, time) => {
    console.log(validationCode);
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
              title: "Loading...",
              html: "Please wait a few seconds",
              timer: 1200,
              timerProgressBar: true,
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
            title: `Are you sure to cancel to reset Password?`,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isDenied === true || result.isDismissed === true) {
              handleResetPassword(validationCode, email, accountID, timeLeft);
            } else if (result.isConfirmed === true) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Reset Password failed!</br>Please try again",
                showConfirmButton: true,
                timer: 1000,
              });
            }
          });
        } else if (result.isConfirmed === true) {
          if (result.value == validationCode) {
            handleChangePassword(accountID);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Wrong verify code! </br> Please enter again",
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
              title: "Loading...",
              html: "Please wait a few seconds",
              timer: 1200,
              timerProgressBar: true,
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
              title:
                "This Email has not been registered! </br> Please try again",
              showConfirmButton: true,
              timer: 2500,
            }).then(function () {
              handleForgetPassword();
            });
          }
        }
      })
      .catch((err) => {});
  };

  return (
    <div>
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>

      <main>
        <div className="box m-0 mt-5" style={{ height: "90vh" }}>
          <div className="inner-box inner-log-in flex justify-content-center">
            <div className="container flex justify-content-center">
              <div className="videoDiv d-none d-lg-flex d-md-none d-sm-none">
                <video src={video} autoPlay muted loop></video>

                <div className="textDiv py-2">
                  <h2 className="title">Log In</h2>
                  <p className="py-2">
                    YogaCenter - Do Yoga today for a better tomorrow
                  </p>
                </div>

                <div className="footerDiv flex">
                  <span className="text">Don't have an account yet?</span>
                  <Link to={"/register"}>
                    <button className="btn flex">Register</button>
                  </Link>
                </div>
              </div>
              <div className="form-container form-login-container flex justify-content-center">
                <Form
                  onFinish={formik.handleSubmit}
                  {...formItemLayout}
                  form={form}
                  size="large"
                  autoComplete="off"
                >
                  <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                      {
                        required: true,
                        message: "Phone Number cannot be blank",
                      },
                      {
                        message: "Phone is not in correct form",
                        pattern: /(0|[1-9][0-9]*)$/,
                      },
                      { min: 10, message: "Phone must be 10-11 numbers" },
                      {
                        max: 11,
                        message: "Phone must be 10-11 numbers",
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
                  <Form.Item
                    name="password"
                    label="Password"
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
                  </Form.Item>
                  <button
                    className="bg-green-500 text-gray-100 text-xl p-2 w-96 rounded-full tracking-wide
                          font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-green-600
                          shadow-lg mt-3"
                    type="submit"
                  >
                    Log In
                  </button>
                  <Link
                    onClick={handleForgetPassword}
                    className="mt-3 text-center text-decoration-none text-danger text-forget-password"
                  >
                    <span className="text-black">Forget Password?</span> Click
                    here
                  </Link>
                </Form>
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
