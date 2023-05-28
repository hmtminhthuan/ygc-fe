import React, { useEffect, useState } from "react";
import { api } from "../../constants/api";
import { Select } from "antd";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "./ListTrainee.scss";
export default function ListTrainee() {
  const [traineeList, setTraineeList] = useState([]);
  const [sortedTrainees, setSortedTrainees] = useState([]);
  const [firstNameSort, setfirstNameSort] = useState("All");
  const [genderSort, setgenderSort] = useState("All");

  useEffect(() => {
    api
      .get("/Account/AccountListByRole?id=4")
      .then((res) => {
        setTraineeList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    let sortedTrainees = [...traineeList];

    switch (genderSort) {
      case "all":
        sortedTrainees = [...traineeList];
        break;
      case "male":
        sortedTrainees = sortedTrainees.filter(
          (trainee) => trainee.gender === "Male"
        );
        break;
      case "female":
        sortedTrainees = sortedTrainees.filter(
          (trainee) => trainee.gender === "Female"
        );
        break;
    }

    switch (firstNameSort) {
      case "all":
        sortedTrainees = [...traineeList];
        break;
      case "asc":
        sortedTrainees = sortedTrainees.sort((a, b) =>
          a.firstName.localeCompare(b.firstName, { sensitivity: "base" })
        );
        break;
      case "desc":
        sortedTrainees = sortedTrainees.sort((a, b) =>
          b.firstName.localeCompare(a.firstName, { sensitivity: "base" })
        );
        break;
    }

    setSortedTrainees(sortedTrainees);
  }, [firstNameSort, genderSort]);

  const [sortOrder, setSortOrder] = useState("");

  return (
    <div className="row flex trainee-containe mt-3 mx-5">
      <div className="headerlist mb-3">
        <h1>
          <i className="ri-bookmark-line"></i> List Trainees
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
            {sortedTrainees.map((trainee) => (
              <tr key={trainee.accountID}>
                <td>{`${trainee.firstName}`}</td>
                <td>{`${trainee.lastName}`}</td>
                <td>{`${trainee.gender ? "Male" : "Female"}`}</td>
                <td>{`${trainee.phoneNumber}`}</td>
                <td>{`${trainee.email}`}</td>
                <td>{`${trainee.address}`}</td>
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
