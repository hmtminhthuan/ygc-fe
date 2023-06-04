import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Form, Input, Button } from "antd";
import { useFormik } from "formik";
import { api } from "../../../../constants/api";

export default function UpdateBlog() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };

  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    api
      .get("/Blog/GetBlogById", {
        params: { id: id },
      })
      .then((res) => {
        const blogDetail = res.data;
        setBlog(blogDetail);
        formik.setValues({
          date: blogDetail.date,
          header: blogDetail.header,
          content: blogDetail.content,
          img: blogDetail.img,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const formik = useFormik({
    initialValues: {
      date: "",
      header: "",
      content: "",
      img: "",
    },
    onSubmit: (values) => {
      api
        .put(`/Blog/UpdateBlog?id=${blog.id}`, values)
        .then((res) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Update blog successfully!",
            showConfirmButton: true,
            timer: 1000,
          }).then(function () {
            // Redirect to the blog management page after successful update
            window.location.href = "/staff/blogManagement";
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  if (!blog) {
    return null;
  }

  return (
    <div className="updateblog">
      <div className="containerud">
        <h1 className="mt-5 mb-4">Update Blog</h1>
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
                      <Form.Item
                        label="Date"
                        name="date"
                        rules={[
                          {
                            required: true,
                            message: "Date cannot be blank",
                          },
                          {
                            pattern: /^(\d{4})-(\d{2})-(\d{2})$/,
                            message: "Date must be in the format YYYY-MM-DD",
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
                        <Input.TextArea
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
                      Update
                    </Button>
                  </div>
                  <div className="col-6 flex align-items-center">
                    <Link
                      to={"/staff/blogManagement"}
                      className="cancel-update-profile-button bg-dark h-100 w-100 flex align-items-center justify-content-center text-decoration-none text-light"
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
