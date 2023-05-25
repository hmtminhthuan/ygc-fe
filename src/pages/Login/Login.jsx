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
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Log in successfully!",
            showConfirmButton: true,
            timer: 1000,
          }).then(function () {
            window.location.href = "/";
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Log in failed!</br> Your phone number or password is not correct. </br> Please check again",
            showConfirmButton: true,
            timer: 10000,
          });
        });
    },
  });

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
                        message: "Phone Number is not in correct form",
                        pattern: /(0|[1-9][0-9]*)$/,
                      },
                      { min: 10, message: "Phone Number must be 10 numbers" },
                      {
                        max: 10,
                        message: "Your Phone Number is over 10 numbers",
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
                      { min: 6, message: "Password must be at least 6 characters" },
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
                    to={"/"}
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
    </div>
  );
}
