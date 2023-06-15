import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { api } from "../../constants/api";
import Swal from "sweetalert2";
import { Formik, useFormik } from "formik";
import { Form, Input, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import female from "../../assets/images/avt-female.jpg";
import male from "../../assets/images/avt-male.jpg";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import ChangePassword from "./ChangePassword";
import ChangePasswordVerifyEmail from "./ChangePasswordVerifyEmail";
import { alert } from "../../component/AlertComponent/Alert";
export default function UpdateProfile() {
  localStorage.setItem("MENU_ACTIVE", "home-profile");
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  // const { id } = useParams();
  const id = JSON.parse(localStorage.getItem("USER_LOGIN")).accountID;
  const [accept, setAccept] = useState(false);
  const [profile, setProfile] = useState(null);
  const [updateDone, setUpdateDone] = useState(1);
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [roleName, setRoleName] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [changePasswordMoniter, setChangePasswordMoniter] = useState(false);
  let USER = {};
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const [form] = Form.useForm();

  if (!(USER_LOGIN != null && !accept)) {
    if (!accept) {
      return <Navigate to={"/"} />;
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
      return <Navigate to={"/"} />;
    }
  }

  useEffect(() => {
    api
      .get("/Account/GetUserProfile", {
        params: { id: id },
      })
      .then((res) => {
        if (res.data.img != "male" && res.data.img != "female") {
          setPreviewImg(res.data.img);
        }
        const userProfile = res.data;
        setProfile(userProfile);
        setPhone(res.data.phoneNumber);
        setAddress(res.data.address);
        formik.setValues({
          firstname: userProfile.firstname,
          lastname: userProfile.lastname,
          phoneNumber: userProfile.phoneNumber,
          address: userProfile.address,
          img: userProfile.img,
        });
      })
      .catch((err) => {});
  }, [updateDone]);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      phoneNumber: "",
      address: "",
      img: "",
    },
    onSubmit: (values) => {
      console.log(values);
      if (values.img == "") {
        values.img = "female";
        if (profile.gender) {
          values.img = "male";
        }
      }
      api
        .put(`/Account/UpdateAccount?id=${profile.id}`, values)
        .then((res) => {
          setUpdateDone((prev) => prev + 1);
          api
            .get("/Account/AccountList")
            .then((res) => {
              let userList = [];
              userList = res.data;
              localStorage.removeItem("USER_LOGIN");
              localStorage.setItem(
                "USER_LOGIN",
                JSON.stringify(
                  userList[
                    userList.findIndex((obj) => {
                      return (
                        obj.phoneNumber.toString().trim() ==
                        values.phoneNumber.toString().trim()
                      );
                    })
                  ]
                )
              );
            })
            .catch((err) => {});
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

  if (!profile) {
    return null;
  }

  return (
    <>
      {accept ? (
        <div
          className={`update-profile-area w-100
          ${changePasswordMoniter ? "update-profile-password-area" : ""}`}
          style={{
            backgroundColor: "#f2ced8",
            width: "100vw",
            minHeight: "100vh",
          }}
        >
          <div
            className="w-100 p-0 m-0"
            style={{
              height: "53px",
              backgroundColor: "#fff",
              position: "fixed",
              zIndex: "100",
            }}
          >
            <HeaderHome />
          </div>

          <div
            className="update update-profile-container w-100 h-100 m-0 p-0 pb-5 flex justify-content-center"
            style={{ backgroundColor: "#f2ced8", width: "100%" }}
          >
            <div
              className="containerud w-100 p-0 m-0"
              style={{
                margin: "0 auto",
                width: "100%",
              }}
            >
              <div className="p-0 m-0 mt-lg-0 mt-5 pt-lg-3">
                <h1
                  className="mb-3 pt-lg-5 pt-4 mt-lg-2 mt-md-5 text-center text-dark"
                  style={{ color: "333", fontWeight: "bold" }}
                >
                  Update Account
                </h1>
              </div>
              <div
                className="row bg-white shadow rounded-lg d-md-flex justify-content-center mx-lg-5"
                style={{ borderRadius: "15px" }}
              >
                <div className="profile-tab-nav col-lg-3 col-md-12 border-md-0">
                  <div className="p-4 mt-0 w-100 ">
                    <div className="">
                      <Link
                        to={`/profile`}
                        className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                        style={{ fontSize: "18px", fontWeight: "500" }}
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span className="mx-2">Back</span>
                      </Link>
                    </div>
                    <div className="img-circle text-center mb-3 mt-4">
                      {profile.img == "male" && previewImg == "" ? (
                        <img
                          src={male}
                          alt="Image"
                          className="shadow img-user-profile"
                          style={{
                            width: "160px",
                            height: "160px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <></>
                      )}
                      {profile.img == "female" && previewImg == "" ? (
                        <img
                          src={female}
                          alt="Image"
                          className="shadow img-user-profile"
                          style={{
                            width: "160px",
                            height: "160px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <></>
                      )}
                      {previewImg == "" ? (
                        <></>
                      ) : (
                        <img
                          src={previewImg}
                          alt="Image"
                          className="shadow img-user-profile"
                          style={{
                            width: "170px",
                            height: "170px",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                    <h2
                      className="text-center"
                      style={{ color: "rgba(210, 145, 188, 1)" }}
                    >
                      {profile.firstname} {profile.lastname}
                    </h2>
                    <h5 className="text-center mt-3" style={{}}>
                      Phone: {profile.phoneNumber}
                    </h5>
                    <h5 className="text-center" style={{}}>
                      Address: {profile.address}
                    </h5>
                  </div>
                </div>

                {!changePasswordMoniter ? (
                  <div className="tab-content p-4 pt-5 col-lg-9 col-md-12">
                    <div
                      className="tab-pane fade show active w-100
            d-md-flex d-sm-flex justify-content-center"
                      style={{ margin: "0 auto" }}
                    >
                      {/* <h3 className="mb-4">Account Settings</h3> */}
                      <div className="flex justify-content-center">
                        <Form
                          {...formItemLayout}
                          form={form}
                          onFinish={formik.handleSubmit}
                          size="large"
                          autoComplete="off"
                        >
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group w-100">
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
                                    <span>Firstname:</span>
                                  </p>
                                  <div className="col-md-9 col-sm-12">
                                    <Form.Item
                                      name="firstname"
                                      label=""
                                      rules={[
                                        {
                                          required: true,
                                          message: "Firstname cannot be blank",
                                        },
                                        {
                                          whitespace: true,
                                          message: "Firstname cannot be empty",
                                        },
                                      ]}
                                      hasFeedback
                                      initialValue={profile.firstname}
                                    >
                                      <Input
                                        name="firstname"
                                        value={formik.values.firstname}
                                        onChange={formik.handleChange}
                                        onInput={(e) => {
                                          setFirstname(e.target.value);
                                        }}
                                        placeholder="Enter firstname"
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group w-100">
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
                                    <span>Lastname:</span>
                                  </p>
                                  <div className="col-md-9 col-sm-12">
                                    <Form.Item
                                      name="lastname"
                                      label=""
                                      rules={[
                                        {
                                          required: true,
                                          message: "Lastname cannot be blank",
                                        },
                                        {
                                          whitespace: true,
                                          message: "Lastname cannot be empty",
                                        },
                                      ]}
                                      hasFeedback
                                      initialValue={profile.lastname}
                                    >
                                      <Input
                                        name="lastname"
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        onInput={(e) => {
                                          setLastname(e.target.value);
                                        }}
                                        placeholder="Enter lastname"
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group w-100">
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
                                    <span>Phone Number:</span>
                                  </p>
                                  <div className="col-md-9 col-sm-12">
                                    <Form.Item
                                      name="phoneNumber"
                                      label=""
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Phone Number cannot be blank",
                                        },
                                        {
                                          message:
                                            "Phone is not in correct form",
                                          pattern: /(0|[1-9][0-9]*)$/,
                                        },
                                        {
                                          min: 10,
                                          message:
                                            "Phone must be 10-11 numbers",
                                        },
                                        {
                                          max: 11,
                                          message:
                                            "Phone must be 10-11 numbers",
                                        },
                                      ]}
                                      hasFeedback
                                      initialValue={profile.phoneNumber}
                                    >
                                      <Input
                                        name="phoneNumber"
                                        value={formik.values.phoneNumber}
                                        onChange={formik.handleChange}
                                        onInput={(e) => {
                                          setPhone(e.target.value);
                                        }}
                                        placeholder="Enter Phone Number"
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group w-100">
                                <div className="row flex align-items-start justify-content-between">
                                  <p className="col-md-3 col-sm-12 p-0 m-0 px-3 mt-2 flex">
                                    <span className="text-danger px-1"></span>
                                    <span>Address:</span>
                                  </p>
                                  <div className="col-md-9 col-sm-12">
                                    <Form.Item
                                      name="address"
                                      label=""
                                      className="w-100"
                                      style={{ width: "" }}
                                      rules={[
                                        {
                                          whitespace: true,
                                          message:
                                            "Address cannot contain only whitespace",
                                        },
                                      ]}
                                      hasFeedback
                                      initialValue={profile.address}
                                    >
                                      <TextArea
                                        style={{
                                          width: "100%",
                                          height: "75px",
                                        }}
                                        name="address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onInput={(e) => {
                                          setAddress(e.target.value);
                                        }}
                                        placeholder="Enter Address"
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group w-100">
                                <div className="row flex align-items-start justify-content-between">
                                  <p className="col-md-3 col-sm-12 p-0 m-0 px-3 mt-2 flex">
                                    <span className="text-danger px-1"></span>
                                    <span>Image:</span>
                                  </p>
                                  <div className="col-md-9 col-sm-12">
                                    <Form.Item
                                      name="img"
                                      label=""
                                      className="w-100"
                                      rules={[]}
                                      hasFeedback
                                      initialValue={`${
                                        profile.img != "male" &&
                                        profile.img != "female"
                                          ? profile.img
                                          : ""
                                      }`}
                                    >
                                      <TextArea
                                        style={{
                                          width: "100%",
                                          height: "75px",
                                        }}
                                        name="img"
                                        value={formik.values.img}
                                        onChange={formik.handleChange}
                                        onInput={(e) => {
                                          setPreviewImg(e.target.value);
                                        }}
                                        placeholder="Enter Link Of Image"
                                      />
                                    </Form.Item>
                                  </div>{" "}
                                </div>{" "}
                              </div>
                            </div>
                          </div>

                          <div className="text-center row">
                            <div className="col-6">
                              <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                  backgroundColor: "rgba(210, 145, 188, 1)",
                                  color: "#333",
                                  fontWeight: "bold",
                                }}
                              >
                                Save
                              </Button>
                            </div>
                            <div className="col-6 flex align-items-center">
                              <button
                                type="reset"
                                className="cancel-update-profile-button bg-dark h-100 w-100 flex align-items-center justify-content-center
                            text-decoration-none text-light"
                                style={{ borderRadius: "10px" }}
                                onClick={() => {
                                  form.resetFields();
                                }}
                              >
                                Reset
                              </button>
                            </div>
                            <div
                              className="col-12 mt-4"
                              style={{ fontWeight: "bolder" }}
                            >
                              <div
                                className="m-0 p-0"
                                style={{ fontSize: "17px" }}
                              >
                                Change Current Password?
                                <Link
                                  className="mx-2 text-decoration-none"
                                  style={{ color: "rgba(210, 145, 188, 1)" }}
                                  onClick={() => {
                                    setChangePasswordMoniter(true);
                                  }}
                                >
                                  Click here
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="tab-content p-md-5 col-lg-9 col-md-12">
                      <div className="tab-pane fade show active w-100">
                        <div className="col-12" style={{ margin: "0 auto" }}>
                          <ChangePassword
                            userEmail={profile.email}
                            userId={profile.id}
                          />
                        </div>
                        <div
                          className="col-12 mt-1 text-center"
                          style={{ fontWeight: "bolder" }}
                        >
                          <div
                            style={{ fontSize: "17px" }}
                            className="py-3 pt-0 py-lg-0"
                          >
                            <Link
                              className="text-decoration-none"
                              style={{ color: "rgba(210, 145, 188, 1)" }}
                              onClick={() => {
                                setChangePasswordMoniter(false);
                              }}
                            >
                              Click here {"  "}
                            </Link>
                            {"  "} to update other information
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
