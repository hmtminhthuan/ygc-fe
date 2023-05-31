import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./UserProfile.scss";
import video from "../assets/video.mp4";
import "remixicon/fonts/remixicon.css";
import { api } from "../constants/api";

function UserProfile() {
  const param = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/Account/GetUserProfile", {
        params: { id: param.id },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [param.id]);
  if (profile === null) {
    return null; // Render loading state or handle the case when blogDetail is not available yet
  }

  let {
    firstName,
    lastName,
    gender,
    email,
    phoneNumber,
    address,
    ...restParams
  } = profile;
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
                  <div className="card-block text-center text-grey">
                    <div className="m-b-25">
                      <img
                        src="https://img.icons8.com/bubbles/100/000000/user.png"
                        className="img-radius"
                        alt="User-Profile-Image"
                      />
                    </div>
                    <h6 className="f-w-600">
                      {profile.firstName} {profile.lastName}
                    </h6>
                    <p>Role: {profile.role.name} </p>
                    <div className="icon mt-3">
                      <i className="ri-home-4-line mt-5 mx-3 "></i>
                      <i className="ri-edit-2-line mt-5  mx-3 "></i>
                    </div>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block my-2 mx-4">
                    <h6 className="m-b-20 p-b-5 b-b-default f-w-600">
                      Information
                    </h6>
                    <div className="row">
                      <div className="col-sm-6 mb-3">
                        <p className="m-b-10 f-w-600">Gender</p>
                        <h6 className="text-muted f-w-400">
                          {profile.gender ? "Male" : "Female"}
                        </h6>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <p className="m-b-10 f-w-600">Email</p>
                        <h6 className="text-muted f-w-400">{profile.email}</h6>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <p className="m-b-10 f-w-600">Phone</p>
                        <h6 className="text-muted f-w-400">
                          {profile.phoneNumber}
                        </h6>
                      </div>

                      <div className="col-sm-6 mb-3">
                        <p className="m-b-10 f-w-600">Address</p>
                        <h6 className="text-muted f-w-400">
                          {profile.address}
                        </h6>
                      </div>
                    </div>
                    <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">
                      Course
                    </h6>
                    <div className="row">
                      <div className="col-sm-6 mb-3">
                        <p className="m-b-10 f-w-600">Course name current</p>
                        <h6 className="text-muted f-w-400">Sam Disuja</h6>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <p className="m-b-10 f-w-600">Class</p>
                        <h6 className="text-muted f-w-400">Dinoter husainm</h6>
                      </div>
                      <div className="col-sm-6 ">
                        <p className="m-b-10 f-w-600">Level</p>
                        <h6 className="text-muted f-w-400">Dinoter husainm</h6>
                      </div>
                    </div>
                    <ul className="social-link list-unstyled m-t-40 m-b-10">
                      <li>
                        <a
                          href="#!"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title=""
                          data-original-title="facebook"
                          data-abc="true"
                        >
                          <i
                            className="mdi mdi-facebook feather icon-facebook facebook"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#!"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title=""
                          data-original-title="twitter"
                          data-abc="true"
                        >
                          <i
                            className="mdi mdi-twitter feather icon-twitter twitter"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#!"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title=""
                          data-original-title="instagram"
                          data-abc="true"
                        >
                          <i
                            className="mdi mdi-instagram feather icon-instagram instagram"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                    </ul>
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
