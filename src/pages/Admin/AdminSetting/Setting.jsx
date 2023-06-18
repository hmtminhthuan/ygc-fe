import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../constants/api";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import { Formik, useFormik } from "formik";
import { Form, Input, Button } from "antd";
import "./AdminSetting.scss";

export default function Setting() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };

  const { id } = useParams();
  const [menuSetting, setMenuSetting] = useState([]);
  const [initialValues, setInitialValues] = useState({});

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
      })
      .catch((err) => {});
  }, [id]);

  const formik = useFormik({
    initialValues: {
      activeValue: initialValues.activeValue || "",
      activeDate: initialValues.activeDate || "",
      preactiveValue: initialValues.preactiveValue || "",
    },
  });

  const displaySettingInformation = (setting) => {
    return (
      <div
        className="tab-pane fade active show"
        id="account-general"
        key={setting.id}
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
                    initialValue={setting.activeValue}
                    hasFeedback
                  >
                    <Input
                      name="activeValue"
                      value={formik.values.activeValue}
                      onChange={formik.handleChange}
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
                    initialValue={setting.activeDate}
                    hasFeedback
                  >
                    <Input
                      name="activeDate"
                      value={formik.values.activeDate}
                      onChange={formik.handleChange}
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
                    initialValue={setting.preactiveValue}
                    hasFeedback
                  >
                    <Input
                      name="preactiveValue"
                      value={formik.values.preactiveValue}
                      onChange={formik.handleChange}
                      placeholder="Enter"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  };

  const selectedSetting = menuSetting.map((setting) => {
    if (setting.id === parseInt(id)) {
      return displaySettingInformation(setting);
    }
    return null;
  });

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
                      <Link
                        key={setting.id}
                        className={`list-group-item list-group-item-action ${
                          setting.id === parseInt(id) ? "active" : ""
                        }`}
                        to={`/admin/settings/${setting.id}`}
                      >
                        {setting.settingName}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="tab-content">{selectedSetting}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
