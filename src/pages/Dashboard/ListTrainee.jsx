import React, { useEffect, useState } from "react";
import { api } from "../../constants/api";
import { Select } from "antd";
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

    // Sắp xếp theo firstname
    switch (firstNameSort) {
      case "all":
        // Không cần thực hiện sắp xếp danh sách trainee theo firstname
        break;
      case "asc":
        sortedTrainees = sortedTrainees.sort((a, b) =>
          a.firstName.localeCompare(b.firstName, "en", { sensitivity: "base" })
        );
        break;
      case "desc":
        sortedTrainees = sortedTrainees.sort((a, b) =>
          b.firstName.localeCompare(a.firstName, "en", { sensitivity: "base" })
        );
        break;
    }

    setSortedTrainees(sortedTrainees);
  }, [firstNameSort, genderSort]);

  const [sortOrder, setSortOrder] = useState("");

  return (
    <div className="trainee-containe mt-3">
      {/* Sort by firstname */}
      <div className="col-lg-4 col-md-12 flex justify-content-center ">
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
      <div className="col-lg-4 col-md-12 flex justify-content-center ">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
