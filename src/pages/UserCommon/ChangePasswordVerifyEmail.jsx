import { Button, Form, Input } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { api } from "../../constants/api";
import Swal from "sweetalert2";
import { alert } from "../../component/AlertComponent/Alert";

export default function ChangePasswordVerifyEmail() {
  // const { id } = useParams();
  const id = JSON.parse(localStorage.getItem("USER_LOGIN")).accountID;
  let USER = {};
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const [accept, setAccept] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const navigate = useNavigate();

  if (!(USER_LOGIN != null && !accept)) {
    if (!accept) {
      navigate("/");
    }
  } else {
    USER = JSON.parse(USER_LOGIN);
    if (
      USER.accountID != null &&
      USER.accountID != undefined &&
      USER.accountID.toString().trim() == id.toString().trim()
    ) {
      setAccept(true);
    } else {
      navigate("/");
    }
  }
  useEffect(() => {
    const CHECK_VERIFY_EMAIL = localStorage.getItem("CHECK_VERIFY_EMAIL");
    if (
      CHECK_VERIFY_EMAIL == null ||
      CHECK_VERIFY_EMAIL == undefined ||
      CHECK_VERIFY_EMAIL == "" ||
      CHECK_VERIFY_EMAIL == "false"
    ) {
      localStorage.removeItem("CHECK_VERIFY_EMAIL");
      navigate("/");
    }
    if (CHECK_VERIFY_EMAIL == "true") {
      localStorage.removeItem("CHECK_VERIFY_EMAIL");
      setVerifyEmail(true);
    }
  }, []);

  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const [form] = Form.useForm();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
    },

    onSubmit: (values) => {
      api
        .put(`/Account/UpdatePasswordAccount?id=${id}`, {
          password: values.password,
        })
        .then((res) => {
          if (res.status == 200) {
            // Swal.fire({
            //   position: "center",
            //   icon: "success",
            //   title: "Reset Password Successfully",
            //   showConfirmButton: false,
            //   timer: 1200,
            // }).then(function () {
            //   window.location.href = `/updateProfile/${id}`;
            // });
            alert.alertSuccessWithTime(
              "Reset Password Successfully",
              "",
              2000,
              "30",
              () => {
                navigate("/profile");
              }
            );
          }
        })
        .catch((err) => {});
    },
  });

  const handleCancel = () => {
    Swal.fire({
      title: `Are you sure to cancel?`,
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
      confirmButtonColor: "red",
      cancelButtonColor: "green",
      focusCancel: true,
    }).then((result) => {
      if (result.isDenied === true || result.isDismissed === true) {
      } else if (result.isConfirmed === true) {
        navigate(`/updateProfile`);
      }
    });
  };
  return (
    <>
      {verifyEmail && (
        <div
          className={`update-profile-area w-100`}
          style={{
            backgroundColor: "#f2ced8",
            width: "100vw",
            height: "100vh",
          }}
        >
          <div
            className="update update-profile-container w-100 h-100 m-0 p-0 pb-5 flex justify-content-center"
            style={{ backgroundColor: "#f2ced8", width: "100%" }}
          >
            <div
              className="row w-75
              bg-white shadow rounded-lg d-md-flex justify-content-center 
              mx-lg-5 mt-3 mx-4 py-4 px-4"
              style={{ borderRadius: "15px" }}
            >
              <h1
                className="px-0 text-center pt-2"
                style={{ color: "rgb(210,145,188)" }}
              >
                Reset Passwod
              </h1>
              <div className="tab-content py-4 px-0 col-lg-9 col-md-12">
                <div className="tab-pane fade show active w-100">
                  <div className="col-12" style={{ margin: "0 auto" }}>
                    <Form
                      {...formItemLayout}
                      form={form}
                      onFinish={formik.handleSubmit}
                      size="large"
                      autoComplete="off"
                      style={{ margin: "0 auto", width: "100%" }}
                    >
                      <div className="form-group col-12">
                        <div className="row flex align-items-start justify-content-between">
                          <p className="col-md-3 col-sm-12 p-0 m-0 px-3 mt-2 flex">
                            <span className="text-danger px-1">
                              <i
                                className="fa-solid fa-star-of-life"
                                style={{
                                  fontSize: "6px",
                                  verticalAlign: "middle",
                                }}
                              ></i>{" "}
                            </span>
                            <span>New Password:</span>
                          </p>
                          <div className="col-md-9 col-sm-12">
                            <Form.Item
                              name="password"
                              label=""
                              className="w-100"
                              rules={[
                                {
                                  required: true,
                                  message: "Password cannot be blank",
                                },
                                {
                                  min: 6,
                                  message:
                                    "Password must be at least 6 characters",
                                },
                              ]}
                              hasFeedback
                            >
                              <Input.Password
                                style={{ width: "100%", flexGrow: "1" }}
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                placeholder="Enter New Password"
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                      <div className="form-group col-12">
                        <div className="row flex align-items-start justify-content-between">
                          <p className="col-md-3 col-sm-12 p-0 m-0 px-3 mt-2 flex">
                            <span className="text-danger px-1">
                              <i
                                className="fa-solid fa-star-of-life"
                                style={{
                                  fontSize: "6px",
                                  verticalAlign: "middle",
                                }}
                              ></i>{" "}
                            </span>
                            <span>Confirm New Password:</span>
                          </p>
                          <div className="col-md-9 col-sm-12">
                            <Form.Item
                              name="confirm_password"
                              label=""
                              dependencies={["password"]}
                              className="w-100"
                              rules={[
                                {
                                  required: true,
                                  message: "Password cannot be blank",
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (
                                      !value ||
                                      getFieldValue("password") === value
                                    ) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      "Confirm Password does not match"
                                    );
                                  },
                                }),
                              ]}
                              hasFeedback
                            >
                              <Input.Password
                                style={{ width: "100%", flexGrow: "1" }}
                                name="confirm_password"
                                type="password"
                                placeholder="Enter New Password Again"
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-6 flex m-0">
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                              backgroundColor: "rgba(210, 145, 188, 1)",
                              color: "#333333",
                              fontWeight: "bolder",
                            }}
                          >
                            Save
                          </Button>
                        </div>
                        <div className="form-group col-6 flex m-0">
                          <NavLink
                            className="w-100 h-100
                        flex align-items-center justify-content-center
                        text-decoration-none"
                            style={{
                              backgroundColor: "#000",
                              color: "#fff",
                              fontWeight: "bolder",
                              borderRadius: "8px",
                            }}
                            onClick={() => {
                              handleCancel();
                            }}
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
      )}
    </>
  );
}
