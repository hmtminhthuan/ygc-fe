import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import maleImg from "../../assets/images/avt-male.jpg";
import femaleImg from "../../assets/images/avt-female.jpg";
import { useNavigate } from "react-router-dom";
import "./HeaderStaff.scss";
export default function HeaderStaff({ background, ...restParams }) {
  const navigate = useNavigate();
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const USER = JSON.parse(USER_LOGIN);

  return (
    <section className="headerdb p-0">
      <div className="logo mt-2">
        <h2 style={{ cursor: "pointer" }}>
          <i className="ri-menu-line icon icon-0 menu mx-2" />
        </h2>
        <h2
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={logo} />
          Yoga<span>Center</span>
        </h2>
      </div>
      <div
        style={{
          cursor: "pointer",
        }}
        className="search--notification--profile flex justify-content-end"
      >
        <div className="notification--profile">
          <div
            className="picon bell text-warning py-1"
            style={{
              fontSize: "20px",
              transform: "scaleX(1.2)",
              position: "relative",
            }}
          >
            <i className="ri-notification-2-line" />
          </div>

          <div className="picon profile">
            {USER.img == "male" ? (
              <img
                src={maleImg}
                alt="Image"
                className="shadow img-user-profile"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <></>
            )}
            {USER.img == "female" ? (
              <img
                src={femaleImg}
                alt="Image"
                className="shadow img-user-profile"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <></>
            )}
            {USER.img != "" && USER.img != "male" && USER.img != "female" ? (
              <img
                src={USER.img}
                alt="Image"
                className="shadow img-user-profile"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="px-2 flex align-items-center">
            <h5
              className="p-0 px-3 m-0"
              style={{
                fontWeight: "800",
                transform: "scale(1.3)",
                color: "rgb(227,106,200)",
              }}
            >{`${USER.firstName} ${USER.lastName}`}</h5>
          </div>
        </div>
      </div>
    </section>
  );
}
