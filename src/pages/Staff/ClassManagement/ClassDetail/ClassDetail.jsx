import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment/moment";
import { useParams } from "react-router";
import { api } from "../../../../constants/api";
import HeaderStaff from "../../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../../component/Staff/MenuStaff";
import { NavLink } from "react-router-dom";
import { alert } from "../../../../component/AlertComponent/Alert";

export default function ClassDetail() {
  localStorage.setItem("MENU_ACTIVE", "/staff/classManagement");
  const param = useParams();
  const [course, setCourse] = useState({});
  const styleDate = (date) => {
    return moment(new Date(`${date}`)).format("DD-MM-YYYY");
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const [courseClasses, setCourseClasses] = useState([]);
  const [courseFinishedClasses, setCourseFinishedClasses] = useState([]);
  const [available, setAvailable] = useState(false);
  const [markAvailable, setMarkAvailable] = useState(false);
  const [viewAllButton, setViewAllButton] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  const renderClass = () => {
    api
      .get(`Course/GetCourseByID?id=${param.id}`)
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {});

    let arr = [];
    let arr2 = [];
    api
      .get(`/Class/GetClassByCourseIDForAdmin?courseid=${param.id}`)
      .then((res) => {
        arr = res.data;
      })
      .catch((err) => {})
      .finally(() => {
        setCourseClasses(arr);
      });
    api
      .get(`/Class/GetFinishedClassByCourseIDForAdmin?courseid=${param.id}`)
      .then((res) => {
        arr2 = res.data;
      })
      .catch((err) => {})
      .finally(() => {
        setCourseFinishedClasses(arr2);
      });
  };

  useEffect(() => {
    renderClass();
  }, []);

  useEffect(() => {
    if (courseClasses.length > 0) {
      for (let i = 0; i < courseClasses.length; i++) {
        if (
          moment(new Date()) <= moment(new Date(`${courseClasses[i].endDate}`))
        ) {
          setAvailable(true);
          setMarkAvailable(true);
          break;
        }
      }
    }
    setViewAllButton(true);
  }, [courseClasses]);

  let countNo = 1;
  const handleDeleteClass = (classId) => {
    Swal.fire({
      title: `<strong>Are you sure to delete?</strong>`,
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonColor: "green",
      cancelButtonText: "No",
      focusCancel: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed === true) {
        api
          .post(`/Class/DeleteClass?classId=${classId}`)
          .then((res) => {
            alert.alertSuccessWithTime(
              "Delete Class Successfully",
              "",
              3000,
              30,
              () => {}
            );
          })
          .catch((err) => {})
          .finally(() => {
            renderClass();
          });
      } else {
      }
    });
  };
  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuStaff />
        <div className="main--content">
          <section class="staff-list-area p-0 mt-2 px-4">
            <div className="text-start">
              <NavLink
                to={"/staff/classManagement"}
                className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                style={{ fontSize: "18px", fontWeight: "500" }}
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span className="mx-2">Back</span>
              </NavLink>
            </div>
            <div className="">
              <h2 className="m-0 p-0 text-center">Classes Detail</h2>
              <h5 className="m-0 p-0 py-1 my-3 mt-0 text-center">
                Course Name: {course.courseName}{" "}
              </h5>
            </div>
            <div className="row flex justify-content-center">
              <div className="course-detail-classes col-10">
                <div className=" my-2 mt-0 flex justify-content-between align-items-end p-0">
                  <div
                    className="p-0 m-0 flex align-items-end"
                    // style={{ color: "#7C903A" }}
                  >
                    {viewAllButton ? (
                      <h4 className="p-0 m-0">Current Classes</h4>
                    ) : (
                      <h4 className="p-0 m-0">Finished Classes</h4>
                    )}
                  </div>
                  <div className="flex">
                    {viewAllButton &&
                    [...courseClasses].filter(
                      (item) => new Date(item.endDate) - new Date() < 0
                    ).length > 0 ? (
                      <div className="text-end">
                        <button
                          className="border-0 mt-2 mx-1
                   py-1 px-2"
                          style={{
                            borderRadius: "5px",
                            backgroundColor: "#e36ac8",
                            fontWeight: "500",
                          }}
                          onClick={() => {
                            setViewAllButton(false);
                            setHideButton(true);
                            setAvailable(true);
                          }}
                        >
                          View Finished Classes
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                    {hideButton ? (
                      <div className="text-end">
                        <button
                          className="border-0 mt-2 mx-1
                    text-light bg-black bg-opacity-75 py-1 px-2"
                          style={{ borderRadius: "5px" }}
                          onClick={() => {
                            setViewAllButton(true);
                            setHideButton(false);
                            if (!markAvailable) {
                              setAvailable(false);
                            }
                          }}
                        >
                          View Current Classes
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                    <NavLink
                      to={`/staff/createClass/${param.id}`}
                      className="border-0 mt-2 mx-1
                     py-1 px-2 text-light"
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "#e36ac8",
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "COURSE_NAME_CREATE_CLASS",
                          `${course.courseName}`
                        );
                      }}
                    >
                      Create New Class
                    </NavLink>
                  </div>
                </div>
                {[...courseClasses, ...courseFinishedClasses].length <= 0 ||
                !available ? (
                  <p
                    className="text-danger text-center p-0 m-0"
                    style={{ fontSize: "18px", fontWeight: "600" }}
                  >
                    No current class is available!
                  </p>
                ) : (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow className=" bg-dark">
                          <StyledTableCell>No.</StyledTableCell>
                          <StyledTableCell align="left">Name</StyledTableCell>
                          <StyledTableCell align="center">
                            Start Date
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            End Date
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Trainer
                          </StyledTableCell>
                          <StyledTableCell align="center">Room</StyledTableCell>
                          <StyledTableCell align="left">
                            Schedule
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Quantity
                          </StyledTableCell>
                          {/* {viewAllButton ? (
                          <>
                            <StyledTableCell align="center">
                              Edit
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Delete
                            </StyledTableCell>
                          </>
                        ) : (
                          <></>
                        )} */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {viewAllButton ? (
                          <>
                            {courseClasses
                              .filter(
                                (item) =>
                                  new Date(item.endDate) - new Date() > 0
                              )
                              .sort((a, b) => {
                                if (!viewAllButton) {
                                  return moment(new Date(`${b.endDate}`)) >
                                    moment(new Date(`${a.endDate}`))
                                    ? 1
                                    : -1;
                                }
                                if (viewAllButton) {
                                  return moment(new Date(`${b.startDate}`)) >
                                    moment(new Date(`${a.startDate}`))
                                    ? 1
                                    : -1;
                                }
                              })
                              .map(
                                (
                                  {
                                    classId,
                                    trainerId,
                                    className,
                                    startDate,
                                    endDate,
                                    firstname,
                                    lastname,
                                    schedule,
                                    room,
                                    numberTrainee,
                                  },
                                  index
                                ) => {
                                  // if (numberTrainee == undefined) {
                                  //   numberTrainee = 3;
                                  // }
                                  let current = moment(new Date()).format(
                                    "DD-MM-YYYY"
                                  );
                                  let start = moment(
                                    new Date(`${startDate}`)
                                  ).format("DD-MM-YYYY");
                                  let end = moment(
                                    new Date(`${endDate}`)
                                  ).format("DD-MM-YYYY");
                                  // if (
                                  //   moment(new Date()) >
                                  //     moment(new Date(`${endDate}`)) &&
                                  //   viewAllButton
                                  // ) {
                                  //   return <></>;
                                  // }
                                  // if (
                                  //   (moment(new Date()) <
                                  //     moment(new Date(`${endDate}`)) ||
                                  //     current == end) &&
                                  //   !viewAllButton
                                  // ) {
                                  //   return <></>;
                                  // }
                                  return (
                                    <StyledTableRow key={index}>
                                      <StyledTableCell align="left">
                                        {countNo++}
                                      </StyledTableCell>
                                      <StyledTableCell align="left">
                                        {className}
                                      </StyledTableCell>
                                      <StyledTableCell
                                        align="center"
                                        className={`${
                                          moment(new Date()) >
                                          moment(new Date(`${startDate}`))
                                            ? "bg-warning bg-opacity-10"
                                            : ""
                                        }`}
                                      >
                                        {start}
                                      </StyledTableCell>
                                      <StyledTableCell
                                        align="center"
                                        className={`${
                                          moment(new Date()) >
                                          moment(new Date(`${endDate}`))
                                            ? "bg-warning bg-opacity-10"
                                            : ""
                                        }`}
                                      >
                                        {end}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        {firstname} {lastname}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        {room}
                                      </StyledTableCell>
                                      <StyledTableCell align="left">
                                        {schedule.map(
                                          ({ date, time }, index) => (
                                            <p
                                              className="p-0 m-0 py-1"
                                              key={index}
                                            >
                                              {date}, {time}
                                            </p>
                                          )
                                        )}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        {numberTrainee}
                                      </StyledTableCell>
                                      {/* {viewAllButton ? (
                                      <>
                                        <StyledTableCell align="center">
                                          <button
                                            className="text-decoration-none text-primary bg-primary bg-opacity-10 border-0  text-center"
                                            style={{
                                              borderRadius: "50%",
                                              fontSize: "15px",
                                            }}
                                          >
                                            <NavLink
                                              className="px-2 py-1 "
                                              to={``}
                                            >
                                              <i className="fa-solid fa-pen-to-square py-2" />
                                            </NavLink>
                                          </button>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                          <button
                                            className="px-2 py-1 text-decoration-none text-danger bg-danger bg-opacity-10 border-0  text-center"
                                            style={{
                                              borderRadius: "50%",
                                              fontSize: "15px",
                                            }}
                                            onClick={() => {
                                              handleDeleteClass(classId);
                                            }}
                                          >
                                            <i className="fa-solid fa-trash" />
                                          </button>
                                        </StyledTableCell>
                                      </>
                                    ) : (
                                      <></>
                                    )} */}
                                    </StyledTableRow>
                                  );
                                }
                              )}
                          </>
                        ) : (
                          <>
                            {[...courseClasses, ...courseFinishedClasses]
                              .filter(
                                (item) =>
                                  new Date(item.endDate) - new Date() < 0
                              )
                              .sort((a, b) => {
                                if (!viewAllButton) {
                                  return moment(new Date(`${b.endDate}`)) >
                                    moment(new Date(`${a.endDate}`))
                                    ? 1
                                    : -1;
                                }
                                if (viewAllButton) {
                                  return moment(new Date(`${b.startDate}`)) >
                                    moment(new Date(`${a.startDate}`))
                                    ? 1
                                    : -1;
                                }
                              })
                              .map(
                                (
                                  {
                                    classId,
                                    trainerId,
                                    className,
                                    startDate,
                                    endDate,
                                    firstname,
                                    lastname,
                                    schedule,
                                    room,
                                    numberTrainee,
                                  },
                                  index
                                ) => {
                                  // if (numberTrainee == undefined) {
                                  //   numberTrainee = 3;
                                  // }
                                  let current = moment(new Date()).format(
                                    "DD-MM-YYYY"
                                  );
                                  let start = moment(
                                    new Date(`${startDate}`)
                                  ).format("DD-MM-YYYY");
                                  let end = moment(
                                    new Date(`${endDate}`)
                                  ).format("DD-MM-YYYY");
                                  // if (
                                  //   moment(new Date()) >
                                  //     moment(new Date(`${endDate}`)) &&
                                  //   viewAllButton
                                  // ) {
                                  //   return <></>;
                                  // }
                                  // if (
                                  //   (moment(new Date()) <
                                  //     moment(new Date(`${endDate}`)) ||
                                  //     current == end) &&
                                  //   !viewAllButton
                                  // ) {
                                  //   return <></>;
                                  // }
                                  return (
                                    <StyledTableRow key={index}>
                                      <StyledTableCell align="left">
                                        {countNo++}
                                      </StyledTableCell>
                                      <StyledTableCell align="left">
                                        {className}
                                      </StyledTableCell>
                                      <StyledTableCell
                                        align="center"
                                        className={`${
                                          moment(new Date()) >
                                          moment(new Date(`${startDate}`))
                                            ? "bg-warning bg-opacity-10"
                                            : ""
                                        }`}
                                      >
                                        {start}
                                      </StyledTableCell>
                                      <StyledTableCell
                                        align="center"
                                        className={`${
                                          moment(new Date()) >
                                          moment(new Date(`${endDate}`))
                                            ? "bg-warning bg-opacity-10"
                                            : ""
                                        }`}
                                      >
                                        {end}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        {firstname} {lastname}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        {room}
                                      </StyledTableCell>
                                      <StyledTableCell align="left">
                                        {schedule.map(
                                          ({ date, time }, index) => (
                                            <p
                                              className="p-0 m-0 py-1"
                                              key={index}
                                            >
                                              {date}, {time}
                                            </p>
                                          )
                                        )}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        {numberTrainee}
                                      </StyledTableCell>
                                      {viewAllButton ? (
                                        <>
                                          <StyledTableCell align="center">
                                            <button
                                              className="text-decoration-none text-primary bg-primary bg-opacity-10 border-0  text-center"
                                              style={{
                                                borderRadius: "50%",
                                                fontSize: "15px",
                                              }}
                                            >
                                              <NavLink
                                                className="px-2 py-1 "
                                                to={``}
                                              >
                                                <i className="fa-solid fa-pen-to-square py-2" />
                                              </NavLink>
                                            </button>
                                          </StyledTableCell>
                                          <StyledTableCell align="center">
                                            <button
                                              className="px-2 py-1 text-decoration-none text-danger bg-danger bg-opacity-10 border-0  text-center"
                                              style={{
                                                borderRadius: "50%",
                                                fontSize: "15px",
                                              }}
                                              onClick={() => {}}
                                            >
                                              <i className="fa-solid fa-trash" />
                                            </button>
                                          </StyledTableCell>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </StyledTableRow>
                                  );
                                }
                              )}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
