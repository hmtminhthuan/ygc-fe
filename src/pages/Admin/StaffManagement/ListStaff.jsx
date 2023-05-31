import React, { useEffect, useState } from "react";
import { api } from "../../../constants/api";
import { Select } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
// import HeaderStaff from "../../component/Staff/HeaderStaff";
// import MenuStaff from "../../component/Staff/MenuStaff";
import "remixicon/fonts/remixicon.css";
import "./ListStaff.scss";
export default function ListStaff() {
  const [staffList, setStaffList] = useState([]);
  const [sortedStaffs, setSortedStaffs] = useState([]);
  const [firstNameSort, setfirstNameSort] = useState("All");
  const [genderSort, setgenderSort] = useState("All");

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
      {/* <HeaderStaff /> */}

      <section className="staff-list-area pt-3 pb-3">
        {/* <MenuStaff /> */}
        <div className=" row flex trainee-containe mt-2 mx-5 mb-5">
          <div className="headerlist mb-2">
            <h1>
              <i className="ri-bookmark-line"></i> List Staffs
            </h1>
          </div>
          {/* Sort by firstname */}
          <div className="col-lg-4 col-md-12 flex justify-content-center mb-2">
            <h4 className="p-0 m-0 py-2 p-0 text-end px-2">
              Sort by FirstName
            </h4>
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

                  <th>
                    <button className="btn-home px-3 pt-2 pb-2 justify-content-center ">
                      <i className="ri-home-2-fill"></i>
                      <Link to={"/dashboard"} className="exit-list">
                        Home
                      </Link>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStaffs.map((staff) => (
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
      </section>
    </>
  );
}
