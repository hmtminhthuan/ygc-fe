import React from "react";

import "./Login.scss";
import { Link } from "react-router-dom";

import video from "../../assets/video.mp4";

export default function Login() {
  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h2 className="title">Welcome back</h2>
            <p>abcdjlk</p>
          </div>

          <div className="footerDiv flex">
            <span className="text">Don't have account?</span>
            <Link to={"/register"}>
              <button className="btn">Register</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
