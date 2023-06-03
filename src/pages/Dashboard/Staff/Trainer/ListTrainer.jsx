import React, { useEffect, useState } from "react";
import { api } from "../../../../constants/api";
import { Select } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import "./ListTrainer.scss";
import HeaderStaff from "../../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../../component/Staff/MenuStaff";
export default function ListTrainer() {
  const [trainerList, setTrainerList] = useState([]);
  const [sortedTrainers, setSortedTrainers] = useState([]);
  const [firstNameSort, setfirstNameSort] = useState("All");
  const [genderSort, setgenderSort] = useState("All");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [searchedName, setSearchedName] = useState("");

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
          (trainer) => trainer.gender === true
        );
        break;
      case "female":
        sortedTrainers = sortedTrainers.filter(
          (trainer) => trainer.gender === false
        );
        break;
      default:
        sortedTrainers = [...trainerList];
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
      default:
        break;
    }

    setSortedTrainers(sortedTrainers);
  }, [firstNameSort, genderSort, trainerList]);

  const deleteTrainer = (trainerId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success mx-3",
        cancelButton: "btn btn-danger mx-3",
      },
      buttonsStyling: false,
    });
    const trainerToDelete = trainerList.find(
      (trainer) => trainer.accountID === trainerId
    );

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${trainerToDelete.firstName} ${trainerToDelete.lastName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          api
            .delete(`/Account/DeleteAccount?id=${trainerId}`)
            .then(() => {
              // console.log("Trainer deleted successfully.");
              // Refresh the trainee list after deletion
              setTrainerList((prevList) =>
                prevList.filter((trainer) => trainer.accountID !== trainerId)
              );
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Trainer deleted successfully.",
                "success"
              );
            })
            .catch((error) => {
              // console.log("Failed to delete trainer. Please try again.");
              console.log(error);
              swalWithBootstrapButtons.fire(
                "Failed to delete",
                "Please try again.",
                "error"
              );
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Failed to delete!",
            "error"
          );
        }
      });
  };

  return (
    <section className="the-container">
      <div className="the-menu">
        <HeaderStaff />
      </div>
      <section className="main bg-none the-content" id="">
        <MenuStaff />
        <div className="main--content pt-3 bg-white">
          <div className="staff-list-area pt-3 pb-5">
            <div className="row flex trainee-containe mt-2 mx-5 mb-5">
              <div className="headerlist mb-2">
                <h1 className="m-0 p-0 mb-2">
                  <i className="ri-bookmark-line"></i> List Trainers
                </h1>
              </div>
              {/* Sort by firstname */}
              {/* <div className="col-lg-6 col-md-12 flex justify-content-center mb-2">
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
              </div> */}

              {/* Search By Name */}
              <div className="col-lg-6 col-md-12 flex justify-content-center mb-2">
                <h5 className="p-0 m-0 py-2 p-0 text-end px-2">
                  Search by Name
                </h5>
                <div className="w-50 flex justify-content-end">
                  <input
                    type="search"
                    placeholder="Enter part of Name..."
                    style={{
                      borderRadius: "5px",
                      border: "1px solid gray",
                      outline: "none",
                      fontSize: "13px",
                    }}
                    className="px-1 py-1 w-100"
                    value={searchedName}
                    onChange={(e) => {
                      setSearchedName(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Sort by gender */}
              <div className="col-lg-6 col-md-12 flex justify-content-center mb-2">
                <h5 className="p-0 m-0 py-2 p-0 text-end px-2">
                  Sort by Gender
                </h5>
                <div className="w-50" style={{ fontSize: "13px" }}>
                  <Select
                    className="w-100 text-dark mx-1"
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

              {/* Search By Phone */}
              <div className="col-lg-6 col-md-12 flex justify-content-center mb-2">
                <h5 className="p-0 m-0 py-2 p-0 text-end px-2">
                  Search by Phone
                </h5>
                <div className="w-50 flex justify-content-end">
                  <input
                    type="search"
                    placeholder="Enter Phone..."
                    style={{
                      borderRadius: "5px",
                      border: "1px solid gray",
                      outline: "none",
                      fontSize: "13px",
                    }}
                    className="px-1 py-1 w-100"
                    value={searchedPhone}
                    onChange={(e) => {
                      setSearchedPhone(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Search By Email */}
              <div className="col-lg-6 col-md-12 flex justify-content-center mb-2">
                <h5 className="p-0 m-0 py-2 p-0 text-end px-2">
                  Search by Email
                </h5>
                <div className="w-50 flex justify-content-end">
                  <input
                    type="search"
                    placeholder="Enter Email..."
                    style={{
                      borderRadius: "5px",
                      border: "1px solid gray",
                      outline: "none",
                      fontSize: "13px",
                    }}
                    className="px-1 py-1 w-100"
                    value={searchedEmail}
                    onChange={(e) => {
                      setSearchedEmail(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="trainee">
                <table style={{ fontSize: "13px" }}>
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
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTrainers
                      .filter((item) =>
                        item.email
                          .trim()
                          .toLowerCase()
                          .includes(searchedEmail.trim().toLowerCase())
                      )
                      .filter((item) =>
                        item.phoneNumber
                          .trim()
                          .toLowerCase()
                          .includes(searchedPhone.trim().toLowerCase())
                      )
                      .filter(
                        (item) =>
                          item.firstName
                            .trim()
                            .toLowerCase()
                            .includes(searchedName.trim().toLowerCase()) ||
                          item.lastName
                            .trim()
                            .toLowerCase()
                            .includes(searchedName.trim().toLowerCase())
                      )
                      .map((trainer) => (
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
                            <i
                              className="ri-delete-bin-line mx-2"
                              onClick={() => deleteTrainer(trainer.accountID)}
                              style={{ cursor: "pointer" }}
                            ></i>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
