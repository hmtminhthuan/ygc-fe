import { Button, Form, Input } from "antd";
import { useFormik } from "formik";
import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { api } from "../../constants/api";
import { alert } from "../../component/AlertComponent/Alert";
import Swal from "sweetalert2";

export default function ChangePassword({ userEmail, userId }) {
  const navigate = useNavigate();
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const [form] = Form.useForm();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldPassword: "",
      password: "",
    },

    onSubmit: (values) => {
      Swal.fire({
        title: "Loading...",
        html: "Please wait a few seconds",
        timer: 10000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {},
      });
      api
        .post(
          `/Account/CheckCurrentPassword?id=${userId}&password=${values.oldPassword}`
        )
        .then((res) => {
          if (res.data) {
            api
              .put(`/Account/UpdatePasswordAccount?id=${userId}`, {
                password: values.password,
                email: JSON.parse(localStorage.getItem("USER_LOGIN")).email,
                phoneNumber: JSON.parse(localStorage.getItem("USER_LOGIN"))
                  .phoneNumber,
              })
              .then((res) => {
                Swal.close();
                setTimeout(() => {
                  if (res.status == 200) {
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: `<h3>Update Password Successfully</h3>`,
                      html: ``,
                      showConfirmButton: false,
                      timer: 900,
                    });
                    form.resetFields();
                    formik.resetForm();
                  }
                }, 100);
              })
              .catch((err) => {});
          } else {
            alert.alertFailedWithTime(
              "Failed To Update",
              "Your current password is not correct",
              2500,
              "33",
              () => {}
            );
          }
        })
        .catch((err) => {});
    },
  });

  const handleResetPassword = (
    validationCode,
    email,
    accountID,
    time,
    alertWrongCode
  ) => {
    Swal.fire({
      title: `Verify your Account`,
      html: `We have sent a code to your Email: </br> ${email}. <br/>
  Please check and enter this code here. <br/> This will close in <b class="time"></b> seconds.
  </br><b>Send another code?</b> <a class="again" style="cursor:pointer; text-decoration: none"></a>`,
      input: "text",
      timer: time,
      timerProgressBar: true,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      didOpen: () => {
        const sendCodeAgainHTML =
          Swal.getHtmlContainer().querySelector("a.again");
        sendCodeAgainHTML.addEventListener("click", () => {
          Swal.fire({
            position: "center",
            title: `We have sent another code to your Email.</br>Please check your Email again.`,
            showConfirmButton: false,
            timer: 2000,
          }).then(function () {
            handleForgetPassword();
          });
        });
        sendCodeAgainHTML.textContent = `Click here`;
        const b = Swal.getHtmlContainer().querySelector("b.time");
        let timerInterval = setInterval(() => {
          b.textContent = Math.floor(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      preConfirm: (login) => {},
      allowOutsideClick: () => false,
    })
      .then((result) => {
        let timeLeft = Swal.getTimerLeft();
        if (result.isDenied === true || result.isDismissed === true) {
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
              handleResetPassword(validationCode, email, accountID, timeLeft);
            } else if (result.isConfirmed === true) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Reset Password failed!</br>Please try again",
                showConfirmButton: false,
                timer: 1000,
              });
            }
          });
        } else if (result.isConfirmed === true) {
          if (result.value == validationCode) {
            localStorage.setItem("CHECK_VERIFY_EMAIL", "true");
            navigate(`/changePassword`);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Incorrect Code</br> Please enter again",
              showConfirmButton: false,
              timer: 1300,
            }).then(function () {
              handleResetPassword(validationCode, email, accountID, timeLeft);
            });
          }
        }
      })
      .catch((err) => {});
  };

  const handleForgetPassword = () => {
    Swal.fire({
      title: "Loading...",
      html: "Please wait a few seconds",
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {},
    });

    api
      .post(`/Account/CreateValidationCode?email=${userEmail}`)
      .then((res) => {
        handleResetPassword(
          res.data.validationCode,
          userEmail,
          res.data.accountID,
          180000,
          false
        );
      })
      .catch((err) => {});
  };

  return (
    <>
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
            <p className="col-3 p-0 m-0 px-3 mt-2 flex">
              <span className="text-danger px-1">
                <i
                  className="fa-solid fa-star-of-life"
                  style={{
                    fontSize: "6px",
                    verticalAlign: "middle",
                  }}
                ></i>{" "}
              </span>
              <span>Current Password:</span>
            </p>
            <div className="col-9">
              <Form.Item
                name="oldPassword"
                label=""
                className="w-100"
                rules={[
                  {
                    required: true,
                    message: "Password cannot be blank",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  style={{ width: "100%", flexGrow: "1" }}
                  name="oldPassword"
                  type="password"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  placeholder="Enter Current Password"
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="form-group col-12">
          <div className="row flex align-items-start justify-content-between">
            <p className="col-3 p-0 m-0 px-3 mt-2 flex">
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
            <div className="col-9">
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
                    message: "Password must be at least 6 characters",
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
            <p className="col-3 p-0 m-0 px-3 mt-2 flex">
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
            <div className="col-9">
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
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Confirm Password does not match");
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
        <div className="form-group flex m-0">
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
      </Form>
      <div
        className="form-group flex m-0 flex justify-content-center my-0 mt-3"
        style={{ fontWeight: "bolder", fontSize: "17px" }}
      >
        Forget Current Password?
        <button
          className="mx-1 text-decoration-none text-danger border-0 bg-transparent"
          style={{ fontWeight: "bolder" }}
        >
          <NavLink
            onClick={() => {
              handleForgetPassword();
            }}
          >
            {`${` `}Click here`}
          </NavLink>
        </button>
      </div>
    </>
  );
}
