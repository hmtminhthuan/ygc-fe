import React, { useEffect, useState } from "react";
import { api } from "../../../constants/api";
import { Select } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
// import HeaderStaff from "../../component/Staff/HeaderStaff";
// import MenuStaff from "../../component/Staff/MenuStaff";
import "remixicon/fonts/remixicon.css";
import "./ListStaff.scss";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
export default function ListStaff() {
  const [staffList, setStaffList] = useState([]);
  const [sortedStaffs, setSortedStaffs] = useState([]);
  const [firstNameSort, setfirstNameSort] = useState("All");
  const [genderSort, setgenderSort] = useState("All");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [searchedName, setSearchedName] = useState("");

  useEffect(() => {
    api
      .get("/Account/AccountListByRole?id=2")
      .then((res) => {
        setStaffList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    let sortedStaffs = [...staffList];

    switch (genderSort) {
      case "all":
        sortedStaffs = [...staffList];
        break;
      case "male":
        sortedStaffs = sortedStaffs.filter((staff) => staff.gender === true);
        break;
      case "female":
        sortedStaffs = sortedStaffs.filter((staff) => staff.gender === false);
        break;
      default:
        sortedStaffs = [...staffList];
        break;
    }

    switch (firstNameSort) {
      case "all":
        sortedStaffs = [...staffList];
        break;
      case "asc":
        sortedStaffs = sortedStaffs.sort((a, b) =>
          a.firstName.localeCompare(b.firstName, { sensitivity: "base" })
        );
        break;
      case "desc":
        sortedStaffs = sortedStaffs.sort((a, b) =>
          b.firstName.localeCompare(a.firstName, { sensitivity: "base" })
        );
        break;
      default:
        break;
    }

    setSortedStaffs(sortedStaffs);
  }, [firstNameSort, genderSort, staffList]);

  const deleteStaff = (staffId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success mx-3",
        cancelButton: "btn btn-danger mx-3",
      },
      buttonsStyling: false,
    });
    const staffToDelete = staffList.find(
      (staff) => staff.accountID === staffId
    );

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${staffToDelete.firstName} ${staffToDelete.lastName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          api
            .delete(`/Account/DeleteAccount?id=${staffId}`)
            .then(() => {
              setStaffList((prevList) =>
                prevList.filter((staff) => staff.accountID !== staffId)
              );
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Staff deleted successfully.",
                "success"
              );
            })
            .catch((error) => {
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

  // const [sortOrder, setSortOrder] = useState("");

  return (
    <>
      <HeaderAdmin />
      <section className="main" id="admin-list-staff-area">
        <MenuAdmin />
        <div className="main--content pt-3 bg-white">
          <div className=" row flex trainee-containe mt-2 mx-5 mb-5">
            <div className="headerlist mb-2">
              <h1 className="m-0 p-0 mb-2" style={{ color: "#da25b3d5" }}>
                <i className="ri-bookmark-line"></i> List Staffs
              </h1>
            </div>
            {/* Search By Name */}
            <div className="col-lg-6 col-md-12 flex justify-content-center mb-2">
              <h5 className="p-0 m-0 py-2 p-0 text-end px-2">Search by Name</h5>
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
              <h5 className="p-0 m-0 py-2 p-0 text-end px-2">Sort by Gender</h5>
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
                    <th>
                      <Link
                        to={"/admin/createStaff"}
                        className="p-2 h-100 flex align-items-center justify-content-center text-decoration-none text-light"
                        style={{
                          borderRadius: "10px",
                          backgroundColor: "#71c55b",
                        }}
                      >
                        Create new staff
                      </Link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStaffs
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
                    .map((staff) => (
                      <tr key={staff.accountID}>
                        <td>{`${staff.firstName}`}</td>
                        <td>{`${staff.lastName}`}</td>
                        <td>{`${staff.gender ? "Male" : "Female"}`}</td>
                        <td>{`${staff.phoneNumber}`}</td>
                        <td>{`${staff.email}`}</td>
                        <td>{`${staff.address}`}</td>

                        <td className="setting">
                          {/* <i className="ri-edit-2-fill mx-2"></i> */}
                          <i
                            className="ri-delete-bin-line mx-2 "
                            onClick={() => deleteStaff(staff.accountID)}
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
      </section>
    </>
  );
}
