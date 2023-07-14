import React, { useEffect, useState } from "react";
import { api } from "../../../constants/api";
import { Select } from "antd";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import "./ListTrainer.scss";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import { alert } from "../../../component/AlertComponent/Alert";
export default function ListTrainer() {
  localStorage.setItem("MENU_ACTIVE", "/staff/listTrainer");
  const [trainerList, setTrainerList] = useState([]);
  const [sortedTrainers, setSortedTrainers] = useState([]);
  const [firstNameSort, setfirstNameSort] = useState("All");
  const [genderSort, setgenderSort] = useState("All");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [searchedName, setSearchedName] = useState("");
  const [listOfSearchedName, setListOfSearchedName] = useState([]);
  const [viewPhoneSearch, setViewPhoneSearch] = useState(false);
  const [viewMailSearch, setViewMailSearch] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      timer: 800,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    api
      .get("/Account/AccountListByRole?id=3")
      .then((res) => {
        setTrainerList(res.data);
        setIsDataLoaded(true);
      })
      .catch((err) => {});
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

  useEffect(() => {
    if (searchedName == "") {
      setListOfSearchedName([]);
    } else {
      let list = [];
      let values = searchedName.split(" ");
      values.forEach((item) => {
        if (item.trim() != "") {
          list = [...list, item.trim()];
          setListOfSearchedName(list);
        }
      });
    }
  }, [searchedName]);

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
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
        focusConfirm: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          api
            .delete(`/Account/DeleteAccount?id=${trainerId}`)
            .then(() => {
              // Refresh the trainee list after deletion
              setTrainerList((prevList) =>
                prevList.filter((trainer) => trainer.accountID !== trainerId)
              );
              alert.alertSuccessWithTime(
                "Delete Successfully",
                "",
                2000,
                "25",
                () => {}
              );
            })
            .catch((error) => {
              alert.alertFailedWithTime(
                "Failed to delete",
                "",
                2000,
                "25",
                () => {}
              );
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  };
  return (
    <>
      <HeaderStaff />
      <section className="main bg-white" id="">
        <MenuStaff />
        <div className="main--content bg-white">
          <section className="staff-list-area pt-3 pb-3">
            <div className="row flex trainer-containe mt-2 mx-5 mb-5">
              <div className="headerlist mb-2">
                <h1
                  className="m-0 p-0 mb-2"
                  //  style={{ color: "#ff9aa2" }}
                >
                  <i className="ri-bookmark-line"></i> List Trainers
                </h1>
              </div>

              <div className="trainer">
                {/* Search By Name */}
                <div className="col-lg-6 col-md-12 flex justify-content-start mb-2">
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
                <table style={{ fontSize: "13px" }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>
                        Gender
                        {!genderSort.trim().toLowerCase().includes("all") ? (
                          <i
                            className="fa-solid fa-filter mx-1"
                            style={{ opacity: "0.8" }}
                          ></i>
                        ) : (
                          <></>
                        )}
                        <select
                          className="text-light border-0 mx-1"
                          name="gender"
                          value={genderSort}
                          onChange={(e) => {
                            setgenderSort(e.target.value);
                          }}
                          style={{
                            width: "15px",
                            cursor: "pointer",
                            backgroundColor: "#333333",
                          }}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="all">All</option>
                        </select>
                      </th>
                      <th>
                        Phone
                        <button
                          className="border-0 px-2 bg-transparent"
                          style={{ position: "relative", cursor: "static" }}
                        >
                          <i
                            className="fa-solid fa-magnifying-glass"
                            style={{
                              cursor: "pointer",
                              transform: "scale(0.8)",
                              color: "#fff",
                            }}
                            onClick={() => {
                              if (viewPhoneSearch) {
                                setViewPhoneSearch(false);
                                setSearchedPhone("");
                              } else {
                                setViewMailSearch(false);
                                setSearchedEmail("");
                                setViewPhoneSearch(true);
                              }
                            }}
                          ></i>
                          {viewPhoneSearch ? (
                            <div
                              className=""
                              style={{
                                position: "absolute",
                                top: "100%",
                                right: "50%",
                                width: "150px",
                              }}
                            >
                              <input
                                type="search"
                                placeholder="Enter Phone..."
                                style={{
                                  borderRadius: "5px",
                                  border: "1px solid gray",
                                  outline: "none",
                                  fontSize: "13px",
                                }}
                                className="px-1 py-1"
                                value={searchedPhone}
                                onChange={(e) => {
                                  setSearchedPhone(e.target.value);
                                }}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </button>
                      </th>
                      <th>
                        Email
                        <button
                          className="border-0 p-0 mx-2 bg-transparent"
                          style={{
                            position: "relative",
                            cursor: "auto",
                            color: "#fff",
                          }}
                        >
                          <i
                            className="fa-solid fa-magnifying-glass"
                            style={{
                              cursor: "pointer",
                              transform: "scale(0.8)",
                              color: "#fff",
                            }}
                            onClick={() => {
                              if (viewMailSearch) {
                                setViewMailSearch(false);
                                setSearchedEmail("");
                              } else {
                                setViewPhoneSearch(false);
                                setSearchedPhone("");
                                setViewMailSearch(true);
                              }
                            }}
                          ></i>
                          {viewMailSearch ? (
                            <div
                              className=""
                              style={{
                                position: "absolute",
                                top: "100%",
                                right: "50%",
                                width: "150px",
                              }}
                            >
                              <input
                                type="search"
                                placeholder="Enter Email..."
                                style={{
                                  borderRadius: "5px",
                                  border: "1px solid gray",
                                  outline: "none",
                                  fontSize: "13px",
                                }}
                                className="px-1 py-1"
                                value={searchedEmail}
                                onChange={(e) => {
                                  setSearchedEmail(e.target.value);
                                }}
                                onClick={() => {}}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </button>
                      </th>
                      <th>Address</th>

                      <th>
                        <NavLink
                          to={"/staff/createTrainer"}
                          className="p-2 h-100 flex align-items-center justify-content-center text-decoration-none"
                          style={{
                            borderRadius: "10px",
                            backgroundColor: "#fff",
                            color: "#333333",
                          }}
                        >
                          Create
                        </NavLink>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTrainers
                      .filter((item) => !item.deleted)
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
                      .filter((item) => {
                        if (item != null && item != undefined) {
                          if (listOfSearchedName.length <= 0) {
                            return true;
                          } else if (listOfSearchedName.length <= 1) {
                            for (
                              let i = 0;
                              i < listOfSearchedName.length;
                              i++
                            ) {
                              if (
                                item.firstName
                                  .trim()
                                  .toLowerCase()
                                  .includes(
                                    listOfSearchedName[i]
                                      .toString()
                                      .trim()
                                      .toLowerCase()
                                  ) ||
                                item.lastName
                                  .trim()
                                  .toLowerCase()
                                  .includes(
                                    listOfSearchedName[i]
                                      .toString()
                                      .trim()
                                      .toLowerCase()
                                  )
                              ) {
                                return true;
                              }
                            }
                          } else {
                            let fullname = `${item.firstName} ${item.lastName}`;
                            let fullnameReverse = `${item.lastName} ${item.firstName}`;
                            if (
                              searchedName
                                .trim()
                                .toLowerCase()
                                .includes(fullname.toLowerCase()) ||
                              searchedName
                                .trim()
                                .toLowerCase()
                                .includes(fullnameReverse.toLowerCase())
                            ) {
                              return true;
                            }
                          }
                          return false;
                        } else {
                          return true;
                        }
                      })
                      .map((trainer) => (
                        <tr key={trainer.accountID}>
                          <td>{`${trainer.accountID}`}</td>
                          <td>{`${trainer.firstName}`}</td>
                          <td>{`${trainer.lastName}`}</td>
                          <td>{`${trainer.gender ? "Male" : "Female"}`}</td>
                          <td>{`${trainer.phoneNumber}`}</td>
                          <td>{`${trainer.email}`}</td>
                          <td>{`${trainer.address}`}</td>

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
          </section>
        </div>
      </section>
    </>
  );
}
