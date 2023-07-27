import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import maleImg from "../../assets/images/avt-male.jpg";
import femaleImg from "../../assets/images/avt-female.jpg";
import { NavLink, useNavigate } from "react-router-dom";
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
        className="search--notification--profile 
        flex justify-content-end"
      >
        <div className="notification--profile">
          <div>
            <NavLink
              to="/"
              className="text-decoration-none py-2 px-2"
              style={{
                borderRadius: "20px",
                backgroundColor: "#ec88ad",
              }}
            >
              <span className="icon icon-4">
                <i className="fa-solid fa-house" style={{ color: "#fff" }}></i>{" "}
              </span>
              <span
                className="sidebar--item ms-1"
                style={{ color: "#fff", fontWeight: "bolder" }}
              >
                Home
              </span>
            </NavLink>
          </div>
          <div
            className="picon profile"
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/profile");
            }}
          >
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
              className="p-0 px-3 m-0 ms-2"
              style={{
                fontWeight: "800",
                transform: "scale(1.3)",
                color: "#ec88ad",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/profile");
              }}
            >{`${USER.firstName} ${USER.lastName}`}</h5>
          </div>
          <div className="flex">
            <NavLink
              className="text-decoration-none py-1 px-2 ms-1"
              style={{
                borderRadius: "5px",
                backgroundColor: "#ec88ad",
              }}
              to="/"
              onClick={() => {
                localStorage.removeItem("USER_LOGIN");
                localStorage.removeItem("MENU_ACTIVE");
                navigate("/");
              }}
            >
              <span className="icon icon-7">
                <i
                  className="ri-logout-box-r-line text-light"
                  style={{ fontWeight: "bolder" }}
                />
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
