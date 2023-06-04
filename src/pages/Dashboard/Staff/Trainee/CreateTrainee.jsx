import React from "react";
import { api } from "../../../../constants/api";
import { useFormik } from "formik";
import { Form, Input, Select, Button } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./CreateTrainee.scss";

export default function CreateTrainee() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };

  const formik = useFormik({
    initialValues: {
      roleId: 4,
      firstname: "",
      lastname: "",
      gender: true,
      phoneNumber: "",
      email: "",
      address: "",
      password: "",
      deleted: false,
      img: "",
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      api
        .post("/Account/CreateAccount", values)
        .then((res) => {
          // Account trainer created successfully
          const createdTrainee = res.data;
          // Reset the form after successful creation
          resetForm();
          // setSubmitting(false);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Create new trainee successfully!",
            showConfirmButton: true,
            timer: 3500,
          });
        })
        .catch((err) => {
          console.log(err);
          // setSubmitting(false);
        });
    },
  });

  const handleChangeGender = (value) => {
    formik.setFieldValue("gender", value);
  };

  return (
    <div className="create-trainee">
      <div className="containerud">
        <h1 className="mt-4 mb-3 mx-4">Create Trainee's Account</h1>
        <div className="bg-white shadow rounded-lg d-sm-flex">
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
                <div className="row mx-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <Form.Item
                        label="Firstname"
                        name="firstname"
                        rules={[
                          {
                            required: true,
                            message: "Firstname cannot be blank",
                          },
                          { whitespace: true },
                        ]}
                        hasFeedback
                      >
                        <Input
                          name="firstname"
                          value={formik.values.firstname}
                          onChange={formik.handleChange}
                          placeholder="Enter Firstname"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <Form.Item
                        label="Lastname"
                        name="lastname"
                        rules={[
                          {
                            required: true,
                            message: "Lastname cannot be blank",
                          },
                          { whitespace: true },
                        ]}
                        hasFeedback
                      >
                        <Input
                          name="lastname"
                          value={formik.values.lastname}
                          onChange={formik.handleChange}
                          placeholder="Enter Lastname"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[
                          {
                            required: true,
                            message: "Gender must be selected",
                          },
                        ]}
                        hasFeedback
                      >
                        <Select
                          name="gender"
                          width="200px"
                          placeholder="Select Gender"
                          value={formik.values.gender}
                          onChange={handleChangeGender}
                        >
                          <Select.Option value={true}>Male</Select.Option>
                          <Select.Option value={false}>Female</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
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
                      >
                        <Input
                          style={{ width: "100%" }}
                          name="phoneNumber"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          placeholder="Enter Phone Number"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Email cannot be blank",
                          },
                          {
                            type: "email",
                            message: "Email is not in correct form",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          placeholder="Enter Email"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <Form.Item
                        label="Address"
                        name="address"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Address cannot be blank",
                        //   },
                        // ]}
                        // hasFeedback
                      >
                        <Input
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          placeholder="Enter Address (Optional)"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <Form.Item
                        label="Password"
                        name="password"
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
                          name="password"
                          type="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          placeholder="Enter Password"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="text-center row">
                  <div className="col-6">
                    <Button type="primary" htmlType="submit">
                      Create
                    </Button>
                  </div>
                  <div className="col-6 flex align-items-center">
                    <Link
                      to={"/staff/listTrainee"}
                      className="cancel-update-profile-button bg-dark h-100 w-100 flex align-items-center justify-content-center
                    text-decoration-none text-light"
                      style={{ borderRadius: "10px" }}
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </Form>
              {/* <Link to="/dashboard">
                <button className="btn btn-light mx-2">Cancel</button>
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
