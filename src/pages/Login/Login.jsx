import React from "react";

import "./Login.scss";
// import "../../App.scss";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
// import axios from "axios";

import video from "../../assets/video.mp4";

export default function Login() {
  // const [phoneNumber, setPhone] = useState("");
  // const [password, setPassword] = useState("");

  // const loginUser = () => {
  //   const response = axios.post("http://localhost:5000/Account/CheckLogin", {
  //     phoneNumber: phoneNumber,
  //     password: password,
  //   });
  //   if (response.status === 200) {
  //     window.location.href = "/";
  //   }
  // };
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
                    required
                  />
                  <label>Password</label>
                </div>

                <input
                  onclick="handleRegister()"
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
