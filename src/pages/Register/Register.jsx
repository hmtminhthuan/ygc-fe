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
import TextArea from "antd/es/input/TextArea";
import { alert } from "../../component/AlertComponent/Alert";

export default function Register() {
  localStorage.setItem("MENU_ACTIVE", "home-register");
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
              showConfirmButton: false,
              timer: 2000,
            }).then(function () {
              if (userList[pos].role.id == 1) {
                window.location.href = "/admin";
              } else if (userList[pos].role.id == 2) {
                window.location.href = "/staff";
              } else if (userList[pos].role.id == 3) {
                window.location.href = "/";
              } else if (userList[pos].role.id == 4) {
                window.location.href = "/";
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
      title: "Loading...",
      html: "Please wait a few seconds",
      timer: 1800,
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
                        // {
                        //   required: true,
                        //   message: "Phone Number cannot be blank",
                        // },
                        // {
                        //   message: "Phone is not in correct form",
                        //   pattern: /^[^ ](0|[1-9][0-9]*)[^ ]$/,
                        // },
                        // { min: 10, message: "Phone must be 10-11 numbers" },
                        // {
                        //   max: 11,
                        //   message: "Phone must be 10-11 numbers",
                        // },
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
                      hasFeedback
                    >
                      <Input
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        placeholder="Enter Email"
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
