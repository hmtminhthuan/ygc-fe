import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
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
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../constants/firebase";
import { stringify, v4 } from "uuid";
import Aos from "aos";
export default function UpdateProfile() {
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState(null);
  localStorage.setItem("MENU_ACTIVE", "/profile");
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
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [changePasswordMoniter, setChangePasswordMoniter] = useState(false);
  const [oldAvatarList, setOldAvatarList] = useState([]);
  let USER = {};
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const [form] = Form.useForm();

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
  const imageListRef = ref(storage, "userImages/");
  useEffect(() => {
    setOldAvatarList([]);
    api
      .get("/Account/GetUserProfile", {
        params: { id: id },
      })
      .then((res) => {
        if (res.data.img != "male" && res.data.img != "female") {
          setPreviewImg(res.data.img);
        }
        setCurrentAvatar(res.data.img);
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
        listAll(imageListRef).then((response) => {
          response.items.forEach((item) => {
            getDownloadURL(item).then((url) => {
              if (
                url.includes(`--userImage--${id.toString()}`) &&
                url != res.data.img
              ) {
                setOldAvatarList((prev) => [...prev, url]);
              }
            });
          });
        });
        if (
          res.data.gender &&
          res.data.img !=
            "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--male.jpg?alt=media&token=b62e9e4f-0e8e-43f9-ae9d-fba29d67d112"
        ) {
          setOldAvatarList((prev) => [
            ...prev,
            "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--male.jpg?alt=media&token=b62e9e4f-0e8e-43f9-ae9d-fba29d67d112",
          ]);
        } else if (
          !res.data.gender &&
          res.data.img !=
            "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--female.jpg?alt=media&token=f58778d6-9193-453b-93e4-ddbab5db5e37"
        ) {
          setOldAvatarList((prev) => [
            ...prev,
            "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--female.jpg?alt=media&token=f58778d6-9193-453b-93e4-ddbab5db5e37",
          ]);
        }
      })
      .catch((err) => {});
    // api.get(`/Account/AccountList`).then((res) => {
    //   res.data.forEach((account) => {
    //     const img = account.gender
    //       ? "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--male.jpg?alt=media&token=b62e9e4f-0e8e-43f9-ae9d-fba29d67d112"
    //       : "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--female.jpg?alt=media&token=f58778d6-9193-453b-93e4-ddbab5db5e37";
    //     api
    //       .put(`/Account/UpdateAccount?id=${account.accountID}`, {
    //         firstname: account.firstName,
    //         lastname: account.lastName,
    //         phoneNumber: account.phoneNumber,
    //         address: account.address,
    //         img: img,
    //       })
    //       .then((res) => {});
    //   });
    // });
  }, [updateDone]);

  const handleUpdateAccount = (values) => {
    api
      .put(`/Account/UpdateAccount?id=${profile.id}`, values)
      .then((res) => {
        setUpdateDone((prev) => prev + 1);
        api
          .get("/Account/AccountList")
          .then((res) => {
            // Swal.close();
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
            setTimeout(() => {
              setImageUpload(null);
              Swal.fire({
                position: "center",
                icon: "success",
                title: `Update Successfully`,
                showConfirmButton: false,
                timer: 900,
              }).finally(() => {
                navigate("/updateProfile");
              });
            }, 300);
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  };

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      phoneNumber: "",
      address: "",
      img: "",
    },
    onSubmit: (values) => {
      Swal.fire({
        title: "Loading...",
        html: "Please wait a few seconds",
        timer: 10000,
        timerProgressBar: false,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
      if (values.img == "") {
        values.img = "female";
        if (profile.gender) {
          values.img = "male";
        }
      }
      if (values.img != "") {
        if (
          imageUpload != null &&
          !(previewImg == "female" || previewImg == "male") &&
          oldAvatarList.filter((item) => item == previewImg).length <= 0 &&
          previewImg !=
            "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--male.jpg?alt=media&token=b62e9e4f-0e8e-43f9-ae9d-fba29d67d112" &&
          previewImg !=
            "https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--female.jpg?alt=media&token=f58778d6-9193-453b-93e4-ddbab5db5e37"
        ) {
          const imageRef = ref(
            storage,
            `userImages/${
              "--userImage--" + id + "--" + imageUpload.name + v4()
            }`
          );
          uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then((url) => {
                values.img = url;
              })
              .finally(() => {
                handleUpdateAccount(values);
              });
          });
        } else {
          values.img = previewImg;
          handleUpdateAccount(values);
        }
      }
    },
  });

  if (!profile) {
    return null;
  }

  Aos.init();
  const setPreviewAvatar = (url) => {
    document.getElementById("avatarImg").src = url;
  };
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
                data-aos="zoom-in-down"
                className="row bg-white shadow rounded-lg d-md-flex justify-content-center mx-lg-5"
                style={{ borderRadius: "15px" }}
              >
                <div className="profile-tab-nav col-lg-3 col-md-12 border-md-0">
                  <div className="p-4 mt-0 w-100 ">
                    <div className="">
                      <NavLink
                        to={`/profile`}
                        className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                        style={{ fontSize: "18px", fontWeight: "500" }}
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span className="mx-2">Back</span>
                      </NavLink>
                    </div>
                    <div
                      className="img-circle text-center mb-2 mt-4"
                      style={{ position: "relative" }}
                    >
                      {profile.img == null ||
                      (profile.img == "male" && previewImg == "") ||
                      previewImg == "male" ? (
                        <img
                          id="avatarImg"
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
                      {(profile.img != null &&
                        profile.img == "female" &&
                        previewImg == "") ||
                      previewImg == "female" ? (
                        <img
                          src={female}
                          id="avatarImg"
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
                          id="avatarImg"
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

                    <div
                      className="text-center m-0 p-0 flex 
                    justify-content-center"
                    >
                      <p
                        className="m-0 p-0 mt-2 px-3 py-1"
                        style={{
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "bolder",
                          width: "fit-content",
                          borderRadius: "20px",
                          color: "#fff",
                          backgroundColor: "#d291bc",
                        }}
                        onClick={() => {
                          if (oldAvatarList.length > 0) {
                            Swal.fire({
                              title: ``,
                              html: `
                              <h3 style="color: #d291bc;">Upload Your New Photo</h3>
                            <div style="text-algin:center; display:flex; justify-content:center">
                            <p
                            id="upload-photo-button"
                        style="
                          cursor: pointer;
                          font-size: 16px;
                          font-weight: bolder;
                          width: fit-content;
                          border-radius: 20px;
                          color: #fff;
                          background-color: #000;
                          padding: 5px 10px;">Upload New Photo</p></div>
                          <b>- - - OR - - -</b><br>
                              <div id="old_photo_container"  style="margin-top:10px; width: 100%">
                              <h3 style="color: #d291bc;">Choose Your Old Photo</h3>
                                <div id="old-photo-area" style="display:flex; justify-content:start;
                                flex-wrap: nowrap; gap: 10px"></div>
                              </div>
                          `,
                              showCancelButton: true,
                              showConfirmButton: false,
                              focusCancel: false,
                              didOpen: () => {
                                const updateButton =
                                  Swal.getHtmlContainer().querySelector(
                                    "p#upload-photo-button"
                                  );
                                updateButton.addEventListener("click", () => {
                                  document.getElementById("imgInp").click();
                                });
                                if (oldAvatarList.length > 0) {
                                  const old_photo_area =
                                    Swal.getHtmlContainer().querySelector(
                                      "div#old-photo-area"
                                    );
                                  let htmlString = "";
                                  oldAvatarList.forEach((url) => {
                                    htmlString += `<img style="width:100px; height:100px; border-radius: 5px;
                                    cursor: pointer" src=${url} 
                                    class="old_img_btn"/>`;
                                  });
                                  old_photo_area.innerHTML = htmlString;
                                  let imageList =
                                    document.getElementsByClassName(
                                      "old_img_btn"
                                    );
                                  for (let i = 0; i < imageList.length; i++) {
                                    imageList[i].addEventListener(
                                      "click",
                                      (e) => {
                                        const url = e.target.src;
                                        Swal.close();
                                        setPreviewAvatar(url);
                                        formik.setFieldValue("img", url);
                                        setPreviewImg(url);
                                      }
                                    );
                                  }
                                } else {
                                  const old_photo_container =
                                    Swal.getHtmlContainer().querySelector(
                                      "div#old_photo_container"
                                    );
                                  old_photo_container.style.display = "none";
                                }
                              },
                              preConfirm: (login) => {},
                              allowOutsideClick: false,
                            }).then((result) => {});
                          } else {
                            document.getElementById("imgInp").click();
                          }
                        }}
                      >
                        <i className="fa-solid fa-image mx-3 ms-0"></i>
                        {imageUpload == null
                          ? "Change Avatar"
                          : "Choose Another Photo"}
                      </p>
                    </div>

                    <div
                      className="flex justify-content-center"
                      style={{
                        gap: "5px",
                        display: `${previewImg != currentAvatar ? "" : "none"}`,
                      }}
                    >
                      {/* <div
                        className="text-center m-0 p-0 flex 
                    justify-content-center"
                      >
                        <p
                          className="m-0 p-0 mt-2 px-3 py-1"
                          style={{
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bolder",
                            width: "fit-content",
                            borderRadius: "20px",
                            color: "#fff",
                            backgroundColor: "#000",
                          }}
                          onClick={formik.handleSubmit}
                        >
                          Save
                        </p>
                      </div> */}
                      <div
                        className="text-center m-0 p-0 flex 
                    justify-content-center"
                      >
                        <p
                          className="m-0 p-0 mt-2 px-3 py-1 bg-black"
                          style={{
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bolder",
                            width: "fit-content",
                            borderRadius: "20px",
                            color: "#fff",
                          }}
                          onClick={() => {
                            setPreviewImg(currentAvatar);
                            avatarImg.src = currentAvatar;
                            setImageUpload(null);
                          }}
                        >
                          Reset Current Avatar
                        </p>
                      </div>
                    </div>
                    <h2
                      className="text-center mt-3"
                      style={{ color: "rgba(210, 145, 188, 1)" }}
                    >
                      {profile.firstname} {profile.lastname}
                    </h2>
                    <h5 className="text-center mt-2" style={{}}>
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
                            <div
                              className="col-md-12 mb-3"
                              style={{ display: "none" }}
                            >
                              <div className="form-group w-100">
                                <div className="row flex align-items-start justify-content-between">
                                  <p className="col-md-3 col-sm-12 p-0 m-0 px-3 mt-2 flex">
                                    <span className="text-danger px-1"></span>
                                    <span>Avatar:</span>
                                  </p>
                                  <div className="col-md-9 col-sm-12">
                                    <Form.Item
                                      name="img"
                                      label=""
                                      className="w-100"
                                      rules={[]}
                                      hasFeedback
                                    >
                                      <Input
                                        style={{
                                          width: "100%",
                                          cursor: "pointer",
                                          display: "none",
                                        }}
                                        name="img"
                                        value={formik.values.img}
                                        placeholder="Select Image"
                                        id="imgInp"
                                        type="file"
                                        onChange={(e) => {
                                          if (
                                            e.target.files[0] != null &&
                                            e.target.files[0] != undefined
                                          ) {
                                            setImageUpload(e.target.files[0]);
                                            const [file] = imgInp.files;
                                            if (
                                              e.target.files &&
                                              e.target.files[0]
                                            ) {
                                              const link =
                                                URL.createObjectURL(file);
                                              document.getElementById(
                                                "avatarImg"
                                              ).src = link;
                                              formik.setFieldValue("img", link);
                                              setPreviewImg(link);
                                            }
                                          }
                                          Swal.close();
                                        }}
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
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
                                <NavLink
                                  className="mx-2 text-decoration-none"
                                  style={{ color: "rgba(210, 145, 188, 1)" }}
                                  onClick={() => {
                                    setChangePasswordMoniter(true);
                                  }}
                                >
                                  Click here
                                </NavLink>
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
                            <NavLink
                              className="text-decoration-none"
                              style={{ color: "rgba(210, 145, 188, 1)" }}
                              onClick={() => {
                                setChangePasswordMoniter(false);
                              }}
                            >
                              Click here {"  "}
                            </NavLink>
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
