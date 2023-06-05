import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../constants/api";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { Form, Input, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import female from "../../assets/images/avt-female.jpg";
import male from "../../assets/images/avt-male.jpg";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import ChangePassword from "./ChangePassword";
export default function UpdateProfile() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const { id } = useParams();
  const [accept, setAccept] = useState(false);
  const [profile, setProfile] = useState(null);

  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [roleName, setRoleName] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [changePasswordMoniter, setChangePasswordMoniter] = useState(false);
  let USER = {};
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");

  if (!(USER_LOGIN != null && !accept)) {
    if (!accept) {
      window.location.href = "/";
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
      window.location.href = "/";
    }
  }

  useEffect(() => {
    api
      .get("/Account/GetUserProfile", {
        params: { id: id },
      })
      .then((res) => {
        const userProfile = res.data;
        setProfile(userProfile);
        setPhone(res.data.phoneNumber);
        setAddress(res.data.address);
        if (res.data.img != "male" && res.data.img != "female") {
          setPreviewImg(res.data.img);
        }
        formik.setValues({
          firstname: userProfile.firstname,
          lastname: userProfile.lastname,
          phoneNumber: userProfile.phoneNumber,
          address: userProfile.address,
          img: userProfile.img,
        });
        setLastname(res.data.lastname);
        setFirstname(res.data.firstname);
        // setRoleName(res.data.role.name);
        setPhone(res.data.phoneNumber);
        setAddress(res.data.address);
        if (res.data.img == "male" && res.data.img == "female") {
          setPreviewImg(res.data.img);
        }
      })
      .catch((err) => {});
  }, [id]);

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
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Update profile successfully!",
            showConfirmButton: true,
            timer: 1000,
          }).then(function () {
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
              .catch((err) => {})
              .finally(() => {
                window.location.href = `/updateProfile/${profile.id}`;
              });
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
        <>
          <div className="">
            <HeaderHome />
          </div>
          <div className="update update-profile-area w-100 flex justify-content-center">
            <div
              className="containerud w-100"
              style={{ margin: "0 auto", width: "100%" }}
            >
              <h1 className="mb-4 pt-5 mt-5 text-primary text-center">
                Update Account
              </h1>
              <div className="row bg-white shadow rounded-lg d-md-flex justify-content-center mx-lg-5">
                <div className="profile-tab-nav col-lg-3 col-md-12 border-md-0">
                  <div className="p-4 mt-4 w-100">
                    <div className="">
                      <Link
                        to={`/profile/${id}`}
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
                            borderRadius: "5px",
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
                            borderRadius: "5px",
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
                            width: "200px",
                            height: "160px",
                            borderRadius: "5px",
                          }}
                        />
                      )}
                    </div>
                    <h2 className="text-center text-primary" style={{}}>
                      {profile.firstname} {profile.lastname}
                    </h2>
                    <h5 className="text-center mt-3" style={{}}>
                      Phone: {profile.phoneNumber}
                    </h5>
                    <h5 className="text-center" style={{}}>
                      Address: {profile.address}
                    </h5>
                    {/* <p className="text-left p-0 m-0 mt-2" style={{}}>
                Phone: {phone}
              </p>
              <p
                className="text-left p-0 m-0 mt-2"
                // style={{ maxWidth: "200px" }}
              >
                Address: {address}
              </p> */}
                    {/* <p className="text-center">Account ID: {id}</p>
              <p className="text-center">Role: {roleName}</p> */}
                  </div>
                </div>

                {!changePasswordMoniter ? (
                  <div className="tab-content p-4 p-md-5 col-lg-9 col-md-12">
                    <div
                      className="tab-pane fade show active w-100
            d-md-flex d-sm-flex justify-content-center"
                    >
                      {/* <h3 className="mb-4">Account Settings</h3> */}
                      <Form
                        {...formItemLayout}
                        form={formik.form}
                        onFinish={formik.handleSubmit}
                        size="large"
                        autoComplete="off"
                      >
                        <div className="row">
                          <div className="col-md-12 col-lg-6">
                            <div className="form-group">
                              <Form.Item
                                name="firstname"
                                label="Firstname"
                                rules={[
                                  {
                                    required: true,
                                    message: "firstname cannot be blank",
                                  },
                                  { whitespace: true },
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
                          <div className="col-md-12 col-lg-6">
                            <div className="form-group">
                              <Form.Item
                                name="lastname"
                                label="Lastname"
                                rules={[
                                  {
                                    required: true,
                                    message: "lastname cannot be blank",
                                  },
                                  { whitespace: true },
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
                          <div className="col-md-12">
                            <div className="form-group flex m-0">
                              <Form.Item
                                name="phoneNumber"
                                label="Phone"
                                className="w-100"
                                style={{ width: "" }}
                                rules={[
                                  {
                                    required: true,
                                    message: "Phone Number cannot be blank",
                                  },
                                  {
                                    message: "Phone is not in correct form",
                                    pattern: /(0|[1-9][0-9]*)$/,
                                  },
                                  {
                                    min: 10,
                                    message: "Phone must be 10-11 numbers",
                                  },
                                  {
                                    max: 11,
                                    message: "Phone must be 10-11 numbers",
                                  },
                                ]}
                                hasFeedback
                                initialValue={profile.phoneNumber}
                              >
                                <Input
                                  style={{ width: "100%", flexGrow: "1" }}
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
                          <div className="col-md-12">
                            <div className="form-group flex m-0">
                              <Form.Item
                                name="address"
                                label="Address"
                                className="w-100"
                                style={{ width: "" }}
                                rules={[]}
                                hasFeedback
                                initialValue={profile.address}
                              >
                                <TextArea
                                  style={{ width: "100%", flexGrow: "1" }}
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
                          <div className="col-md-12">
                            <div className="form-group flex m-0">
                              <Form.Item
                                name="img"
                                label="Image"
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
                                  style={{ width: "100%" }}
                                  name="img"
                                  value={formik.values.img}
                                  onChange={formik.handleChange}
                                  onInput={(e) => {
                                    setPreviewImg(e.target.value);
                                  }}
                                  placeholder="Enter Link Of Image"
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </div>

                        <div className="text-center row">
                          <div className="col-6">
                            <Button type="primary" htmlType="submit">
                              Save
                            </Button>
                          </div>
                          <div className="col-6 flex align-items-center">
                            <Link
                              to={`/profile/${profile.id}`}
                              className="cancel-update-profile-button bg-dark h-100 w-100 flex align-items-center justify-content-center
                    text-decoration-none text-light"
                              style={{ borderRadius: "10px" }}
                            >
                              Cancel
                            </Link>
                          </div>
                          <div
                            className="col-12 mt-4"
                            style={{ fontWeight: "bolder" }}
                          >
                            <h4>
                              Want to change Password?
                              <Link
                                className="mx-2 text-decoration-none"
                                onClick={() => {
                                  setChangePasswordMoniter(true);
                                }}
                              >
                                Click here
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="tab-content p-4 p-md-5 col-lg-9 col-md-12">
                      <div className="tab-pane fade show active w-100">
                        <div className="col-12" style={{ margin: "0 auto" }}>
                          <ChangePassword
                            userEmail={profile.email}
                            userId={profile.id}
                          />
                        </div>
                        <div
                          className="col-12 mt-4 text-center"
                          style={{ fontWeight: "bolder" }}
                        >
                          <h4>
                            <Link
                              className="mx-2 text-decoration-none"
                              onClick={() => {
                                setChangePasswordMoniter(false);
                              }}
                            >
                              Click here
                            </Link>
                            to update other information
                          </h4>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
