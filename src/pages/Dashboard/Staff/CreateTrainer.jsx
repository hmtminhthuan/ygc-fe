import React, { useEffect, useState } from "react";
import { api } from "../../../constants/api";

import "./UpdateTrainee.scss";
export default function CreateTrainer() {
  const [newTrainer, setNewTrainer] = useState({
    firstname: "",
    lastname: "",
    gender: true,
    phoneNumber: "",
    email: "",
    address: "",
  });

  const createTrainer = () => {
    api
      .post("/Account/CreateAccount", newTrainer)
      .then((res) => {
        // Account trainer created successfully
        const createdTrainer = res.data;
        setTrainerList((prevList) => [...prevList, createdTrainer]);
        // history.push("/listtrainers"); // Chuyển hướng về trang danh sách trainers sau khi tạo thành công
      })
      .catch((err) => {
        console.log(err);
        // Xử lý lỗi khi không thể tạo account trainer
      });
  };
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
                      value={newTrainer.firstname}
                      onChange={(e) =>
                        setNewTrainer((prevTrainer) => ({
                          ...prevTrainer,
                          firstname: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>LastName</p>
                    <input
                      type="text"
                      className="form-control"
                      value={newTrainer.lastname}
                      onChange={(e) =>
                        setNewTrainer((prevTrainer) => ({
                          ...prevTrainer,
                          lastname: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>Gender</p>
                    <input
                      type="text"
                      className="form-control"
                      value={newTrainer.gender}
                      onChange={(e) =>
                        setNewTrainer((prevTrainer) => ({
                          ...prevTrainer,
                          gender: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>Phone Number</p>
                    <input
                      type="text"
                      className="form-control"
                      value={newTrainer.phoneNumber}
                      onChange={(e) =>
                        setNewTrainer((prevTrainer) => ({
                          ...prevTrainer,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>Email</p>
                    <input
                      type="text"
                      className="form-control"
                      value={newTrainer.email}
                      onChange={(e) =>
                        setNewTrainer((prevTrainer) => ({
                          ...prevTrainer,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <p>Address</p>
                    <input
                      type="text"
                      className="form-control"
                      value={newTrainer.address}
                      onChange={(e) =>
                        setNewTrainer((prevTrainer) => ({
                          ...prevTrainer,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  className="btn btn-primary mx-2"
                  onClick={createTrainer}
                >
                  Create
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
