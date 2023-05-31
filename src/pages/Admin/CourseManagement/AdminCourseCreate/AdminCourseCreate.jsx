import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../../component/Admin/MenuAdmin/MenuAdmin";
import Swal from "sweetalert2";
import { Form, Input, InputNumber, Select } from "antd";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { api } from "../../../../constants/api";
import TextArea from "antd/es/input/TextArea";

export default function AdminCourseCreate() {
    const [previewImg, setPreviewImg] = useState();
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
            courseName: "",
            price: 0,
            discount: 0,
            levelId: 0,
            description: "string",
            img: "",
            deleted: false,
        },

        onSubmit: (values) => {
            console.log(values);
        },
    });
    const handleChangeLevel = (levelId) => {
        formik.setFieldValue("levelId", levelId);
    };
    useEffect(() => {
        api
            .get("Level/GetAllLevel")
            .then((res) => setLevelList(res.data))
            .catch((err) => console.log(err));
    }, []);
    return (
        <>
            <HeaderAdmin />
            <section className="main" id="admin-course-management-area">
                <MenuAdmin />
                <div
                    className="main--content pt-3"
                    id="admin-course-management-create-course"
                >
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <Link to={"/admin/courseManagement"} className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                                style={{ "fontSize": "18px", "fontWeight": "500" }}>
                                <i className="fa-solid fa-arrow-left"></i>
                                <span className="mx-2">Back</span>
                            </Link>
                        </div>{" "}
                    </div>
                    <div className="title flex justify-content-center m-0 p-0 mt-2">
                        <h1 className="m-0 p-0 text-primary">Create New Course</h1>
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
                            >
                                <Input
                                    style={{ width: "100%" }}
                                    name="price"
                                    type="number"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Price"
                                />
                            </Form.Item>
                            <Form.Item
                                name="discount"
                                label="Discount"
                                rules={[
                                    {
                                        required: true,
                                        message: "Discount is not in correct form",
                                    },
                                    {
                                        pattern: /^[1-9]?[0-9]{1}$|^100$/,
                                        message: "Discount must be from 0-100",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input
                                    style={{ width: "100%" }}
                                    name="discount"
                                    type="number"
                                    value={formik.values.discount}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Discount"
                                />
                            </Form.Item>

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

                            <Form.Item name="img" label="Image" rules={[]} hasFeedback>
                                <Input
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
                                />
                            </Form.Item>
                            {previewImg == '' ? <></> : <Form.Item label="Preview Image">
                                <img id="blah" src={previewImg}
                                    style={{ width: "40%", borderRadius: "5px" }} />
                            </Form.Item>}

                            <button
                                className="bg-green-500 text-gray-100 text-xl p-2 w-96 rounded-full tracking-wide
                          font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-green-600
                          shadow-lg mt-3"
                                type="submit"
                            >
                                Create
                            </button>
                        </Form>
                    </div>
                </div>
            </section>
        </>
    );
}
