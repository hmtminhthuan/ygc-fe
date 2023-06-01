import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../constants/api";
// import { useHistory } from "react-router-dom";
// import "./UpdateTrainee.scss";
export default function UpdateProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState({
    phoneNumber: "",
    address: "",
    img: "",
  });

  useEffect(() => {
    api
      .get("/Account/GetUserProfile", {
        params: { id: id },
      })
      .then((res) => {
        setProfile(res.data[0]);
        setUserInfo({
          phoneNumber: res.data[0].phoneNumber,
          address: res.data[0].address,
          img: res.data[0].img,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send updated profile data to the server
    api
      .put(`/Account/UpdateAccount/${id}`, {
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
        img: userInfo.img,
      })
      .then((res) => {
        console.log(res.data); // Handle success
      })
      .catch((err) => {
        console.log(err); // Handle error
      });
  };

  if (!profile) {
    return null;
  }

  const { phoneNumber, address, img } = userInfo;

  //   const history = useHistory();
  return (
    <div className="update">
      <div className="containerud">
        <h1 className="mt-5 mb-4">Update Trainee's Account</h1>
        <div className="bg-white shadow rounded-lg d-sm-flex">
          <div className="profile-tab-nav">
            <div className="p-4 mt-4">
              <div className="img-circle text-center mb-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK9pIsCYx9Z9wPHyN-qDcqJMUALTYV0phaxw&usqp=CAU"
                  alt="Image"
                  className="shadow"
                />
              </div>
              <h4 className="text-center" style={{}}>
                chaungoctram
              </h4>
              <p className="text-center">Account ID: 1</p>
              <p className="text-center">Level: Beginner</p>
            </div>
          </div>

          <div className="tab-content p-4 p-md-5">
            <div className="tab-pane fade show active">
              <h3 className="mb-4">Account Settings</h3>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <p>Phone</p>
                      <input
                        type="text"
                        className="form-control"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <p>Address</p>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <p>Image</p>
                      <input
                        type="text"
                        className="form-control"
                        name="img"
                        value={img}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button type="submit" className="btn btn-primary mx-2">
                    Update
                  </button>
                  <button className="btn btn-light ">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
