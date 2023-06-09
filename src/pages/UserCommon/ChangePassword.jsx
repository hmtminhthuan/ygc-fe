import { Button, Form, Input } from "antd";
import { useFormik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import { api } from "../../constants/api";

export default function ChangePassword({ userEmail, userId }) {
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
      api
        .post(
          `/Account/CheckCurrentPassword?id=${userId}&password=${values.oldPassword}`
        )
        .then((res) => {
          if (res.data) {
            api
              .put(`/Account/UpdatePasswordAccount?id=${userId}`, {
                password: values.password,
              })
              .then((res) => {
                if (res.status == 200) {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Update Password Successfully",
                    showConfirmButton: true,
                    timer: 1500,
                  }).then(function () {
                    window.location.href = `/updateProfile/${userId}`;
                  });
                }
              })
              .catch((err) => {});
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Your current password is not correct. Please try again",
              showConfirmButton: true,
              timer: 2000,
            });
          }
        })
        .catch((err) => {});
    },
  });

  const handleChangePassword = (accountID) => {
    Swal.fire({
      title: `Enter your new Password`,
      html: `Your Password must be at least 6 chacracters`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      allowOutsideClick: false,
    })
      .then(async (result) => {
        if (result.isDenied === true || result.isDismissed === true) {
          Swal.fire({
            title: `Are you sure to cancel?`,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isDenied === true || result.isDismissed === true) {
              handleChangePassword(accountID);
            } else if (result.isConfirmed === true) {
            }
          });
        } else if (result.isConfirmed === true) {
          if (result.value.trim().length < 6) {
            await Swal.fire({
              position: "center",
              icon: "error",
              title:
                "Your password must be at least 6 chacracters. </br> Please enter again!",
              showConfirmButton: false,
              timer: 2000,
            }).then(function () {
              handleChangePassword(accountID);
            });
          } else {
            api
              .put(`/Account/UpdatePasswordAccount?id=${accountID}`, {
                password: result.value.trim(),
              })
              .then((res) => {
                if (res.status == 200) {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Update Password Successfully",
                    showConfirmButton: true,
                    timer: 1500,
                  }).then(function () {
                    window.location.href = `/updateProfile/${userId}`;
                  });
                }
              })
              .catch((err) => {});
          }
        }
      })
      .catch((err) => {});
  };

  const handleResetPassword = (validationCode, email, accountID, time) => {
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
          }).then((result) => {
            if (result.isDenied === true || result.isDismissed === true) {
              handleResetPassword(validationCode, email, accountID, timeLeft);
            } else if (result.isConfirmed === true) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Reset Password failed!</br>Please try again",
                showConfirmButton: true,
                timer: 1000,
              });
            }
          });
        } else if (result.isConfirmed === true) {
          if (result.value == validationCode) {
            handleChangePassword(accountID);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Wrong verify code! </br> Please enter again",
              showConfirmButton: false,
              timer: 1000,
            }).then(function () {
              handleResetPassword(validationCode, email, accountID, timeLeft);
            });
          }
        }
      })
      .catch((err) => {});
  };

  const handleForgetPassword = () => {
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      html: "Please wait a few seconds",
      timer: 1200,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });

    api
      .post(`/Account/CreateValidationCode?email=${userEmail}`)
      .then((res) => {
        handleResetPassword(
          res.data.validationCode,
          userEmail,
          res.data.accountID,
          180000
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
        <div className="form-group flex m-0 col-12">
          <Form.Item
            name="oldPassword"
            label="Current Password"
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
        <div className="form-group flex m-0">
          <Form.Item
            name="password"
            label="New Password"
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
        <div className="form-group flex m-0">
          <Form.Item
            name="confirm_password"
            label="Confirm New Password"
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
        className="form-group flex m-0 flex justify-content-center my-3 mt-4"
        style={{ fontWeight: "bolder", fontSize: "17px" }}
      >
        Forget Current Password?
        <button
          className="mx-2 text-decoration-none text-danger border-0 bg-transparent"
          style={{ fontWeight: "bolder" }}
          onClick={() => {
            handleForgetPassword();
          }}
        >
          Click here
        </button>
      </div>
    </>
  );
}
