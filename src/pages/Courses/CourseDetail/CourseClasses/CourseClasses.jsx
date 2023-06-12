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
import { api } from "../../../../constants/api";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function CourseClasses({
  courseId,
  price,
  discount,
  courseClasses,
  ...restParams
}) {
  const [available, setAvailable] = useState(false);
  const [markAvailable, setMarkAvailable] = useState(false);
  const [classes, setClasses] = useState([]);
  const [userLogin, setUserLogin] = useState({});
  const [availablePayment, setAvailablePayment] = useState(false);
  const [listOfBooking, setListOfBooking] = useState({});
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
  const handleAddBooking = () => {
    if (
      listOfBooking.filter(
        (item) =>
          item.account.accountID ==
            JSON.parse(localStorage.getItem("USER_LOGIN")).accountID &&
          item.course.courseID == parseInt(courseId) &&
          item.status == 0
      ).length <= 0
    ) {
      api
        .post(`/CheckOutVNPAY/AddBooking`, {
          accountId: JSON.parse(localStorage.getItem("USER_LOGIN")).accountID,
          courseId: parseInt(courseId),
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {});
    }
    Swal.fire({
      title: "<strong>Thank you for your registration</strong>",
      // icon: 'info',
      //   html: `
      //   <a
      //   class="register_class_btn_after"
      //   style="background-color: #d291bc;border: none;text-decoration:none;
      //   border-radius:10px;color:#fff;"
      //   href="${link}"
      //   target="_blank"
      // >
      //   <p style="margin:0;padding:10px 0px;background-color: #d291bc;">Click here to continue</p>
      // </a>
      //   `,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: "#d291bc",
      confirmButtonText: "Click here to continue",
      focusConfirm: false,
      allowOutsideClick: false,
      didOpen: () => {
        // const btn = Swal.getHtmlContainer().querySelector(
        //   "a.register_class_btn_after"
        // );
        // btn.addEventListener("click", () => {
        //   // handleAddBooking();
        // });
      },
    }).then((result) => {
      if (result.isConfirmed === true) {
        window.location.href = "/transaction";
      }
    });
  };
  const handleRegisterClass = (link) => {
    Swal.fire({
      title: "<strong>Policy</strong>",
      // icon: 'info',
      //   html: `
      //   <a
      //   class="register_class_btn"
      //   style="background-color: #d291bc;border: none;text-decoration:none;
      //   border-radius:10px;color:#fff;"
      //   href="${link}"
      //   target="_blank"
      // >
      //   <p style="margin:0;padding:10px 0px;
      //   background-color: #d291bc;border-radius:15px;">I agree</p>
      // </a>
      //   `,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: "#d291bc",
      confirmButtonText: "Yes, I agree",
      focusConfirm: false,
      allowOutsideClick: false,
      didOpen: () => {
        // const btn = Swal.getHtmlContainer().querySelector(
        //   "a.register_class_btn"
        // );
        // btn.addEventListener("click", () => {
        // handleAddBooking();
        // });
      },
    }).then((result) => {
      if (result.isConfirmed === true) {
        handleAddBooking();
        window.open(`${link}`, "_blank");
      }
    });
  };
  useEffect(() => {
    api
      .get(`CheckOutVNPAY/GetAllBooking`)
      .then((res) => {
        setListOfBooking(res.data);
      })
      .catch((err) => {});
  }, []);
  useEffect(() => {
    setClasses(courseClasses);
    const USER_LOGIN = localStorage.getItem("USER_LOGIN");
    let USER = {};
    if (USER_LOGIN != null) {
      USER = JSON.parse(USER_LOGIN);
      setUserLogin(USER);
      if (
        !(
          USER.accountID == null ||
          USER.accountID == undefined ||
          USER.role == null ||
          USER.role == undefined ||
          USER.role.id != 4
        )
      ) {
        setAvailablePayment(true);
        let arr = [];
        courseClasses.forEach((classItem) => {
          api
            .post(`/CheckOutVNPAY`, {
              amount: price * (1 - discount / 100),
              accId: JSON.parse(localStorage.getItem("USER_LOGIN")).accountID,
              courseId: parseInt(courseId),
              classId: classItem.classId,
            })
            .then((res) => {
              classItem.linkPayment = res.data;
              arr = [...arr, classItem];
            })
            .catch((err) => {
              classItem.linkPayment = "";
              arr = [...arr, classItem];
            })
            .finally(() => {
              setClasses(arr);
            });
        });
      }
    }
    if (courseClasses.length > 0) {
      for (i = 0; i < courseClasses.length; i++) {
        let current = moment(new Date());
        let end = moment(new Date(`${courseClasses[i].endDate}`));
        if (current <= end) {
          setAvailable(true);
          setMarkAvailable(true);
          break;
        }
      }
    }
  }, [courseClasses.length]);
  return (
    <div className="row flex justify-content-center">
      <div className="course-detail-classes col-10">
        {classes.length <= 0 || !available ? (
          <p
            className="text-danger text-center p-0 m-0"
            style={{ fontSize: "18px", fontWeight: "600" }}
          >
            No available class till present!
          </p>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>No.</StyledTableCell>
                  <StyledTableCell align="left">Start Date</StyledTableCell>
                  <StyledTableCell align="left">End Date</StyledTableCell>
                  <StyledTableCell align="left">Trainer</StyledTableCell>
                  <StyledTableCell align="left">Schedule</StyledTableCell>
                  <StyledTableCell align="center">Register</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ height: "auto" }}>
                {classes.map(
                  (
                    {
                      classId,
                      trainerId,
                      startDate,
                      endDate,
                      firstname,
                      lastname,
                      schedule,
                      linkPayment,
                    },
                    index
                  ) => {
                    return (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="left">
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {moment(new Date(`${startDate}`)).format(
                            "DD-MM-YYYY"
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {moment(new Date(`${endDate}`)).format("DD-MM-YYYY")}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {firstname} {lastname}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {schedule.map(({ date, time }, index) => (
                            <p className="p-0 m-0 py-1" key={index}>
                              {date}, {time}
                            </p>
                          ))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {availablePayment ? (
                            <Button
                              style={{
                                backgroundColor: "#d291bc",
                                border: "none",
                              }}
                              // href={linkPayment}
                              // target="_blank"
                              onClick={() => {
                                handleRegisterClass(linkPayment);
                              }}
                            >
                              Register Now
                            </Button>
                          ) : (
                            <button
                              className="course-register-now m-0 mx-1 mt-1 border-0
                py-2 px-2"
                              variant=""
                              target="blank"
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "#d291bc",
                                color: "#fff",
                              }}
                              onClick={() => {
                                if (
                                  userLogin.role == null ||
                                  userLogin.role == undefined
                                ) {
                                  Swal.fire({
                                    title: `You need to Log in first`,
                                    html: `Do you want to Log in now?`,
                                    icon: "info",
                                    showCancelButton: true,
                                    showConfirmButton: true,
                                    confirmButtonText: "Yes",
                                    cancelButtonText: "No",
                                    allowOutsideClick: false,
                                  }).then((result) => {
                                    if (
                                      result.isDenied === true ||
                                      result.isDismissed === true
                                    ) {
                                    } else if (result.isConfirmed === true) {
                                      window.location.href = "/login";
                                    }
                                  });
                                } else if (userLogin.role.id != 4) {
                                  Swal.fire({
                                    title: `Your account cannot register course.`,
                                    icon: "info",
                                    showCancelButton: false,
                                    showConfirmButton: true,
                                    confirmButtonText: "Confirm",
                                    allowOutsideClick: true,
                                  });
                                }
                              }}
                            >
                              Register Now
                            </button>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}
