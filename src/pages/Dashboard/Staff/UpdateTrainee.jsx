import React, { useEffect, useState } from "react";
import { api } from "../../../constants/api";
// import { useHistory } from "react-router-dom";
import "./UpdateTrainee.scss";
export default function UpdateTrainee() {
  const [traineeInfo, setTraineeInfo] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    address: "",
    // course: "",
    // class: "",
  });

  useEffect(() => {
    // Fetch the trainee's information and populate the form fields
    api
      .get("/Account/AccountListByRole?id=4")
      .then((res) => {
        const trainee = res.data.find((trainee) => trainee.accountID === 18); // Change the accountID accordingly
        const { firstName, lastName, gender, phoneNumber, email, address } =
          trainee;
        setTraineeInfo({
          firstName,
          lastName,
          gender: gender ? "male" : "female",
          phoneNumber,
          email,
          address,
          // course: "", // Replace with the appropriate course value
          // class: "", // Replace with the appropriate class value
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTraineeInfo((prevTraineeInfo) => ({
      ...prevTraineeInfo,
      [name]: value,
    }));
  };

  const handleUpdateTrainee = () => {
    api
      .put("/Account/UpdateAccount", traineeInfo)
      .then(() => {
        console.log("Trainee updated successfully.");
        // history.push("/listTrainee");
        // Perform any necessary actions after successful update
      })
      .catch((error) => {
        console.log("Failed to update trainee. Please try again.");
        console.log(error);
      });
  };
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
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <p>FirstName</p>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={traineeInfo.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>LastName</p>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={traineeInfo.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>Gender</p>
                    <input
                      type="text"
                      className="form-control"
                      name="gender"
                      value={traineeInfo.gender}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>Phone Number</p>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNumber"
                      value={traineeInfo.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>Email</p>
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      value={traineeInfo.email}
                      onChange={handleInputChange}
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
                      value={traineeInfo.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <div className="form-group">
                    <p>Course</p>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>Class</p>
                    <input type="text" className="form-control" />
                  </div>
                </div> */}
              </div>

              <div>
                <button
                  className="btn btn-primary mx-2"
                  onClick={handleUpdateTrainee}
                >
                  Update
                </button>
                <button className="btn btn-light ">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
