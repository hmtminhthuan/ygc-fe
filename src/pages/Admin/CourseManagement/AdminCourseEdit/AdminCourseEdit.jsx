import React, { useEffect, useRef, useState } from "react";
import HeaderAdmin from "../../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../../component/Admin/MenuAdmin/MenuAdmin";
import Swal from "sweetalert2";
import { Form, Input, InputNumber, Select } from "antd";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { api } from "../../../../constants/api";
import TextArea from "antd/es/input/TextArea";

export default function AdminCourseEdit() {
  const param = useParams();
  const [editedCourse, setEditedCourse] = useState({});
  const [previewImg, setPreviewImg] = useState("");
  const [previewPrice, setPreviewPrice] = useState(-1);
  const [previewDiscount, setPreviewDiscount] = useState(-1);
  const [levelList, setLevelList] = useState([]);
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const [form] = Form.useForm();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: parseInt(param.id),
      courseName: editedCourse.courseName,
      price: editedCourse.price,
      discount: editedCourse.discount,
      levelId: editedCourse.levelId,
      description: editedCourse.description,
      img: editedCourse.courseImg,
      deleted: editedCourse.deleted,
    },

    onSubmit: (values) => {
      if (values.discount == "") {
        values.discount = 0;
      }
      Swal.fire({
        title: `Are you sure to save all changes?`,
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        preConfirm: (login) => {
          // console.log(login);
        },
        allowOutsideClick: true,
      }).then((result) => {
        if (result.isDenied === true || result.isDismissed === true) {
        } else if (result.isConfirmed === true) {
          api
            .put(
              `/Course/UpdateCourse?Courseid=${editedCourse.courseID}`,
              values
            )
            .then((res) => {
              console.log("res", res);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Edit course successfully!",
                showConfirmButton: true,
                timer: 1000,
              }).then(function () {
                window.location.href = "/admin/courseManagement";
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
  });
  const handleChangeLevel = (levelId) => {
    formik.setFieldValue("levelId", levelId);
  };
  useEffect(() => {
    api
      .get(
        `http://monne0312-001-site1.etempurl.com/Course/GetCourseByID?id=${param.id}`
      )
      .then((res) => {
        setEditedCourse(res.data);
        setPreviewImg(res.data.courseImg);
        setPreviewPrice(res.data.price);
        setPreviewDiscount(res.data.discount);
      })
      .catch((err) => {
        console.log(err);
      });

    api
      .get("Level/GetAllLevel")
      .then((res) => {
        setLevelList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmitForm = (values) => {
    console.log(values);
  };
  return (
    <>
      <HeaderAdmin />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        {editedCourse.courseID != null &&
        editedCourse.courseID != undefined &&
        levelList != null &&
        levelList.length > 0 ? (
          <div
            className="main--content pt-3 px-5"
            id="admin-course-management-create-course"
          >
            <div className="row justify-content-center">
              <div className="col-12">
                <Link
                  to={"/admin/courseManagement"}
                  className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                  style={{ fontSize: "18px", fontWeight: "500" }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span className="mx-2">Back</span>
                </Link>
              </div>{" "}
            </div>
            <div className="title flex justify-content-center m-0 p-0 mt-2">
              <h1 className="m-0 p-0 text-info">Edit Course</h1>
            </div>
            <div className="row create-course-content mt-4">
              <Form
                onFinish={formik.handleSubmit}
                {...formItemLayout}
                form={form}
                size="large"
                autoComplete="off"
              >
                <Form.Item
                  name="courseName"
                  label="Course Name"
                  rules={[
                    {
                      required: true,
                      message: "Course Name cannot be blank",
                    },
                    {
                      max: 50,
                      message: "Course Name must not be over 50 characters",
                    },
                  ]}
                  hasFeedback
                  initialValue={editedCourse.courseName}
                >
                  <Input
                    style={{ width: "100%" }}
                    name="courseName"
                    value={formik.values.courseName}
                    onChange={formik.handleChange}
                    placeholder="Enter Course Name"
                  />
                </Form.Item>

                <Form.Item
                  name="price"
                  label="Price"
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
                  ]}
                  hasFeedback
                  initialValue={editedCourse.price}
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
                <Form.Item
                  name="discount"
                  label="Discount"
                  rules={[
                    // {
                    //     required: true,
                    //     message: "Discount is not in correct form",
                    // },
                    {
                      pattern: /^[1-9]?[0-9]{1}$|^100$/,
                      message: "Discount must be from 0-100",
                    },
                  ]}
                  hasFeedback
                  initialValue={editedCourse.discount}
                >
                  <Input
                    style={{ width: "100%" }}
                    name="discount"
                    type="number"
                    value={formik.values.discount}
                    onChange={formik.handleChange}
                    onInput={(e) => {
                      if (e.target.value == "") {
                        setPreviewDiscount(0);
                      } else {
                        setPreviewDiscount(e.target.value);
                      }
                    }}
                    placeholder="Enter Discount (optional)"
                  />
                </Form.Item>
                {previewPrice > 0 && previewDiscount <= 0 ? (
                  <Form.Item className="preview-item" label="Preview Price">
                    <p className="p-0 m-0 preview-item-content">
                      {formatPrice(previewPrice)}
                    </p>
                  </Form.Item>
                ) : (
                  <></>
                )}
                {previewPrice > 0 &&
                previewDiscount > 0 &&
                previewDiscount <= 100 ? (
                  <Form.Item className="preview-item" label="Preview Price">
                    <p className="p-0 m-0 preview-item-content">
                      {formatPrice(previewPrice)}{" "}
                      <span className="text-danger">
                        <i className="fa-solid fa-arrow-right px-2" />{" "}
                        {formatPrice(
                          previewPrice * (1 - previewDiscount / 100)
                        )}
                        <span className="px-2">
                          (Discount: {previewDiscount}%)
                        </span>
                      </span>
                    </p>
                  </Form.Item>
                ) : (
                  <></>
                )}
                <Form.Item
                  label="Level"
                  name="levelId"
                  rules={[
                    {
                      required: true,
                      message: "Level must be selected",
                    },
                  ]}
                  hasFeedback
                  initialValue={editedCourse.levelId}
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

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Description cannot be blank",
                    },
                    {
                      min: 0,
                      max: 1000,
                      message: "Description must be from 0-1000 characters",
                    },
                  ]}
                  hasFeedback
                  initialValue={editedCourse.description}
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

                <Form.Item
                  name="img"
                  label="Image"
                  rules={[]}
                  hasFeedback
                  initialValue={editedCourse.courseImg}
                >
                  {/* <Input
                                    style={{ width: "100%" }}
                                    name="img"
                                    value={formik.values.img}
                                    onChange={formik.handleChange}
                                    onInput={(e) => {
                                        console.log(e.target.files[0]);
                                        const [file] = imgInp.files
                                        if (e.target.files && e.target.files[0]) {
                                            blah.src = URL.createObjectURL(file);
                                            console.log(blah.src);
                                        }
                                    }}
                                    placeholder="Select Image"
                                    id="imgInp"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                /> */}
                  <Input
                    style={{ width: "100%" }}
                    name="img"
                    value={formik.values.img}
                    onChange={formik.handleChange}
                    onInput={(e) => {
                      setPreviewImg(e.target.value);
                    }}
                    placeholder="Enter Link Of Image (optional)"
                  />
                </Form.Item>
                {previewImg == "" ? (
                  <></>
                ) : (
                  <Form.Item className="preview-item" label="Preview Image">
                    <img
                      id="blah"
                      src={previewImg}
                      style={{ width: "50%", borderRadius: "5px" }}
                    />
                  </Form.Item>
                )}
                <button
                  className="bg-green-500 text-gray-100 text-xl p-2 w-96 rounded-full tracking-wide
                          font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-green-600
                          shadow-lg mt-3 bg-primary text-light"
                  type="submit"
                >
                  Save
                </button>
              </Form>
            </div>
          </div>
        ) : (
          <></>
        )}
      </section>
    </>
  );
}
