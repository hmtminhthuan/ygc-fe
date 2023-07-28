import React from "react";
import { api } from "../../../constants/api";
import { useFormik } from "formik";
import { Form, Input, Select, Button } from "antd";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import "./CreateTrainer.scss";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import TextArea from "antd/es/input/TextArea";
import { alert } from "../../../component/AlertComponent/Alert";

export default function CreateTrainer() {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };

  const formik = useFormik({
    initialValues: {
      roleId: 3,
      firstname: "",
      lastname: "",
      gender: true,
      phoneNumber: "",
      email: "",
      address: "",
      password: "",
      deleted: false,
      img: "",
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      if (values.gender === true) {
        values.img =
          "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--male.jpg?alt=media&token=b62e9e4f-0e8e-43f9-ae9d-fba29d67d112";
      } else {
        values.img =
          "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--female.jpg?alt=media&token=f58778d6-9193-453b-93e4-ddbab5db5e37";
      }
      formik.setFieldValue("firstname", "");
      api
        .post("/Account/CreateAccount", values)
        .then((res) => {
          form.resetFields();
          alert.alertSuccessWithTime(
            "Create Trainer Successfully",
            "",
            2000,
            "25",
            () => {}
          );
        })
        .catch((err) => {
          alert.alertFailedWithTime(
            "Failed To Create",
            "",
            2000,
            "25",
            () => {}
          );
        });
    },
  });

  const handleChangeGender = (value) => {
    formik.setFieldValue("gender", value);
  };

  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuStaff />
        <div className="main--content staff-course-view ">
          <div className="create-trainer">
            <div
              className="containerud m-0 p-0"
              style={{ height: "80vh", overflowY: "none" }}
            >
              <div className="bg-white shadow rounded-lg d-sm-flex">
                <div className="tab-content px-2 p-0 py-3 pt-2 mt-2">
                  <h2
                    className="py-2 pt-0 text-center"
                    style={{ color: "#e049c0" }}
                  >
                    Create Trainer's Account
                  </h2>
                  <div className="tab-pane fade show active">
                    <Form
                      {...formItemLayout}
                      form={form}
                      onFinish={formik.handleSubmit}
                      size="large"
                      autoComplete="off"
                    >
                      <div className="row mx-4">
                        <div className="col-md-12">
                          <div className="form-group m-0">
                            <div className="row flex align-items-start justify-content-between">
                              <p className="col-4 p-0 m-0 px-3 mt-2 flex">
                                <span className="text-danger px-1">
                                  <i
                                    className="fa-solid fa-star-of-life"
                                    style={{
                                      fontSize: "6px",
                                      verticalAlign: "middle",
                                    }}
                                  ></i>{" "}
                                </span>
                                Firstname:
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="firstname"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Firstname cannot be blank",
                                    },
                                    { whitespace: true },
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
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group m-0">
                            <div className="row flex align-items-start justify-content-between">
                              <p className="col-4 p-0 m-0 px-3 mt-2 flex">
                                <span className="text-danger px-1">
                                  <i
                                    className="fa-solid fa-star-of-life"
                                    style={{
                                      fontSize: "6px",
                                      verticalAlign: "middle",
                                    }}
                                  ></i>{" "}
                                </span>
                                Lastname:
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="lastname"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Lastname cannot be blank",
                                    },
                                    { whitespace: true },
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
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group m-0">
                            <div className="row flex align-items-start justify-content-between">
                              <p className="col-4 p-0 m-0 px-3 mt-2 flex">
                                <span className="text-danger px-1">
                                  <i
                                    className="fa-solid fa-star-of-life"
                                    style={{
                                      fontSize: "6px",
                                      verticalAlign: "middle",
                                    }}
                                  ></i>{" "}
                                </span>
                                Gender:
                              </p>
                              <div className="col-8">
                                <Form.Item
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
                                    <Select.Option value={true}>
                                      Male
                                    </Select.Option>
                                    <Select.Option value={false}>
                                      Female
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group m-0">
                            <div className="row flex align-items-start justify-content-between">
                              <p className="col-4 p-0 m-0 px-3 mt-2 flex">
                                <span className="text-danger px-1">
                                  <i
                                    className="fa-solid fa-star-of-life"
                                    style={{
                                      fontSize: "6px",
                                      verticalAlign: "middle",
                                    }}
                                  ></i>{" "}
                                </span>
                                <span> Phone Number:</span>
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="phoneNumber"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Phone Number cannot be blank",
                                    },
                                    {
                                      message: "Phone is not in correct form",
                                      pattern: /(0|[1-9][0-9]*)$/,
                                    },
                                    {
                                      min: 10,
                                      message: "Phone must be 10-11 numbers",
                                    },
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
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group m-0">
                            <div className="row flex align-items-start justify-content-between">
                              <p className="col-4 p-0 m-0 px-3 mt-2 flex">
                                <span className="text-danger px-1">
                                  <i
                                    className="fa-solid fa-star-of-life"
                                    style={{
                                      fontSize: "6px",
                                      verticalAlign: "middle",
                                    }}
                                  ></i>{" "}
                                </span>
                                <span> Email:</span>
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="email"
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
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group m-0">
                            <div className="row flex align-items-start justify-content-between">
                              <p className="col-4 p-0 m-0 px-3 mt-2 flex">
                                <span className="text-danger px-1">
                                  <i
                                    className="fa-solid fa-star-of-life"
                                    style={{
                                      fontSize: "6px",
                                      verticalAlign: "middle",
                                    }}
                                  ></i>{" "}
                                </span>
                                <span> Address:</span>
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="address"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Address cannot be blank",
                                    },
                                    { whitespace: true },
                                  ]}
                                  hasFeedback
                                >
                                  <TextArea
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Address"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group m-0">
                            <div className="row flex align-items-start justify-content-between">
                              <p className="col-4 p-0 m-0 px-3 mt-2 flex">
                                <span className="text-danger px-1">
                                  <i
                                    className="fa-solid fa-star-of-life"
                                    style={{
                                      fontSize: "6px",
                                      verticalAlign: "middle",
                                    }}
                                  ></i>{" "}
                                </span>
                                <span> Password:</span>
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="password"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Password cannot be blank",
                                    },
                                    {
                                      min: 6,
                                      message:
                                        "Password must be at least 6 characters",
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
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group m-0">
                            <div className="row flex align-items-start justify-content-between">
                              <p className="col-4 p-0 m-0 px-3 mt-2 flex">
                                <span className="text-danger px-1">
                                  <i
                                    className="fa-solid fa-star-of-life"
                                    style={{
                                      fontSize: "6px",
                                      verticalAlign: "middle",
                                    }}
                                  ></i>{" "}
                                </span>
                                <span>Confirm Password:</span>
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  name="confirm_password"
                                  label=""
                                  dependencies={["password"]}
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Confirm Password cannot be blank",
                                    },
                                    ({ getFieldValue }) => ({
                                      validator(_, value) {
                                        if (
                                          !value ||
                                          getFieldValue("password") === value
                                        ) {
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
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row flex align-items-stretch">
                        <div className="col-6">
                          <button
                            className="btn p-0 m-0"
                            type="submit"
                            style={{ borderRadius: "8px" }}
                          >
                            Create
                          </button>
                        </div>
                        <div className="col-6">
                          <NavLink
                            to={"/staff/listTrainer"}
                            className="btn btn-primary flex align-items-center
                            text-light bg-black border-0"
                            style={{
                              width: "100%",
                              height: "100%",
                              justifyContent: "center",
                            }}
                          >
                            Cancel
                          </NavLink>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
