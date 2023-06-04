import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./UserProfile.scss";
import video from "../../assets/video.mp4";
import "remixicon/fonts/remixicon.css";
import { api } from "../../constants/api";
import { Link } from "react-router-dom";
import maleImg from "../../assets/images/avt-male.jpg";
import femaleImg from "../../assets/images/avt-female.jpg";
import HeaderHome from "../../component/HeaderHome/HeaderHome";

function UserProfile() {
  const { paramID } = useParams();
  const [profile, setProfile] = useState([]);
  const [accept, setAccept] = useState(false);
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
      USER.accountID.toString().trim() == paramID.toString().trim()
    ) {
      setAccept(true);
    } else {
      window.location.href = "/";
    }
  }

  useEffect(() => {
    api
      .get("/Account/GetUserProfile", {
        params: { id: paramID },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {});
  }, [paramID]);

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
  return (
    <>
      {accept ? (
        <>
          <div
            className="w-100 bg-light bg-opacity-75"
            style={{
              height: "55px",
              position: "fixed",
              zIndex: "100",
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
            <div className="padding mx-5 mt-5">
              <div className="row container d-flex justify-content-center">
                <div className="col-xl-6 col-md-12">
                  <div className="card user-card-full">
                    <div className="row m-l-0 m-r-0">
                      <div className="col-sm-4 bg-c-lite-green user-profile">
                        <div className="card-block text-center">
                          <div className="m-b-25">
                            {profile.img == "male" ? (
                              <img
                                src={maleImg}
                                alt="Image"
                                className="shadow img-user-profile"
                                style={{ borderRadius: "50%" }}
                              />
                            ) : (
                              <></>
                            )}
                            {profile.img == "female" ? (
                              <img
                                src={femaleImg}
                                alt="Image"
                                className="shadow img-user-profile"
                                style={{ borderRadius: "50%" }}
                              />
                            ) : (
                              <></>
                            )}
                            {profile.img != "" &&
                            profile.img != "male" &&
                            profile.img != "female" ? (
                              <img
                                src={profile.img}
                                alt="Image"
                                className="shadow img-user-profile"
                                style={{ borderRadius: "50%" }}
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
                          <div className="icon mt-3 text-center justify-content-center">
                            {/* <div className=" col-md-6 p-0">
                              <Link to={"/"} className="home">
                                <i className="ri-home-4-line mt-5 "></i>
                                <span className="px-2">Home</span>
                              </Link>
                            </div> */}
                            <div className="p-0">
                              <Link
                                to={`/updateProfile/${id}`}
                                className="updateInfo"
                              >
                                <i className="ri-edit-2-line mt-2 "></i>
                                {/* <span className="px-2">Update</span> */}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-8 align-items-center my-5">
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
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default UserProfile;