import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Form, Input, Button } from "antd";
import { useFormik } from "formik";
import { api } from "../../../constants/api";
import moment from "moment";
import "./UpdateBlog.scss";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import { alert } from "../../../component/AlertComponent/Alert";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../../constants/firebase";
import { v4 } from "uuid";

export default function UpdateBlog() {
  const navigate = useNavigate();
  const [previewImg, setPreviewImg] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [currentImg, setCurrentImg] = useState("");
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };

  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => {
    api
      .get("/Blog/GetBlogById", {
        params: { id: id },
      })
      .then((res) => {
        const blogDetail = res.data;
        setBlog(blogDetail);

        setHeader(res.data.header);
        setContent(res.data.content);
        setImg(res.data.img);
        formik.setValues({
          date: blogDetail.date,
          header: blogDetail.header,
          content: blogDetail.content,
          img: blogDetail.img,
        });

        setHeader(res.data.header);
        setContent(res.data.content);
        setImg(res.data.img);
        setPreviewImg(res.data.img);
        setCurrentImg(res.data.img);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const formik = useFormik({
    initialValues: {
      header: "",
      content: "",
      img: "",
    },
    onSubmit: (values) => {
      if (previewImg == currentImg) {
        values.img = currentImg;
        api
          .put(`/Blog/UpdateBlog?id=${blog.id}`, values)
          .then((res) => {
            alert.alertSuccessWithTime(
              "Update Blog Successfully",
              "",
              2000,
              "30",
              () => {
                navigate("/staff/blogManagement");
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const imageRef = ref(
          storage,
          `blogImages/${"--blogImage--" + id + "--" + imageUpload.name + v4()}`
        );
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              values.img = url;
            })
            .finally(() => {
              api
                .put(`/Blog/UpdateBlog?id=${blog.id}`, values)
                .then((res) => {
                  alert.alertSuccessWithTime(
                    "Update Blog Successfully",
                    "",
                    2000,
                    "30",
                    () => {
                      navigate("/staff/blogManagement");
                    }
                  );
                })
                .catch((err) => {
                  console.log(err);
                });
            });
        });
      }
    },
  });

  if (!blog) {
    return null;
  }

  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuStaff />
        <div className="main--content staff-course-view ">
          <div className="updateblog ">
            <div
              className="containerud m-0 p-0"
              style={{ height: "fit-content" }}
            >
              <h1 className="text-center">Update Blog</h1>
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
                                  initialValue={blog.header}
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
                                  initialValue={blog.content}
                                  hasFeedback
                                >
                                  <Input.TextArea
                                    style={{ width: "100%" }}
                                    name="content"
                                    value={formik.values.content}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Content"
                                    rows={10}
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
                                <div
                                  className="text-center m-0 p-0 flex 
                    justify-content-start"
                                >
                                  <p
                                    className="m-0 p-0 mt-1 px-3 py-1"
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "16px",
                                      fontWeight: "bolder",
                                      width: "fit-content",
                                      borderRadius: "20px",
                                      color: "#fff",
                                      backgroundColor: "#d291bc",
                                    }}
                                    onClick={() => {
                                      document.getElementById("imgInp").click();
                                    }}
                                  >
                                    <i className="fa-solid fa-image mx-3 ms-0"></i>
                                    {imageUpload == null
                                      ? "Choose Photo"
                                      : "Choose Another Photo"}
                                  </p>
                                  <p
                                    className="m-0 p-0 mt-1 px-3 py-1 ms-3"
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "16px",
                                      fontWeight: "bolder",
                                      width: "fit-content",
                                      borderRadius: "20px",
                                      color: "#fff",
                                      backgroundColor: "#000",
                                      display: `${
                                        imageUpload == null ? "none" : ""
                                      }`,
                                    }}
                                    onClick={() => {
                                      setPreviewImg(currentImg);
                                      setImageUpload(null);
                                    }}
                                  >
                                    Reset
                                  </p>
                                </div>
                                <Form.Item
                                  label=""
                                  name="img"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Image cannot be blank",
                                    },
                                  ]}
                                  style={{ display: "none" }}
                                  hasFeedback
                                >
                                  <Input
                                    style={{
                                      width: "100%",
                                      cursor: "pointer",
                                      display: "none",
                                    }}
                                    name="img"
                                    value={formik.values.img}
                                    placeholder="Select Image"
                                    id="imgInp"
                                    type="file"
                                    onChange={(e) => {
                                      if (
                                        e.target.files[0] != null &&
                                        e.target.files[0] != undefined
                                      ) {
                                        setImageUpload(e.target.files[0]);
                                        const [file] = imgInp.files;
                                        if (
                                          e.target.files &&
                                          e.target.files[0]
                                        ) {
                                          const link =
                                            URL.createObjectURL(file);
                                          setPreviewImg(link);
                                          formik.setFieldValue("img", link);
                                        }
                                      }
                                    }}
                                  />
                                </Form.Item>
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
                                  className=" ps-0 ms-0 mt-3"
                                  src={previewImg}
                                  style={{
                                    width: "100%",
                                    borderRadius: "5px",
                                    transform: "translateX(-20px)",
                                  }}
                                />
                              </Form.Item>
                            )}
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
                          <NavLink
                            to={"/staff/blogManagement"}
                            className="cancel-update-profile-button bg-dark h-100 w-100 flex align-items-center justify-content-center text-decoration-none text-light"
                            style={{ borderRadius: "10px" }}
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
