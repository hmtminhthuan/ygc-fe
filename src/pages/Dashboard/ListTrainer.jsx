import React, { useEffect, useState } from "react";
import { api } from "../../constants/api";
import { Select } from "antd";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "./ListTrainee.scss";
export default function ListTrainer() {
  const [trainerList, setTrainerList] = useState([]);
  const [sortedTrainers, setSortedTrainers] = useState([]);
  const [firstNameSort, setfirstNameSort] = useState("All");
  const [genderSort, setgenderSort] = useState("All");

  useEffect(() => {
    api
      .get("/Account/AccountListByRole?id=3")
      .then((res) => {
        setTrainerList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    let sortedTrainers = [...trainerList];

    switch (genderSort) {
      case "all":
        sortedTrainers = [...trainerList];
        break;
      case "male":
        sortedTrainers = sortedTrainers.filter(
          (trainer) => trainer.gender === "Male"
        );
        break;
      case "female":
        sortedTrainers = sortedTrainers.filter(
          (trainer) => trainer.gender === "Female"
        );
        break;
    }

    switch (firstNameSort) {
      case "all":
        sortedTrainers = [...trainerList];
        break;
      case "asc":
        sortedTrainers = sortedTrainers.sort((a, b) =>
          a.firstName.localeCompare(b.firstName, { sensitivity: "base" })
        );
        break;
      case "desc":
        sortedTrainers = sortedTrainers.sort((a, b) =>
          b.firstName.localeCompare(a.firstName, { sensitivity: "base" })
        );
        break;
    }

    setSortedTrainers(sortedTrainers);
  }, [firstNameSort, genderSort]);

  const [sortOrder, setSortOrder] = useState("");

  return (
    <div className="row flex trainee-containe mt-3 mx-5">
      <div className="headerlist mb-3">
        <h1>
          <i className="ri-bookmark-line"></i> List Trainers
        </h1>
      </div>
      {/* Sort by firstname */}
      <div className="col-lg-4 col-md-12 flex justify-content-center mb-2">
        <h4 className="p-0 m-0 py-2 p-0 text-end px-2">Sort by FirstName</h4>
        <div className="w-50">
          <Select
            className="w-100 text-dark"
            name="firstname"
            value={firstNameSort}
            onChange={(value) => {
              setfirstNameSort(value);
            }}
          >
            <Select.Option value="asc">A - Z</Select.Option>
            <Select.Option value="desc">Z - A</Select.Option>
            <Select.Option value="all">All</Select.Option>
          </Select>
        </div>
      </div>

      {/* Sort by gender */}
      <div className="col-lg-4 col-md-12 flex justify-content-center mb-2">
        <h4 className="p-0 m-0 py-2 p-0 text-end px-2">Sort by Gender</h4>
        <div className="w-50">
          <Select
            className="w-100 text-dark"
            name="gender"
            value={genderSort}
            onChange={(value) => {
              setgenderSort(value);
            }}
          >
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="all">All</Select.Option>
          </Select>
        </div>
      </div>
      <div className="trainee">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Course</th>
              <th>Class</th>
              <th>
                <button className="btn-home px-3 pt-2 pb-2 justify-content-center">
                  <i className="ri-home-2-fill"></i>
                  <Link to={"/dashboard"} className="exit-list">
                    Home
                  </Link>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTrainers.map((trainer) => (
              <tr key={trainer.accountID}>
                <td>{`${trainer.firstName}`}</td>
                <td>{`${trainer.lastName}`}</td>
                <td>{`${trainer.gender ? "Male" : "Female"}`}</td>
                <td>{`${trainer.phoneNumber}`}</td>
                <td>{`${trainer.email}`}</td>
                <td>{`${trainer.address}`}</td>
                <td></td>
                <td></td>
                <td className="setting">
                  <i className="ri-edit-2-fill mx-2"></i>
                  <i className="ri-delete-bin-line mx-2"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
