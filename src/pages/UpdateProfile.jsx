import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../constants/api";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { Form, Input, Button } from "antd";
// import { useHistory } from "react-router-dom";
// import "./UpdateTrainee.scss";
export default function UpdateProfile() {
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 9 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  // const [userInfo, setUserInfo] = useState({
  //   phoneNumber: "",
  //   address: "",
  //   img: "",
  // });

  const [lastName, setLastname] = useState("");
  const [firstName, setFirstname] = useState("");
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    api
      .get("/Account/GetUserProfile", {
        params: { id: id },
      })
      .then((res) => {
        // setProfile(res.data[0]);
        const userProfile = res.data[0];
        setProfile(userProfile);
        // setUserInfo({
        //   phoneNumber: res.data[0].phoneNumber,
        //   address: res.data[0].address,
        //   img: res.data[0].img,
        // });
        formik.setValues({
          phoneNumber: userProfile.phoneNumber,
          address: userProfile.address,
          img: userProfile.img,
        });

        setLastname(res.data[0].lastName);
        setFirstname(res.data[0].firstName);
        setRoleName(res.data[0].role.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // const handleChange = (e) => {
  //   setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Send updated profile data to the server
  //   api
  //     .put(`/Account/UpdateAccount/${id}`, {
  //       // phoneNumber: userInfo.phoneNumber,
  //       // address: userInfo.address,
  //       // img: userInfo.img,
  //       profile: {
  //         phoneNumber: userInfo.phoneNumber,
  //         address: userInfo.address,
  //         img: userInfo.img,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //       Swal.fire({
  //         position: "center",
  //         icon: "success",
  //         title: "Update successfully!",
  //         showConfirmButton: true,
  //         timer: 3500,
  //       }); // Handle success
  //     })
  //     .catch((err) => {
  //       console.log(err); // Handle error
  //     });
  // };

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      address: "",
      img: "",
    },
    onSubmit: (values) => {
      api
        .put(`/Account/UpdateAccount/${id}`, {
          profile: {
            phoneNumber: values.phoneNumber,
            address: values.address,
            img: values.img,
          },
        })
        .then((res) => {
          console.log(res.data);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Update successfully!",
            showConfirmButton: true,
            timer: 3500,
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

  // const { phoneNumber, address, img } = userInfo;

  //   const history = useHistory();
  return (
    <div className="update">
      <div className="containerud">
        <h1 className="mt-5 mb-4">Update User's Account</h1>
        <div className="bg-white shadow rounded-lg d-sm-flex">
          <div className="profile-tab-nav">
            <div className="p-4 mt-4">
              <div className="img-circle text-center mb-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK9pIsCYx9Z9wPHyN-qDcqJMUALTYV0phaxw&usqp=CAU"
                  alt="Image"
                  className="shadow"
                />
              </div>
              <h4 className="text-center" style={{}}>
                {firstName} {lastName}
              </h4>
              <p className="text-center">Account ID: {id}</p>
              <p className="text-center">Role: {roleName}</p>
            </div>
          </div>

          <div className="tab-content p-4 p-md-5">
            <div className="tab-pane fade show active">
              <h3 className="mb-4">Account Settings</h3>
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
                      <Form.Item label="Phone Number">
                        <Input
                          name="phoneNumber"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <Form.Item label="Address">
                        <Input
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <Form.Item label="Image URL">
                        <Input
                          name="img"
                          value={formik.values.img}
                          onChange={formik.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                  {/* <button className="btn btn-light ">Cancel</button> */}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
