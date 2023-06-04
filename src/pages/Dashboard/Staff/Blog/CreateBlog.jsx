import React from "react";
import { api } from "../../../../constants/api";
import { useFormik } from "formik";
import { Form, Input, Button, DatePicker } from "antd";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import Swal from "sweetalert2";
import "./CreateBlog.scss";

export default function CreateBlog() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };

  const formik = useFormik({
    initialValues: {
      userId: "",
      date: null,
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
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Create new blog successfully!",
            showConfirmButton: true,
            timer: 3500,
          });
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
        });
    },
  });

  return (
    <div className="createblog">
      <div className="containerud">
        <h1 className="mt-5 mb-4">Create New Blog</h1>
        <div className="bg-white shadow rounded-lg d-sm-flex">
          <div className="tab-content p-4 p-md-5">
            <div className="tab-pane fade show active">
              {/* <h3 className="mb-4">Account Settings</h3> */}
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
                      <Form.Item
                        label="UserId"
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
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <Form.Item
                        label="Date"
                        name="date"
                        rules={[
                          {
                            required: true,
                            message: "Date cannot be blank",
                          },

                          {
                            message: "Date is not in correct form (YYYY-MM-DD)",
                            pattern: /^(\d{4})-(\d{2})-(\d{2})$/,
                          },
                        ]}
                      >
                        <Input
                          name="date"
                          value={formik.values.date}
                          onChange={formik.handleChange}
                          placeholder="Enter Date (YYYY-MM-DD)"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <Form.Item
                        label="Header"
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
                  <div className="col-md-12">
                    <div className="form-group">
                      <Form.Item
                        label="Content"
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
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <Form.Item
                        label="Image"
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
                          placeholder="Enter Image URL"
                        />
                      </Form.Item>
                    </div>
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
  );
}
