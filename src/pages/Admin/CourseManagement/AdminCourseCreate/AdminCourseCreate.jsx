import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../../component/Admin/MenuAdmin/MenuAdmin";
import Swal from "sweetalert2";
import { Form, Input, InputNumber, Select } from "antd";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import { api } from "../../../../constants/api";
import TextArea from "antd/es/input/TextArea";
import { alert } from "../../../../component/AlertComponent/Alert";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../constants/firebase";
import { v4 } from "uuid";
import "./CreateCourse.scss";

export default function AdminCourseCreate() {
  const [previewImg, setPreviewImg] = useState("");
  const [previewPrice, setPreviewPrice] = useState(-1);
  const [previewDiscount, setPreviewDiscount] = useState(-1);
  const [levelList, setLevelList] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      // style: "currency",
      currency: "VND",
    }).format(price);
  };
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 4 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const [form] = Form.useForm();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      courseName: "",
      price: 0,
      discount: 0,
      levelId: 0,
      description: "",
      img: "",
      deleted: false,
    },

    onSubmit: (values) => {
      if (previewImg == "") {
        alert.alertFailedWithTime(
          "Failed To Create",
          "Image cannot be blank",
          2500,
          "25",
          () => {}
        );
      } else {
        if (values.discount == "") {
          values.discount = 0;
        }
        Swal.fire({
          title: `Are you sure to create new course?`,
          inputAttributes: {
            autocapitalize: "off",
          },
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          preConfirm: (login) => {},
          allowOutsideClick: true,
        }).then((result) => {
          if (result.isDenied === true || result.isDismissed === true) {
          } else if (result.isConfirmed === true) {
            const imageRef = ref(
              storage,
              `courseImages/${imageUpload.name + v4()}`
            );
            uploadBytes(imageRef, imageUpload).then((snapshot) => {
              getDownloadURL(snapshot.ref)
                .then((url) => {
                  values.img = url;
                })
                .finally(() => {
                  api
                    .post("Course/CreateCourse", values)
                    .then((res) => {
                      alert.alertSuccessWithTime(
                        "Create Course Successfully",
                        "",
                        2000,
                        "25",
                        () => {}
                      );
                    })
                    .catch((err) => {});
                });
            });
          }
        });
      }
    },
  });
  const handleChangeLevel = (levelId) => {
    formik.setFieldValue("levelId", levelId);
  };
  useEffect(() => {
    api
      .get("Level/GetAllLevel")
      .then((res) => setLevelList(res.data))
      .catch((err) => {});
  }, []);
  return (
    <>
      <HeaderAdmin />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        <div
          className="main--content "
          id="admin-course-management-create-course"
        >
          <div className="createcourse mb-4">
            <div
              className="containerud m-0 p-0"
              style={{ height: "fit-content" }}
            >
              <div className="col-12 mt-4 mb-0">
                <NavLink
                  to={"/admin/courseManagement"}
                  className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                  style={{ fontSize: "18px", fontWeight: "500" }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span className="mx-2">Back</span>
                </NavLink>
              </div>
              <h1 className="text-center">Create New Course</h1>

              <div className="row create-course-content mt-4">
                <Form
                  onFinish={formik.handleSubmit}
                  {...formItemLayout}
                  form={form}
                  size="large"
                  autoComplete="off"
                >
                  <div className="row flex align-items-start justify-content-between">
                    <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                      <span className="text-danger px-1">
                        <i
                          className="fa-solid fa-star-of-life"
                          style={{
                            fontSize: "6px",
                            verticalAlign: "middle",
                          }}
                        ></i>{" "}
                      </span>
                      Course Name:
                    </p>
                    <div className="col-10">
                      <Form.Item
                        name="courseName"
                        label={``}
                        rules={[
                          {
                            required: true,
                            message: "Course Name cannot be blank",
                          },
                          {
                            max: 50,
                            message:
                              "Course Name must not be over 50 characters",
                          },
                          {
                            whitespace: true,
                            message: "Course Name cannot be empty",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          style={{ width: "100%" }}
                          name="courseName"
                          value={formik.values.courseName}
                          onChange={formik.handleChange}
                          placeholder="Enter Course Name"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row flex align-items-start justify-content-between">
                    <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                      <span className="text-danger px-1">
                        <i
                          className="fa-solid fa-star-of-life"
                          style={{
                            fontSize: "6px",
                            verticalAlign: "middle",
                          }}
                        ></i>{" "}
                      </span>
                      Level:
                    </p>
                    <div className="col-10">
                      <Form.Item
                        label=""
                        name="levelId"
                        rules={[
                          {
                            required: true,
                            message: "Level must be selected",
                          },
                        ]}
                        hasFeedback
                      >
                        <Select
                          name="levelId"
                          width="200px"
                          placeholder="Select Level"
                          value={formik.values.levelId}
                          onChange={handleChangeLevel}
                        >
                          {levelList.map(({ levelId, levelName }, index) => {
                            return (
                              <Select.Option key={index} value={levelId}>
                                {levelName}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row flex align-items-start justify-content-between">
                    <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                      <span className="text-danger px-1">
                        <i
                          className="fa-solid fa-star-of-life"
                          style={{
                            fontSize: "6px",
                            verticalAlign: "middle",
                          }}
                        ></i>{" "}
                      </span>
                      {"Price (VND):"}
                    </p>
                    <div className="col-10">
                      <Form.Item
                        name="price"
                        // label="Price"
                        rules={[
                          {
                            required: true,
                            message: "Price is not in correct form",
                          },
                          {
                            pattern:
                              /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/,
                            message: "Price must be a positive number",
                          },
                          {
                            whitespace: true,
                            message: "Price cannot be empty",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          style={{ width: "100%" }}
                          name="price"
                          type="number"
                          value={formik.values.price}
                          onChange={formik.handleChange}
                          onInput={(e) => {
                            setPreviewPrice(e.target.value);
                          }}
                          placeholder="Enter Price"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row flex align-items-start">
                    <p className="col-2 p-0 m-0 px-3 pt-2">{"Discount (%):"}</p>
                    <div className="col-10">
                      <Form.Item
                        name="discount"
                        label=""
                        rules={[
                          {
                            pattern: /^[1-9]?[0-9]{1}$|^100$/,
                            message: "Discount must be between 0 and 100",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          style={{ width: "100%" }}
                          name="discount"
                          // type="number"
                          value={formik.values.discount}
                          onChange={formik.handleChange}
                          onInput={(e) => {
                            if (e.target.value == "") {
                              setPreviewDiscount(0);
                            } else {
                              setPreviewDiscount(e.target.value);
                            }
                          }}
                          placeholder="Enter Discount (Default: 0%)"
                        />
                      </Form.Item>{" "}
                    </div>
                  </div>

                  {previewPrice > 0 && previewDiscount <= 0 ? (
                    <Form.Item
                      className="preview-item ps-1"
                      label="Preview Price"
                    >
                      <p className="p-0 m-0 preview-item-content text-primary">
                        {formatPrice(previewPrice)}
                        {" VND "}
                      </p>
                    </Form.Item>
                  ) : (
                    <></>
                  )}
                  {previewPrice > 0 &&
                  previewDiscount > 0 &&
                  previewDiscount <= 100 ? (
                    <Form.Item
                      className="preview-item ps-1"
                      label="Preview Price"
                    >
                      <p className="p-0 m-0 preview-item-content text-primary">
                        <span className="">
                          {formatPrice(previewPrice)}
                          {" VND "}
                        </span>
                        <span className="ps-1">
                          (Discount: {previewDiscount}%)
                        </span>
                        <span className="text-danger">
                          <i className="fa-solid fa-arrow-right px-2" />{" "}
                          <span>
                            {formatPrice(
                              previewPrice * (1 - previewDiscount / 100)
                            )}
                            {" VND "}
                          </span>
                        </span>
                      </p>
                    </Form.Item>
                  ) : (
                    <></>
                  )}

                  <div className="row flex align-items-start justify-content-between">
                    <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                      <span className="text-danger px-1">
                        <i
                          className="fa-solid fa-star-of-life"
                          style={{
                            fontSize: "6px",
                            verticalAlign: "middle",
                          }}
                        ></i>{" "}
                      </span>
                      Description:
                    </p>
                    <div className="col-10">
                      <Form.Item
                        name="description"
                        label=""
                        rules={[
                          {
                            required: true,
                            message: "Description cannot be blank",
                          },
                          {
                            min: 0,
                            max: 1000,
                            message:
                              "Description must be from 0-1000 characters",
                          },
                          {
                            whitespace: true,
                            message: "Description cannot be empty",
                          },
                        ]}
                        hasFeedback
                      >
                        <TextArea
                          style={{
                            width: "100%",
                            height: "150px",
                            verticalAlign: "top",
                          }}
                          name="description"
                          className="create-course-level"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          placeholder="Enter Description"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="hide-form-item row flex align-items-start justify-content-between">
                    <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                      <span className="text-danger px-1">
                        <i
                          className="fa-solid fa-star-of-life"
                          style={{
                            fontSize: "6px",
                            verticalAlign: "middle",
                          }}
                        ></i>{" "}
                      </span>
                      Image:
                    </p>
                    <div className="col-10">
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
                          {previewImg == ""
                            ? "Choose Photo"
                            : "Choose Another Photo"}
                        </p>
                      </div>
                      <Form.Item
                        name="img"
                        label=""
                        rules={
                          [
                            // {
                            //   required: true,
                            //   message: "Image cannot be blank",
                            // },
                            // {
                            //   whitespace: true,
                            //   message: "Image cannot be empty",
                            // },
                          ]
                        }
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
                              if (e.target.files && e.target.files[0]) {
                                const link = URL.createObjectURL(file);
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
                      className="preview-item px-1"
                      label="Preview Image"
                    >
                      <img
                        className="mt-3"
                        id="avatarImg"
                        src={previewImg}
                        style={{ width: "50%", borderRadius: "5px" }}
                      />
                    </Form.Item>
                  )}

                  <div className="row">
                    <div className="col-6">
                      <button
                        className="bg-green-500 text-gray-100 text-xl p-2 w-96 rounded-full tracking-wide
                          font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-green-600
                          shadow-lg mt-3 text-dark"
                        type="submit"
                        style={{
                          backgroundColor: "#d08fba",
                          fontWeight: "bolder",
                        }}
                      >
                        Create
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="bg-green-500 text-gray-100 text-xl p-2 w-96 rounded-full tracking-wide
                          font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-green-600
                          shadow-lg mt-3 bg-black text-light"
                        type="reset"
                        onClick={() => {
                          setPreviewImg("");
                          setPreviewDiscount(-1);
                          setPreviewPrice(-1);
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
