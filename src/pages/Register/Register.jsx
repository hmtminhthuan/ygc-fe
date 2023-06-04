import React from "react";
import axios from "axios";
import "./Register.scss";
import Swal from "sweetalert2";
import video from "../../assets/video.mp4";
import { Form, Input, Select } from "antd";
import { Await, Link } from "react-router-dom";
import { useFormik } from "formik";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import { api } from "../../constants/api";
import FooterHome from "../../component/FooterHome/FooterHome";

export default function Register() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const [form] = Form.useForm();

  const handleRegister = (values) => {
    const roleId = 4;
    values = { ...values, roleId };
    values.img = "female";
    if (values.gender) {
      values.img = "male";
    }
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      html: "Please wait a few seconds",
      timer: 1600,
      timerProgressBar: true,
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
              showConfirmButton: true,
              timer: 2000,
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
      })
      .catch((err) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title:
            "This Email or Phone number has been registered! </br> Please try again",
          showConfirmButton: true,
          timer: 10000,
        });
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
          }).then((result) => {
            if (result.isDenied === true || result.isDismissed === true) {
              handleEnterVerifyCode(values, validationCode, email, timeLeft);
            } else if (result.isConfirmed === true) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Register failed!</br>Please try again",
                showConfirmButton: true,
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
              title: "Wrong verify code! </br> Please enter again",
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

    onSubmit: async (values) => {
      handleVerifyEmail(values);
    },
  });

  const handleChangeGender = (gender) => {
    formik.setFieldValue("gender", gender);
  };

  return (
    <div>
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>
      <main>
        <div
          className="box m-0 mt-5 register-scroll"
          style={{ height: "90vh" }}
        >
          <div className="inner-box inner-register flex align-items-center">
            <div className="container flex justify-content-center align-items-center">
              <div className="form-container form-register-container flex justify-content-center">
                <Form
                  onFinish={formik.handleSubmit}
                  {...formItemLayout}
                  form={form}
                  size="large"
                  autoComplete="off"
                >
                  <Form.Item
                    name="firstname"
                    label="Firstname"
                    rules={[
                      {
                        required: true,
                        message: "Firstname cannot be blank",
                      },
                      { whitespace: true },
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

                  <Form.Item
                    name="lastname"
                    label="Lastname"
                    rules={[
                      {
                        required: true,
                        message: "Lastname cannot be blank",
                      },
                      { whitespace: true },
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
                  </Form.Item>

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
                    name="email"
                    label="Email"
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
                    hasFeedback
                  >
                    <Input
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      placeholder="Enter Email"
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

                  <Form.Item
                    name="confirm_password"
                    label="Confirm Password"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Confirm Password cannot be blank",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "Confirm Password does not match"
                          );
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

                  <Form.Item
                    label="Gender"
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

                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      placeholder="Enter Address (Optional)"
                    />
                  </Form.Item>

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
              <div className="videoDiv d-none d-lg-flex d-md-none d-sm-none">
                <video src={video} autoPlay muted loop></video>

                <div className="textDiv py-2">
                  <h2 className="title">Register</h2>
                  <p className="py-2">
                    YogaCenter - Do Yoga today for a better tomorrow
                  </p>
                </div>

                <div className="footerDiv flex">
                  <span className="text">Already have an account?</span>
                  <Link to={"/login"}>
                    <button className="btn flex">Log In</button>
                  </Link>
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
