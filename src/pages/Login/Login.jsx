import React, { useState } from "react";
import axios from "axios";
import "./Login.scss";
// import "../../App.scss";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

import video from "../../assets/video.mp4";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/Account/CheckLogin",
        {
          phoneNumber,
          password,
        }
      );
      console.log(response.data);
      // Xử lý đăng ký thành công ở đây

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Log in successfully!",
        showConfirmButton: true,
        timer: 1500,
      }).then(function () {
        window.location.href = "/";
      });
    } catch (error) {
      console.error(error);
      // Xử lý lỗi ở đây
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  };
  return (
    <main>
      <div className="box">
        <div className="inner-box">
          <div className="container flex">
            <div className="videoDiv">
              <video src={video} autoPlay muted loop></video>

              <div className="textDiv">
                <h2 className="title">YogaCenter</h2>
                <p>Do Yoga today for a better tomorrow</p>
              </div>

              <div className="footerDiv flex">
                <span className="text">Don't have account?</span>
                <Link to={"/register"}>
                  <button className="btn flex">Register</button>
                </Link>
              </div>
            </div>

            <form className="form">
              <div className="heading">
                <h2>Welcome Back!</h2>
              </div>

              <div>
                <div className="input-wrap">
                  <input
                    id="phoneNumber"
                    type="text"
                    minlength="10"
                    maxlength="11"
                    className="inputfield"
                    autocomplete="off"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <label>Phone</label>
                </div>

                <div className="input-wrap">
                  <input
                    id="password"
                    type="password"
                    minlength="6"
                    className="inputfield"
                    autocomplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label>Password</label>
                </div>

                <input
                  onClick={handleLogin}
                  type="button"
                  value="Sign Up"
                  className="sign-btn"
                />

                <a href="/">Home</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
