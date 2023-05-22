import React, { useState } from "react";
import axios from "axios";
import "./Register.scss";
// import "../../App.scss";
import { Link } from "react-router-dom";
// import axios from "axios";

import video from "../../assets/video.mp4";

export default function Register() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/Account/TraineeRegister",
        {
          firstname,
          lastname,
          gender,
          email,
          phoneNumber,
          password,
        }
      );
      console.log(response.data);
      // Xử lý đăng ký thành công ở đây
    } catch (error) {
      console.error(error);
      // Xử lý lỗi ở đây
    }
  };

  return (
    <main>
      <div className="box">
        <div className="inner-box">
          <div className="container flex">
            <form className="form">
              <div className="heading">
                <h2>Get Started</h2>
              </div>

              <div className="actual-form">
                <div className="input-wrap">
                  <input
                    id="firstname"
                    type="text"
                    minlength="4"
                    className="input-field"
                    autocomplete="off"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <label>FirstName</label>
                </div>

                <div className="input-wrap">
                  <input
                    id="lastname"
                    type="text"
                    minlength="4"
                    className="input-field"
                    autocomplete="off"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                  <label>LastName</label>
                </div>

                <div className="input-wrap">
                  <p>Gender</p>
                  <div className="gender">
                    <input
                      id="gender-male"
                      type="radio"
                      name="gender"
                      value="0"
                      checked={gender === "0"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Male
                    <input
                      id="gender-female"
                      type="radio"
                      name="gender"
                      value="1"
                      checked={gender === "1"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Female
                  </div>
                </div>

                <div className="input-wrap">
                  <input
                    id="email"
                    type="email"
                    className="input-field"
                    autocomplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label>Email</label>
                </div>

                <div className="input-wrap">
                  <input
                    id="phoneNumber"
                    type="text"
                    minlength="10"
                    maxlength="11"
                    className="input-field"
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
                    className="input-field"
                    autocomplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label>Password</label>
                </div>

                <input
                  onClick={handleRegister}
                  type="button"
                  value="Sign Up"
                  className="sign-btn"
                />
              </div>
              <a href="/">Home</a>
            </form>

            <div className="videoDiv">
              <video src={video} autoPlay muted loop></video>

              <div className="textDiv">
                <h2 className="title">Yogacenter</h2>
                <p>Do Yoga today for a better tomorrow</p>
              </div>

              <div className="footerDiv flex">
                <span className="text">Have already an account?</span>
                <Link to={"/login"}>
                  <button className="btn flex">Log In</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
