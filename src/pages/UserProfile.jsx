import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./UserProfile.scss";
import video from "../assets/video.mp4";
import "remixicon/fonts/remixicon.css";
import { api } from "../constants/api";
import { Link } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    api
      .get("/Account/GetUserProfile", {
        params: { id: id },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (profile === null || profile[0] == null || profile[0] == undefined) {
    return null;
  }

  let {
    firstName,
    lastName,
    gender,
    email,
    phoneNumber,
    address,
    role,
    ...restParams
  } = profile[0];

  let roleColor = "";
  if (role.name === "Admin") {
    roleColor = "text-red";
  } else if (role.name === "Staff") {
    roleColor = "text-orange";
  } else if (role.name === "Trainer") {
    roleColor = "text-blue";
  } else if (role.name === "Trainee") {
    roleColor = "text-green";
  }
  return (
    <div className="page-content page-container " id="page-content">
      <div className="video-background">
        <video src={video} autoPlay muted loop></video>
      </div>
      <div className="padding">
        <div className="row container d-flex justify-content-center">
          <div className="col-xl-6 col-md-12">
            <div className="card user-card-full ">
              <div className="row m-l-0 m-r-0 ">
                <div className="col-sm-4 bg-c-lite-green user-profile">
                  <div className="card-block text-center">
                    <div className="m-b-25">
                      <img
                        src="https://img.icons8.com/bubbles/100/000000/user.png"
                        className="img-radius"
                        alt="User-Profile-Image"
                      />
                    </div>
                    <h6 className="f-w-600" style={{ fontSize: "25px" }}>
                      {firstName} {lastName}
                    </h6>
                    <p
                      className={`${roleColor}`}
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      Role: {role.name}
                    </p>
                    <div className="icon mt-3">
                      <Link to={"/"} className="home">
                        <i className="ri-home-4-line mt-5 mx-3 "></i>
                      </Link>

                      <Link
                        to={`/updateProfile/${profile.id}`}
                        className="updateInfo"
                      >
                        <i className="ri-edit-2-line mt-5  mx-3 "></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block my-2 mx-4">
                    <h6
                      className="m-b-20 p-b-5 b-b-default f-w-600"
                      style={{ color: "rgba(210, 145, 188, 1)" }}
                    >
                      INFORMATION
                    </h6>
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
                        <h6 className="text-muted f-w-400">{phoneNumber}</h6>
                      </div>

                      <div className="col-sm-6 mb-3">
                        <p className="m-b-10 f-w-600">Address</p>
                        <h6 className="text-muted f-w-400">{address}</h6>
                      </div>
                    </div>
                    <h6
                      className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600"
                      style={{ color: "rgba(210, 145, 188, 1)" }}
                    >
                      COURSE
                    </h6>
                    <div className="row">
                      <div className="col-sm-6 mb-3">
                        <p className="m-b-10 f-w-600">Course name current</p>
                        <h6 className="text-muted f-w-400">none</h6>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <p className="m-b-10 f-w-600">Class</p>
                        <h6 className="text-muted f-w-400">none</h6>
                      </div>
                      <div className="col-sm-6 ">
                        <p className="m-b-10 f-w-600">Level</p>
                        <h6 className="text-muted f-w-400">none</h6>
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
  );
}

export default UserProfile;
