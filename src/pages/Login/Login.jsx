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
      console.log("values", values);
      api
        .post("/Account/CheckLogin", values)
        .then((res) => {
          console.log(res);
          localStorage.removeItem("USER_LOGIN");
          localStorage.setItem("USER_LOGIN", JSON.stringify(res.data));

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Log in successfully!",
            showConfirmButton: true,
            timer: 1000,
          }).then(function () {
            if (res.data.role.id == 1 || res.data.role.id == 2) {
              window.location.href = "/dashboard";
            } else {
              window.location.href = "/";
            }
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            position: "center",
            icon: "error",
            title:
              "Log in failed!</br> Your phone number or password is not correct. </br> Please check again",
            showConfirmButton: true,
            timer: 10000,
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
      allowOutsideClick: () => !Swal.isLoading(),
    })
      .then(async (result) => {
        if (result.isDenied === true || result.isDismissed === true) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Reset Password failed!",
            showConfirmButton: true,
            timer: 2500,
          });
        } else if (result.isConfirmed === true) {
          if (result.value.trim().length < 6) {
            await Swal.fire({
              position: "center",
              icon: "error",
              title:
                "Your password must be at least 6 chacracters. </br> Please enter again!",
              showConfirmButton: true,
              timer: 2500,
              preConfirm: (login) => {
                // console.log(login);
              },
            });
            setTimeout(handleChangePassword(accountID), 2800);
          } else {
            api
              .put(`/Account/UpdateAccount?id=${accountID}`, {
                password: result.value.trim(),
              })
              .then((res) => {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Reset Password successfully!",
                  showConfirmButton: true,
                  timer: 2500,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleResetPassword = (validationCode, email, accountID) => {
    Swal.fire({
      title: `Verify your Email`,
      html: `We send a code to your Email: ${email}. <br/>
  Please check and enter this code here. <br/> This will close in <b></b> seconds.`,
      input: "text",
      timer: 180000,
      timerProgressBar: true,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      didOpen: () => {
        const b = Swal.getHtmlContainer().querySelector("b");
        let timerInterval = setInterval(() => {
          b.textContent = Math.floor(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      preConfirm: (login) => {
        // console.log(login);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })
      .then((result) => {
        if (result.isDenied === true || result.isDismissed === true) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Reset Password failed! </br> Please try again",
            showConfirmButton: true,
            timer: 2500,
          });
        } else if (result.isConfirmed === true) {
          if (result.value === validationCode) {
            handleChangePassword(accountID);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Wrong verify code! </br> Please try again",
              showConfirmButton: true,
              timer: 2500,
            });
          }
        }
      })
      .catch((err) => { });
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
      allowOutsideClick: () => !Swal.isLoading(),
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
            .catch((err) => { });
          if (checkEmail) {
            api
              .post(`/Account/CreateValidationCode?email=${result.value}`)
              .then((res) => {
                handleResetPassword(
                  res.data.validationCode,
                  result.value,
                  res.data.accountID
                );
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title:
                "This Email has not been registered! </br> Please try again",
              showConfirmButton: true,
              timer: 10000,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>

      <main>
        <div className="box m-0 mt-5" style={{ height: "90vh" }}>
          <div className="inner-box flex justify-content-center">
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
                    Forget Password?
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
