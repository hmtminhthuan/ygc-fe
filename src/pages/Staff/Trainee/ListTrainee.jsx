import React, { useEffect, useState } from "react";
import { api } from "../../../constants/api";
import { Pagination, Select } from "antd";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import "./ListTrainee.scss";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import { alert } from "../../../component/AlertComponent/Alert";
export default function ListTrainee() {
  localStorage.setItem("MENU_ACTIVE", "/staff/listTrainee");
  const [traineeList, setTraineeList] = useState([]);
  const [sortedTrainees, setSortedTrainees] = useState([]);
  const [genderSort, setgenderSort] = useState("All");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [searchedName, setSearchedName] = useState("");
  const [traineeCourses, setTraineeCourses] = useState([]);
  const [listOfSearchedName, setListOfSearchedName] = useState([]);
  const [viewPhoneSearch, setViewPhoneSearch] = useState(false);
  const [viewMailSearch, setViewMailSearch] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [numberOfPage, setNumberOfPage] = useState(1);
  const [currentPagination, setCurrentPagination] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(8);

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
    let arr = [];
    api
      .get("/Trainee/GetAllInformationTraineeList")
      .then((res) => {
        arr = res.data;
        setTraineeList(res.data);
        setIsDataLoaded(true);
      })
      .catch((err) => {})
      .finally(() => {
        let finalArr = [...arr];
        api
          .get(`/Account/AccountListByRole?id=4`)
          .then((res) => {
            res.data.forEach((item) => {
              let valid = true;
              arr.forEach((person) => {
                if (item.accountID == person.accountID) {
                  valid = false;
                }
              });
              if (valid) {
                item.courseName = "";
                item.className = "";
                item.level = "";
                finalArr = [...finalArr, item];
              }
            });
            if (res.data.length >= 8) {
              setNumberOfPage(Math.floor(res.data.length / 8));
            }
          })
          .catch((err) => {})
          .finally(() => {
            setTraineeList(finalArr);
          });
      });
  }, []);
  useEffect(() => {
    if (isDataLoaded) {
      Swal.close();
    }
  }, [isDataLoaded]);
  useEffect(() => {
    setNumberOfPage(-1);
    if (
      (searchedName != "" || searchedPhone != "" || searchedEmail != "") &&
      currentPagination != 1
    ) {
      setCurrentPagination(1);
    }
  }, [searchedEmail, searchedPhone, searchedName]);
  useEffect(() => {
    let sortedTrainees = [...traineeList];
    setNumberOfPage(1);
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
    setNumberOfPage(Math.floor(sortedTrainees.length / 8));
    setCurrentPagination(1);
    setSortedTrainees(sortedTrainees);
  }, [genderSort, traineeList]);

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
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
        focusConfirm: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          api
            .delete(`/Account/DeleteAccount?id=${traineeId}`)
            .then(() => {
              // Refresh the trainee list after deletion
              setTraineeList((prevList) =>
                prevList.filter((trainee) => trainee.accountID !== traineeId)
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
            <div className="row flex-column trainee-containe mt-2 mx-5 mb-5">
              <div className="headerlist mb-2">
                <h1
                  className="m-0 p-0 mb-2"
                  // style={{ color: "#faa46a" }}
                >
                  <i className="ri-bookmark-line"></i> List Trainees
                </h1>
              </div>

              <div className="trainee">
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
                <table style={{ fontSize: "12px" }}>
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
                          <option value="all">All</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
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
                      <th>Course</th>
                      <th>Class</th>
                      {/* <th>Level</th> */}
                      <th>
                        <NavLink
                          to={"/staff/createTrainee"}
                          className="p-2 h-100 flex align-items-center justify-content-center text-decoration-none"
                          style={{
                            borderRadius: "10px",
                            backgroundColor: "#fff",
                            color: "#333333",
                          }}
                        >
                          Create
                          {/* <i className=" ri-user-add-line mx-2 flex"></i>Create */}
                        </NavLink>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTrainees
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
                      .map((trainee, index) => {
                        let indexCompare = Math.floor(index / currentPageSize);
                        if (indexCompare > numberOfPage) {
                          setNumberOfPage(indexCompare + 1);
                        }
                        if (numberOfPage >= 1) {
                          if (!(indexCompare === currentPagination - 1)) {
                            return <></>;
                          }
                        }
                        return (
                          <tr key={trainee.accountID}>
                            <td>{`${trainee.accountID}`}</td>
                            <td>{`${trainee.firstName}`}</td>
                            <td>{`${trainee.lastName}`}</td>
                            <td>{`${trainee.gender ? "Male" : "Female"}`}</td>
                            <td>{`${trainee.phoneNumber}`}</td>
                            <td>{`${trainee.email}`}</td>
                            <td>{`${trainee.address}`}</td>
                            <td>{`${
                              trainee.courseName ? trainee.courseName : "-"
                            }`}</td>
                            <td>{`${trainee.className}`}</td>
                            {/* <td>{`${trainee.level}`}</td> */}

                            <td className="setting">
                              <i
                                className="ri-delete-bin-line mx-2 "
                                onClick={() => deleteTrainee(trainee.accountID)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </td>
                          </tr>
                        );
                      })}
                    {numberOfPage >= 1 ? (
                      <tr>
                        <td colSpan={9}>
                          <Pagination
                            onChange={(page, pageSize) => {
                              setCurrentPagination(parseInt(page));
                            }}
                            current={currentPagination}
                            defaultCurrent={1}
                            defaultPageSize={7}
                            total={
                              numberOfPage === -1
                                ? 2
                                : numberOfPage * currentPageSize
                            }
                            pageSize={currentPageSize}
                            pageSizeOptions={[8, 10, 20, 50, 100]}
                            showSizeChanger={true}
                            onShowSizeChange={(current, size) => {
                              setNumberOfPage(-1);
                              setCurrentPageSize(parseInt(size));
                            }}
                          />
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
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
