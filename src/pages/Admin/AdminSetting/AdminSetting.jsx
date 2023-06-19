import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../constants/api";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import { Formik, useFormik } from "formik";
import { Form, Input, Button, InputNumber, DatePicker } from "antd";
import "./AdminSetting.scss";
import moment from "moment/moment";
import { alert } from "../../../component/AlertComponent/Alert";
import Swal from "sweetalert2";

export default function AdminSetting() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };

  const [newSetting, setNewSetting] = useState(null);
  const [updateDone, setUpdateDone] = useState(1);

  const [id, setId] = useState(0);
  const [menuSetting, setMenuSetting] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [activeValue, setActiveValue] = useState("");
  const [activeDate, setActiveDate] = useState("");
  //const [activeDate, setActiveDate] = useState(moment());
  const [preactiveValue, setPreactiveValue] = useState("");
  const [form] = Form.useForm();
  const formik = useFormik({
    initialValues: {
      id: id,
      activeValue: "",
      activeDate: "",
      preactiveValue: "",
    },
    onSubmit: (values) => {
      console.log({
        id: values.id,
        activeValue: values.activeValue,
        activeDate: values.activeDate.toString(),
      });

      api
        .post("/api/AdminRepositoryAPI/UpdateSetting", {
          id: values.id,
          activeValue: values.activeValue,
          activeDate: values.activeDate,
        })
        .then((res) => {
          setUpdateDone((prev) => prev + 1);

          const Toast = Swal.mixin({
            // toast: true,
            position: "middle",
            width: `30rem`,
            padding: "1rem",
            background: "#eef6ec",
            showConfirmButton: false,
            timer: 1000,
            // timerProgressBar: true,
            didOpen: (toast) => {
              // toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: `Update Successfully`,
            html: ``,
          });
        })
        .catch((err) => {});
    },
  });

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // const formatDate = (dateString) => {
  //   const formattedDate = moment(dateString).format("DD-MM-YYYY");
  //   return formattedDate;
  // };

  // useEffect(() => {
  //   api
  //     .get("/api/AdminRepositoryAPI/GetSettingList")
  //     .then((res) => {
  //       setMenuSetting(res.data);
  //     })
  //     .catch((err) => {});
  // }, []);

  // useEffect(() => {
  //   const settingItem = menuSetting.filter((item) => item.id == id)[0];
  //   if (settingItem != null && settingItem != undefined) {
  //     {
  //       const settingDetail = settingItem;
  //       setInitialValues(settingDetail);
  //       setActiveValue(settingDetail.activeValue);
  //       // setActiveDate(settingDetail.activeDate);
  //       setActiveDate(moment(settingDetail.activeDate));
  //       setPreactiveValue(settingDetail.preactiveValue);
  //       formik.setValues({
  //         activeValue: settingDetail.activeValue,
  //         activeDate: settingDetail.activeDate,
  //         preactiveValue: settingDetail.preactiveValue,
  //       });
  //     }
  //   }
  // }, [id]);

  useEffect(() => {
    api
      .get("/api/AdminRepositoryAPI/GetSettingList")
      .then((res) => {
        setMenuSetting(res.data);
      })
      .catch((err) => {});

    const settingItem = menuSetting.filter((item) => item.id === id)[0];
    if (settingItem != null && settingItem != undefined) {
      const settingDetail = settingItem;
      setInitialValues(settingDetail);
      setActiveValue(settingDetail.activeValue);
      setActiveDate(moment(settingDetail.activeDate));
      setPreactiveValue(settingDetail.preactiveValue);
      formik.setValues({
        id: settingDetail.id,
        activeValue: settingDetail.activeValue,
        activeDate: settingDetail.activeDate,
        // activeDate: moment(settingDetail.activeDate),
        preactiveValue: settingDetail.preactiveValue,
      });
    }
  }, [id, updateDone]);

  // const formattedDate = formatDate(activeDate);
  const formattedDate = formatDate(formik.values.activeDate);
  const handleChangeActiveValue = (value) => {
    formik.setFieldValue("activeValue", value);
    setActiveValue(value);
  };
  return (
    <section className="pt-0" style={{ height: "100vh" }}>
      <HeaderAdmin />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        <div className={`main--content px-4 pt-3`}>
          <div className="container light-style flex-grow-1 container-p-y">
            <h2 className="py-2 pt-0 text-center" style={{ color: "#e049c0" }}>
              SETTING
            </h2>
            <div className="card overflow-hidden">
              <div className="row no-gutters row-bordered row-border-light">
                <div className="col-md-3 pt-0">
                  <div className="list-group list-group-flush account-settings-links">
                    {menuSetting.map((setting) => (
                      <a
                        key={setting.id}
                        className={`list-group-item list-group-item-action ${
                          id === 0 ? "list-group-item-active" : ""
                        }`}
                        data-toggle="list"
                        onClick={() => {
                          setId(setting.id);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {setting.settingName}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade active show ${
                        id === 0 ? "d-none" : ""
                      }`}
                      id="setting-payingtime"
                    >
                      <hr className="border-light m-0" />
                      <Form
                        {...formItemLayout}
                        onFinish={formik.handleSubmit}
                        form={form}
                        size="large"
                        autoComplete="off"
                      >
                        <div className="card-body row mx-4">
                          <div className="form-group col-md-12">
                            <div className="row flex align-items-start justify-content-between">
                              {/* Other form elements */}

                              <div className="col-8">
                                <Form.Item
                                  name="id"
                                  label=""
                                  initialValue={initialValues.id}
                                  hasFeedback
                                  style={{ display: "none" }} // Add this style to hide the input field
                                >
                                  <p>{id}</p>
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
                                <span>Active Value:</span>
                              </p>

                              <div className="col-8">
                                <Form.Item
                                  name="activeValue"
                                  label=""
                                  initialValue={initialValues.activeValue}
                                  hasFeedback
                                >
                                  <InputNumber
                                    name="activeValue"
                                    value={formik.values.activeValue}
                                    onChange={handleChangeActiveValue}
                                    // onInput={(e) => {
                                    //   setActiveValue(e.target.value);
                                    // }}
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
                                  initialValue={formik.values.activeDate}
                                  hasFeedback
                                >
                                  {/* <p>{formattedDate}</p> */}
                                  <DatePicker
                                    name="activeDate"
                                    value={formik.values.activeDate}
                                    onChange={(value) => {
                                      setActiveDate(value);
                                      formik.setFieldValue("activeDate", value);
                                    }}
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
                                  initialValue={initialValues.preactiveValue}
                                  hasFeedback
                                >
                                  <p>{preactiveValue}</p>
                                </Form.Item>
                              </div>
                              <button type="submit" className="mx-3">
                                Save changes
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
