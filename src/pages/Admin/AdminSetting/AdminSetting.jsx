import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../constants/api";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import { Formik, useFormik } from "formik";
import { Form, Input, Button, InputNumber } from "antd";
import "./AdminSetting.scss";

export default function AdminSetting() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };

  const { id } = useParams();
  const [menuSetting, setMenuSetting] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [activeValue, setActiveValue] = useState("");
  const [activeDate, setActiveDate] = useState("");
  const [preactiveValue, setPreactiveValue] = useState("");

  const formik = useFormik({
    initialValues: {
      activeValue: initialValues.activeValue || "",
      activeDate: initialValues.activeDate || "",
      preactiveValue: initialValues.preactiveValue || "",
    },
  });

  useEffect(() => {
    api
      .get("/api/AdminRepositoryAPI/GetSettingList")
      .then((res) => {
        setMenuSetting(res.data);
      })
      .catch((err) => {});

    api
      .get(`/api/AdminRepositoryAPI/GetSettingById?id=${id}`)
      .then((res) => {
        const settingDetail = res.data;
        setInitialValues(settingDetail);

        setActiveValue(settingDetail.activeValue);
        setActiveDate(settingDetail.activeDate);
        setPreactiveValue(settingDetail.preactiveValue);
        formik.setValues({
          activeValue: settingDetail.activeValue,
          activeDate: settingDetail.activeDate,
          preactiveValue: settingDetail.preactiveValue,
        });
      })
      .catch((err) => {});
  }, [id]);

  return (
    <section className="pt-0" style={{ height: "100vh" }}>
      <HeaderAdmin />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        <div className={`main--content px-4 pt-3`}>
          <div className="container light-style flex-grow-1 container-p-y">
            <h4 className="font-weight-bold py-3 mb-4">settings</h4>
            <div className="card overflow-hidden">
              <div className="row no-gutters row-bordered row-border-light">
                <div className="col-md-3 pt-0">
                  <div className="list-group list-group-flush account-settings-links">
                    {menuSetting.map((setting) => (
                      <a
                        key={setting.id}
                        className="list-group-item list-group-item-action"
                        data-toggle="list"
                      >
                        {setting.settingName}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="tab-content">
                    <div
                      className="tab-pane fade active show"
                      id="setting-payingtime"
                    >
                      <hr className="border-light m-0" />
                      <Form
                        {...formItemLayout}
                        form={formik.form}
                        size="large"
                        autoComplete="off"
                      >
                        <div className="card-body row mx-4">
                          <div className="form-group col-md-12">
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
                                <span>Active Value:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="activeValue"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.activeValue}
                                  hasFeedback
                                >
                                  <InputNumber
                                    name="activeValue"
                                    value={formik.values.activeValue}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-md-12">
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
                                <span>Active Date:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="activeDate"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.activeDate}
                                  hasFeedback
                                >
                                  <Input
                                    name="activeDate"
                                    value={formik.values.activeDate}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-md-12">
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
                                <span>PreActive Value:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="preactiveValue"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.preactiveValue}
                                  hasFeedback
                                >
                                  <InputNumber
                                    name="preactiveValue"
                                    value={formik.values.preactiveValue}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>

                    <div className="tab-pane fade" id="setting-refundtime">
                      <hr className="border-light m-0" />
                      <Form
                        {...formItemLayout}
                        form={formik.form}
                        size="large"
                        autoComplete="off"
                      >
                        <div className="card-body row mx-4">
                          <div className="form-group col-md-12">
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
                                <span>Active Value:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="activeValue"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.activeValue}
                                  hasFeedback
                                >
                                  <InputNumber
                                    name="activeValue"
                                    value={formik.values.activeValue}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-md-12">
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
                                <span>Active Date:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="activeDate"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.activeDate}
                                  hasFeedback
                                >
                                  <Input
                                    name="activeDate"
                                    value={formik.values.activeDate}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-md-12">
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
                                <span>PreActive Value:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="preactiveValue"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.preactiveValue}
                                  hasFeedback
                                >
                                  <InputNumber
                                    name="preactiveValue"
                                    value={formik.values.preactiveValue}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>

                    <div className="tab-pane fade" id="setting-minnum">
                      <hr className="border-light m-0" />
                      <Form
                        {...formItemLayout}
                        form={formik.form}
                        size="large"
                        autoComplete="off"
                      >
                        <div className="card-body row mx-4">
                          <div className="form-group col-md-12">
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
                                <span>Active Value:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="activeValue"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.activeValue}
                                  hasFeedback
                                >
                                  <InputNumber
                                    name="activeValue"
                                    value={formik.values.activeValue}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-md-12">
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
                                <span>Active Date:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="activeDate"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.activeDate}
                                  hasFeedback
                                >
                                  <Input
                                    name="activeDate"
                                    value={formik.values.activeDate}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-md-12">
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
                                <span>PreActive Value:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="preactiveValue"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.preactiveValue}
                                  hasFeedback
                                >
                                  <InputNumber
                                    name="preactiveValue"
                                    value={formik.values.preactiveValue}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>

                    <div className="tab-pane fade" id="setting-maxnum">
                      <hr className="border-light m-0" />
                      <Form
                        {...formItemLayout}
                        form={formik.form}
                        size="large"
                        autoComplete="off"
                      >
                        <div className="card-body row mx-4">
                          <div className="form-group col-md-12">
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
                                <span>Active Value:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="activeValue"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.activeValue}
                                  hasFeedback
                                >
                                  <InputNumber
                                    name="activeValue"
                                    value={formik.values.activeValue}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-md-12">
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
                                <span>Active Date:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="activeDate"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.activeDate}
                                  hasFeedback
                                >
                                  <Input
                                    name="activeDate"
                                    value={formik.values.activeDate}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-md-12">
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
                                <span>PreActive Value:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="preactiveValue"
                                  label=""
                                  rules={[
                                    {
                                      required: true,
                                      message: " cannot be blank",
                                    },
                                    {
                                      whitespace: true,
                                      message: " cannot be empty",
                                    },
                                  ]}
                                  initialValue={initialValues.preactiveValue}
                                  hasFeedback
                                >
                                  <InputNumber
                                    name="preactiveValue"
                                    value={formik.values.preactiveValue}
                                    placeholder="Enter"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right mt-3">
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
              &nbsp;
              <button type="button" className="btn btn-default">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
