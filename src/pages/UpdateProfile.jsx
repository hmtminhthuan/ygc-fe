import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../constants/api";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { Form, Input, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import female from "../assets/images/avt-female.jpg";
import male from "../assets/images/avt-male.jpg";
export default function UpdateProfile() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  const [lastName, setLastname] = useState("");
  const [firstName, setFirstname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [roleName, setRoleName] = useState("");
  const [previewImg, setPreviewImg] = useState("");

  useEffect(() => {
    api
      .get("/Account/GetUserProfile", {
        params: { id: id },
      })
      .then((res) => {
        const userProfile = res.data[0];
        setProfile(userProfile);
        formik.setValues({
          firstname: userProfile.firstName,
          lastname: userProfile.lastName,
          phoneNumber: userProfile.phoneNumber,
          address: userProfile.address,
          img: userProfile.img,
        });
        setLastname(res.data[0].lastName);
        setFirstname(res.data[0].firstName);
        setRoleName(res.data[0].role.name);
        setPhone(res.data[0].phoneNumber);
        setAddress(res.data[0].address);
        if (res.data[0].img == "male" && res.data[0].img == "female") {
          setPreviewImg(res.data[0].img);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
      if (values.img == "") {
        values.img = "female";
        if (profile.gender) {
          values.img = "male";
        }
      }
      api
        .put(`/Account/UpdateAccount?id=${profile.accountID}`, values)
        .then((res) => {
          console.log(res.data);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Update profile successfully!",
            showConfirmButton: true,
            timer: 1000,
          }).then(function () {
            window.location.href = `/profile/${profile.accountID}`;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  if (!profile) {
    return null;
  }

  return (
    <div className="update">
      <div className="containerud">
        <h1 className="mt-5 mb-4">Update User's Account</h1>
        <div className="bg-white shadow rounded-lg d-sm-flex">
          <div className="profile-tab-nav">
            <div className="p-4 mt-4 w-100">
              <div className="img-circle text-center mb-3">
                {profile.img == "male" && previewImg == "" ? (
                  <img src={male} alt="Image" className="shadow" />
                ) : (
                  <></>
                )}
                {profile.img == "female" && previewImg == "" ? (
                  <img src={female} alt="Image" className="shadow" />
                ) : (
                  <></>
                )}
                {previewImg == "" ? (
                  <></>
                ) : (
                  <img src={previewImg} alt="Image" className="shadow" />
                )}
              </div>
              <h4 className="text-center" style={{}}>
                {firstName} {lastName}
              </h4>
              <p className="text-left p-0 m-0 mt-2" style={{}}>
                Phone: {phone}
              </p>
              <p
                className="text-left p-0 m-0 mt-2"
                style={{ maxWidth: "200px" }}
              >
                Address: {address}
              </p>
              {/* <p className="text-center">Account ID: {id}</p>
              <p className="text-center">Role: {roleName}</p> */}
            </div>
          </div>

          <div className="tab-content p-4 p-md-5">
            <div className="tab-pane fade show active">
              {/* <h3 className="mb-4">Account Settings</h3> */}
              <Form
                {...formItemLayout}
                form={formik.form}
                onFinish={formik.handleSubmit}
                size="large"
                autoComplete="off"
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <Form.Item
                        name="firstname"
                        label="Firstname"
                        rules={[
                          {
                            required: true,
                            message: "Firstname cannot be blank",
                          },
                          { whitespace: true },
                        ]}
                        hasFeedback
                        initialValue={profile.firstName}
                      >
                        <Input
                          name="firstname"
                          value={formik.values.firstname}
                          onChange={formik.handleChange}
                          onInput={(e) => {
                            setFirstname(e.target.value);
                          }}
                          placeholder="Enter Firstname"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <Form.Item
                        name="lastname"
                        label="Lastname"
                        rules={[
                          {
                            required: true,
                            message: "Lastname cannot be blank",
                          },
                          { whitespace: true },
                        ]}
                        hasFeedback
                        initialValue={profile.lastName}
                      >
                        <Input
                          name="lastname"
                          value={formik.values.lastname}
                          onChange={formik.handleChange}
                          onInput={(e) => {
                            setLastname(e.target.value);
                          }}
                          placeholder="Enter Lastname"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group flex m-0">
                      <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        className="w-75"
                        style={{ width: "fit-content" }}
                        rules={[
                          {
                            required: true,
                            message: "Phone Number cannot be blank",
                          },
                          {
                            message: "Phone is not in correct form",
                            pattern: /(0|[1-9][0-9]*)$/,
                          },
                          { min: 10, message: "Phone must be 10-11 numbers" },
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
                        className="w-75"
                        style={{ width: "fit-content" }}
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
                        className="w-75"
                        rules={[]}
                        hasFeedback
                        initialValue={
                          !profile.img == "male" && !profile.img == "female"
                            ? profile.img
                            : ""
                        }
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
                      to={`/profile/${profile.accountID}`}
                      className="cancel-update-profile-button bg-dark h-100 w-100 flex align-items-center justify-content-center
                    text-decoration-none text-light"
                      style={{ borderRadius: "10px" }}
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
