import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./UserProfile.scss";
import video from "../../assets/video.mp4";
import "remixicon/fonts/remixicon.css";
import { api } from "../../constants/api";
import { useNavigate, NavLink } from "react-router-dom";
import maleImg from "../../assets/images/avt-male.jpg";
import femaleImg from "../../assets/images/avt-female.jpg";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Aos from "aos";

function UserProfile() {
  localStorage.setItem("MENU_ACTIVE", "/profile");
  // const { paramID } = useParams();
  const paramID = JSON.parse(localStorage.getItem("USER_LOGIN")).accountID;
  const [profile, setProfile] = useState([]);
  const [linkImg, setLinkImg] = useState("");
  const [accept, setAccept] = useState(false);
  let USER = {};
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const navigate = useNavigate();

  useEffect(() => {
    if (!(USER_LOGIN != null && !accept)) {
      if (!accept) {
        navigate("/");
      }
    } else {
      USER = JSON.parse(USER_LOGIN);
      if (
        USER.accountID != null &&
        USER.accountID != undefined &&
        USER.accountID.toString().trim() == paramID.toString().trim()
      ) {
        let timerInterval;
        Swal.fire({
          title: "Loading...",
          timer: 1500,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            setAccept(true);
            clearInterval(timerInterval);
          },
        });
      } else {
        navigate("/");
      }
    }
    api
      .get("/Account/GetUserProfile", {
        params: { id: paramID },
      })
      .then((res) => {
        setLinkImg(res.data.img);
        setProfile(res.data);
      })
      .catch((err) => {});
  }, []);

  if (profile === null) {
    return null;
  }

  let {
    id,
    firstname,
    lastname,
    gender,
    email,
    phoneNumber,
    address,
    roleId,
    ...restParams
  } = profile;

  let roleColor = "";
  if (roleId == 1) {
    roleColor = "text-red";
  } else if (roleId == 2) {
    roleColor = "text-orange";
  } else if (roleId == 3) {
    roleColor = "text-blue";
  } else if (roleId == 4) {
    roleColor = "text-green";
  }

  Aos.init();

  return (
    <>
      <>
        <div
          className="w-100"
          style={{
            height: "53px",
            position: "fixed",
            zIndex: "100",
            backgroundColor: "rgb(248,249,250,0.9)",
          }}
        >
          <HeaderHome />
        </div>
        <div
          className="page-content page-container scroll-user-profile"
          id="page-content"
          style={{ height: "100vh" }}
        >
          <div className="video-background">
            <video src={video} autoPlay muted loop></video>
          </div>
          {accept ? (
            <div className="padding mx-5 mt-5" data-aos="zoom-in-down">
              <div className="row container d-flex justify-content-center">
                <div className="col-xl-6 col-md-12 mt-md-4">
                  <div className="card user-card-full mt-md-4">
                    <div className="row m-l-0 m-r-0">
                      <div className=" col-md-4 bg-c-lite-green user-profile">
                        <div className="card-block text-center">
                          <div className="m-b-25">
                            {linkImg == "male" ? (
                              <img
                                src={maleImg}
                                alt="Image"
                                className="shadow img-user-profile"
                                style={{
                                  borderRadius: "50%",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            ) : (
                              <></>
                            )}
                            {linkImg == "female" ? (
                              <img
                                src={femaleImg}
                                alt="Image"
                                className="shadow img-user-profile"
                                style={{
                                  borderRadius: "50%",
                                  width: "130px",
                                  height: "130px",
                                }}
                              />
                            ) : (
                              <></>
                            )}
                            {linkImg != "" &&
                            linkImg != "male" &&
                            linkImg != "female" ? (
                              <img
                                src={profile.img}
                                alt="Image"
                                className="shadow img-user-profile"
                                style={{
                                  borderRadius: "50%",
                                  width: "120px",
                                  height: "120px",
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                          <h6 className="f-w-600" style={{ fontSize: "20px" }}>
                            {firstname} {lastname}
                          </h6>
                          <p
                            className={`${roleColor}`}
                            style={{ fontSize: "16px" }}
                          >
                            UserID: {id}
                          </p>
                          <div className="iconp-0 m-0 mt-3 text-center flex justify-content-center">
                            <NavLink
                              to={`/updateProfile`}
                              className="updateInfo text-light px-1"
                            >
                              {" "}
                              <div
                                className="p-0 m-0 px-3 py-1 update-button-area bg-black text-light border-0"
                                style={{
                                  width: "fit-content",
                                  borderRadius: "20px",
                                }}
                              >
                                <span
                                  className="m-0 p-0"
                                  style={{ fontSize: "14px" }}
                                >
                                  Update
                                </span>{" "}
                                <i
                                  className="fa-solid fa-pen-to-square mx-0 px-0 mt-2 ms-2  text-light"
                                  style={{ fontSize: "14px" }}
                                ></i>
                              </div>
                            </NavLink>
                          </div>
                        </div>
                      </div>
                      <div className=" col-md-8 align-items-center my-5">
                        <div className="card-block my-2 mx-4 align-items-center">
                          <h5
                            className="m-b-20 p-b-5 b-b-default f-w-600"
                            style={{ color: "rgba(210, 145, 188, 1)" }}
                          >
                            INFORMATION
                          </h5>
                          <div className="row">
                            <div className="col-sm-6 mb-3">
                              <p className="m-b-10 f-w-600">Gender</p>
                              <h6 className="text-muted f-w-400">
                                {gender ? "Male" : "Female"}
                              </h6>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <p className="m-b-10 f-w-600">Email</p>
                              <h6 className="text-muted f-w-400">{email}</h6>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <p className="m-b-10 f-w-600">Phone</p>
                              <h6 className="text-muted f-w-400">
                                {phoneNumber}
                              </h6>
                            </div>

                            <div className="col-sm-6 mb-3">
                              <p className="m-b-10 f-w-600">Address</p>
                              <h6 className="text-muted f-w-400">{address}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </>
    </>
  );
}

export default UserProfile;
