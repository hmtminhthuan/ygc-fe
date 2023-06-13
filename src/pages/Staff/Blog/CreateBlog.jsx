import React, { useState } from "react";
import { api } from "../../../constants/api";
import { useFormik } from "formik";
import { Form, Input, Button, DatePicker } from "antd";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import Swal from "sweetalert2";
import "./CreateBlog.scss";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import moment from "moment/moment";
import { alert } from "../../../component/AlertComponent/Alert";

export default function CreateBlog() {
  const [previewImg, setPreviewImg] = useState("");
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };

  const formik = useFormik({
    initialValues: {
      userId: "",
      date: moment(new Date()).format("YYYY-MM-DD"),
      header: "",
      content: "",
      img: "",
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      api
        .post("/Blog/CreateBlog", values)
        .then((res) => {
          //  blog created successfully
          const createdBlog = res.data;
          // Reset the form after successful creation
          resetForm();
          setSubmitting(false);
          alert.alertSuccessWithTime(
            "Create Blog Successfully",
            "",
            2000,
            "30",
            () => {
              window.location.href = "/staff/blogManagement";
            }
          );
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
        });
    },
  });

  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuStaff />
        <div className="main--content staff-course-view ">
          <div className="createblog ">
            <div
              className="containerud m-0 p-0"
              style={{ height: "fit-content" }}
            >
              <h1 className="text-center">Create New Blog</h1>
              <div className="bg-white shadow rounded-lg d-sm-flex">
                <div className="tab-content p-4 p-md-5">
                  <div className="tab-pane fade show active">
                    <Form
                      {...formItemLayout}
                      form={formik.form}
                      onFinish={formik.handleSubmit}
                      size="large"
                      autoComplete="off"
                    >
                      <div className="row mx-4">
                        <div className="col-md-12">
                          <div className="form-group">
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
                                <span>UserId:</span>
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="userId"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Header cannot be blank",
                                    },
                                    { whitespace: true },
                                  ]}
                                  hasFeedback
                                >
                                  <Input
                                    name="userId"
                                    value={formik.values.userId}
                                    onChange={formik.handleChange}
                                    placeholder="Enter UserId"
                                  />
                                </Form.Item>
                              </div>{" "}
                            </div>{" "}
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group">
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
                                <span>Header:</span>
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="header"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Header cannot be blank",
                                    },
                                    { whitespace: true },
                                  ]}
                                  hasFeedback
                                >
                                  <Input
                                    name="header"
                                    value={formik.values.header}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Header"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
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
                                <span>Content:</span>
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="content"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Content cannot be blank",
                                    },
                                    { whitespace: true },
                                  ]}
                                  hasFeedback
                                >
                                  <TextArea
                                    style={{ width: "100%" }}
                                    name="content"
                                    value={formik.values.content}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Content"
                                    rows={5}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group">
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
                                <span>Image:</span>
                              </p>
                              <div className="col-8">
                                <Form.Item
                                  label=""
                                  name="img"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Image cannot be blank",
                                    },
                                  ]}
                                  hasFeedback
                                >
                                  <Input
                                    name="img"
                                    value={formik.values.img}
                                    onChange={formik.handleChange}
                                    onInput={(e) => {
                                      setPreviewImg(e.target.value);
                                    }}
                                    placeholder="Enter Image URL"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                          {previewImg == "" ? (
                            <></>
                          ) : (
                            <Form.Item
                              className="preview-item px-2"
                              label="Preview Image"
                            >
                              <img
                                id="blah"
                                className=""
                                src={previewImg}
                                style={{ width: "100%", borderRadius: "5px" }}
                              />
                            </Form.Item>
                          )}
                        </div>
                      </div>

                      <div className="text-center row">
                        <div className="col-6">
                          <Button type="primary" htmlType="submit">
                            Create
                          </Button>
                        </div>
                        <div className="col-6 flex align-items-center">
                          <Link
                            to={"/staff/blogManagement"}
                            className="cancel-update-profile-button bg-dark h-100 w-100 flex align-items-center justify-content-center
                  text-decoration-none text-light"
                            style={{ borderRadius: "10px" }}
                          >
                            Cancel
                          </Link>
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
