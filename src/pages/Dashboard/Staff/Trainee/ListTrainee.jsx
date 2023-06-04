import React, { useEffect, useState } from "react";
import { api } from "../../../../constants/api";
import { Select } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import "./ListTrainee.scss";
import HeaderStaff from "../../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../../component/Staff/MenuStaff";
export default function ListTrainee() {
  const [traineeList, setTraineeList] = useState([]);
  const [sortedTrainees, setSortedTrainees] = useState([]);
  const [firstNameSort, setfirstNameSort] = useState("All");
  const [genderSort, setgenderSort] = useState("All");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [searchedName, setSearchedName] = useState("");
  const [traineeCourses, setTraineeCourses] = useState([]);

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
          (trainee) => trainee.gender === true
        );
        break;
      case "female":
        sortedTrainees = sortedTrainees.filter(
          (trainee) => trainee.gender === false
        );
        break;
      default:
        sortedTrainees = [...traineeList];
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
      default:
        break;
    }

    setSortedTrainees(sortedTrainees);
  }, [firstNameSort, genderSort, traineeList]);

  const deleteTrainee = (traineeId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success mx-3",
        cancelButton: "btn btn-danger mx-3",
      },
      buttonsStyling: false,
    });
    const traineeToDelete = traineeList.find(
      (trainee) => trainee.accountID === traineeId
    );

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${traineeToDelete.firstName} ${traineeToDelete.lastName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          api
            .delete(`/Account/DeleteAccount?id=${traineeId}`)
            .then(() => {
              // console.log("Trainee deleted successfully.");
              // Refresh the trainee list after deletion
              setTraineeList((prevList) =>
                prevList.filter((trainee) => trainee.accountID !== traineeId)
              );
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Trainee deleted successfully.",
                "success"
              );
            })
            .catch((error) => {
              // console.log("Failed to delete trainee. Please try again.");
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

  useEffect(() => {
    const traineeIds = traineeList.map((trainee) => trainee.accountID);
    traineeIds.forEach((item) => {
      let course = {};
      api
        .get(`/Trainee/GetTraineeCourses?traineeId=${item}`)
        .then((res) => {
          res.data.forEach((courseItem) => {
            course = courseItem;
            course.traineeId = item;
            setTraineeCourses([...traineeCourses, course]);
          });
        })
        .catch((err) => {})
        .finally(() => {});
    });
  }, [traineeList]);

  return (
    <>
      <HeaderStaff />
      <section className="main bg-none" id="">
        <MenuStaff />
        <div className="main--content pt-3 bg-white">
          <section className="staff-list-area pt-3 pb-3">
            {/* <MenuStaff /> */}
            <div className="row flex trainee-containe mt-2 mx-5 mb-5">
              <div className="headerlist mb-2">
                <h1 className="m-0 p-0 mb-2">
                  <i className="ri-bookmark-line"></i> List Trainees
                </h1>
              </div>

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
                <div
                  className="w-50 flex justify-content-end"
                  style={{ fontSize: "13px" }}
                >
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
                    {sortedTrainees
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
                      .map((trainee) => {
                        const traineeCoursesFiltered = traineeCourses.find(
                          (course) => course.traineeId === trainee.accountID
                        );
                        return (
                          <tr key={trainee.accountID}>
                            <td>{`${trainee.firstName}`}</td>
                            <td>{`${trainee.lastName}`}</td>
                            <td>{`${trainee.gender ? "Male" : "Female"}`}</td>
                            <td>{`${trainee.phoneNumber}`}</td>
                            <td>{`${trainee.email}`}</td>
                            <td>{`${trainee.address}`}</td>
                            <td>
                              {traineeCoursesFiltered
                                ? traineeCoursesFiltered.courseName
                                : "-"}
                            </td>
                            <td>
                              {traineeCoursesFiltered
                                ? traineeCoursesFiltered.className
                                : "-"}
                            </td>
                            <td className="setting">
                              {/* <i className="ri-edit-2-fill mx-2"></i> */}
                              <i
                                className="ri-delete-bin-line mx-2 "
                                onClick={() => deleteTrainee(trainee.accountID)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
