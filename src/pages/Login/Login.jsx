import React, { useState } from "react";

import "./Login.scss";
import "../../App.scss";
import { Link } from "react-router-dom";
import axios from "axios";

import video from "../../assets/video.mp4";

export default function Login() {
  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = () => {
    const response = axios.post("http://localhost:5000/Account/CheckLogin", {
      phoneNumber: phoneNumber,
      password: password,
    });
    if (response.status === 200) {
      window.location.href = "/";
    }
  };
  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h2 className="title">Yogacenter</h2>
            <p>abcdjlk</p>
          </div>

          <div className="footerDiv flex">
            <span className="text">Don't have account?</span>
            <Link to={"/register"}>
              <button className="btn flex">Register</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src="" alt="" />
            <h3>Welcome Back!</h3>
          </div>

          <form className="form grid">
            {/* <span className="showMessage">Login Status will go here</span> */}

            <div className="inputDiv">
              <label htmlFor="phoneNumber">Phone</label>
              <div className="input flex">
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Phone"
                  onChange={(event) => {
                    setPhone(event.target.value);
                  }}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <input
                  type="text"
                  id="password"
                  placeholder="Password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>
            </div>

            <button type="button" className="btn flex" onClick={loginUser}>
              <span>Login</span>
            </button>

            <span className="forgotPassword">
              Forgot your password? <a href="">Click Here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
