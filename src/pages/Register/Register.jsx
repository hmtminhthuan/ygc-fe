import React from "react";
import axios from "axios";
import "./Register.scss";
import Swal from "sweetalert2";
import video from "../../assets/video.mp4";
import { Form, Input, Select } from "antd";
import { Await, Link } from "react-router-dom";
import { useFormik } from "formik";
import HeaderHome from "../../component/HeaderHome/HeaderHome";

export default function Register() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const [form] = Form.useForm();
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
    },

    onSubmit: async (values) => {
      axios
        .get("http://localhost:5000/Account/SendCodeRegister", {
          params: { email: values.email },
        })
        .then(async (res) => {
          await Swal.fire({
            title: `Verify your Email`,
            html: `We send a code to your Email: ${values.email}. <br/>
          Please check and enter this code here. <br/> This will close in <b></b> seconds.`,
            input: "text",
            timer: 180000,
            timerProgressBar: true,
            inputAttributes: {
              autocapitalize: "off",
            },
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Look up",
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
          }).then((result) => {
            console.log(result);
            if (result.isDenied === true || result.isDismissed === true) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Register failed! </br> Please try again",
                showConfirmButton: true,
                timer: 2500,
              });
            } else if (result.isConfirmed === true) {
              if (result.value === res.data) {

                console.log("values", values);
                axios.post("http://localhost:5000/Account/TraineeRegister", values)
                  .then((res) => {
                    console.log(res);
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: "Register successfully!",
                      showConfirmButton: true,
                      timer: 2500,
                    });
                  })
                  .catch((err) => {
                    Swal.fire({
                      position: "center",
                      icon: "error",
                      title: "This Email or Phone number has been registered! </br> Please try again",
                      showConfirmButton: true,
                      timer: 10000,
                    });
                  });

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
          });
        })
        .catch((err) => {
          console.log(err);
        });

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
        <div className="box m-0 mt-5" style={{ height: "90vh" }}>
          <div className="inner-box flex align-items-center">
            <div className="container flex justify-content-center align-items-center">
              <div className="form-container flex justify-content-center">
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
                      name="email"
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
              <div className="videoDiv">
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
    </div>
  );
}
