import { Button, Form, Input } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { api } from "../../constants/api";
export default function ChangePasswordLogin() {
  const navigate = useNavigate();
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [accountID, setAccountID] = useState("");
  useEffect(() => {
    const CHECK_VERIFY_EMAIL_FORGET = localStorage.getItem(
      "CHECK_VERIFY_EMAIL_FORGET"
    );
    if (
      CHECK_VERIFY_EMAIL_FORGET == null ||
      CHECK_VERIFY_EMAIL_FORGET == undefined ||
      CHECK_VERIFY_EMAIL_FORGET == "" ||
      CHECK_VERIFY_EMAIL_FORGET == "false"
    ) {
      localStorage.removeItem("CHECK_VERIFY_EMAIL_FORGET");
      navigate("/");
    }
    if (CHECK_VERIFY_EMAIL_FORGET == "true") {
      setAccountID(localStorage.getItem("accountID"));
      setVerifyEmail(true);
      localStorage.removeItem("CHECK_VERIFY_EMAIL_FORGET");
      localStorage.removeItem("accountID");
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
        .put(`/Account/UpdatePasswordAccount?id=${accountID}`, {
          password: values.password,
        })
        .then((res) => {
          if (res.status == 200) {
            api
              .get("/Account/AccountList")
              .then((res) => {
                let userList = [];
                userList = res.data;
                let pos = userList.findIndex((obj) => {
                  return (
                    obj.accountID.toString().trim() ==
                    accountID.toString().trim()
                  );
                });
                localStorage.removeItem("USER_LOGIN");
                localStorage.setItem(
                  "USER_LOGIN",
                  JSON.stringify(userList[pos])
                );
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: `Reset Password Successfully</br>Welcome ${userList[pos].firstName} ${userList[pos].lastName}`,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {
                  if (userList[pos].role.id == 1) {
                    navigate("/admin");
                  } else if (userList[pos].role.id == 2) {
                    navigate("/staff");
                  } else if (userList[pos].role.id == 3) {
                    if (redirect) {
                      navigate(redirect);
                    } else {
                      navigate("/");
                    }
                  } else if (userList[pos].role.id == 4) {
                    if (redirect) {
                      navigate(redirect);
                    } else {
                      navigate("/");
                    }
                  }
                });
              })
              .catch((err) => {});
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
        navigate(`/login`);
      }
    });
  };
  return (
    <>
      {verifyEmail ? (
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
      ) : (
        <></>
      )}
    </>
  );
}
