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
  const [payWay, setPayWay] = useState(false);
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
  const handlePayByVnpay = (classId) => {
    let link = "";
    api
      .post(`/CheckOutVNPAY`, {
        amount: price * (1 - discount / 100),
        accId: JSON.parse(localStorage.getItem("USER_LOGIN")).accountID,
        courseId: parseInt(courseId),
        classId: classId,
      })
      .then((res) => {
        link = res.data;
        window.open(link, "_blank");
      })
      .catch((err) => {
        window.open(link, "_blank");
      })
      .finally(() => {
        handleAddBooking(classId);
      });
  };
  const handlePayByAtm = (classId) => {
    Swal.fire({
      title: `<strong style="color:#d291bc">Payment By Cash</strong>`,
      // icon: 'info',
      html: `
        <p style="text-align:justify; margin:0;">
        Thank you for choosing our service. You should complete payment as soon as possible in 12 hourse.</br></br>

        Our ATM Accounts</br>
        1. Bank: Vietcombank</br>
        ATM Number: 1001 1059 2003 2002</br>
        Name: Vũ Ngọc Ánh Tuyết</br>
        Content: ${
          JSON.parse(localStorage.getItem("USER_LOGIN")).phoneNumber
        }</br></br>


        2. Bank: VIB</br>
        ATM Number: 101 109 203</br>
        Name: Vũ Ngọc Ánh Tuyết</br>
        Content: ${
          JSON.parse(localStorage.getItem("USER_LOGIN")).phoneNumber
        }</br></br>


        In case you have some question, please contact us via phone number: <b><a href="">0989 545 545</a></b></br>
        Or via our Email: <b>yogacenter.contact@gmail.com</b></br></br>
        Our Address: <b>E12a, Long Thanh My Ward, District 9, Ho Chi Minh City</b>
        </p>
        `,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: "#d291bc",
      confirmButtonText: "I understand",
      focusConfirm: false,
      allowOutsideClick: false,
      didOpen: () => {},
    }).then((result) => {
      if (result.isConfirmed === true) {
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
              accountId: parseInt(
                JSON.parse(localStorage.getItem("USER_LOGIN")).accountID
              ),
              classId: classId,
              courseId: parseInt(courseId),
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(function () {
              window.location.href = "/transaction";
            });
        }
      }
    });
  };
  const handlePayByCash = (classId) => {
    Swal.fire({
      title: `<strong style="color:#d291bc">Payment By Cash</strong>`,
      // icon: 'info',
      html: `
        <p style="text-align:justify; margin:0;">
        Thank you for choosing our service. You should come to our place to complete payment.</br></br>
        Our Address: <b>E12a, Long Thanh My Ward, District 9, Ho Chi Minh City</b></br></br>
        In case you have some question, please contact us via phone number: <b><a href="">0989 545 545</a></b></br>
        Or via our Email: <b>yogacenter.contact@gmail.com</b>
        </p>
        `,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: "#d291bc",
      confirmButtonText: "I understand",
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
        setPayWay(false);
      }
    });
  };
  const handleAddBooking = (classId) => {
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
          accountId: parseInt(
            JSON.parse(localStorage.getItem("USER_LOGIN")).accountID
          ),
          classId: classId,
          courseId: parseInt(courseId),
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
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
  const handleRegisterClass = (link, classId) => {
    Swal.fire({
      title: `<strong style="color:#d291bc">Policy For Registration</strong>`,
      // icon: 'info',
      html: `
        <p style="text-align:justify; margin:0;"><b>Payment Time:</b>
        After registration, payment must be made within 12 hours. Failure to complete the payment within the specified timeframe will result in the cancellation of your booking. We will not be responsible for any related issues.
        </br></br>
       <b>Refund Policy:</b>
        Upon successful payment, you have 12 hours to cancel your booking and receive a 100% refund. Refund requests made after this timeframe will not be considered valid, and we will not be responsible for any associated issues.
        </br></br>
        <b>Class Cancellation:</b>
        In the event that we cancel the course you have registered for, our staff will notify you x days prior to the scheduled start date. In this situation, you have the option to receive a 100% refund or transfer to another class within the registered course.
        </p>
        `,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: "#d291bc",
      confirmButtonText: "I have read and I agree with the policy",
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
        // handleAddBooking(classId);
        // window.open(`${link}`, "_blank");
        setPayWay(true);
        localStorage.setItem("CLASS", classId);
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
    <section style={{ position: "relative" }}>
      {!payWay ? (
        <div className={`row flex justify-content-center`}>
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
                              {moment(new Date(`${endDate}`)).format(
                                "DD-MM-YYYY"
                              )}
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
                                    handleRegisterClass(linkPayment, classId);
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
                                        } else if (
                                          result.isConfirmed === true
                                        ) {
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
      ) : (
        <div
          className="bg-light"
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            zIndex: "1000",
            top: "0",
            left: "0",
            bottom: "0",
            right: "0",
            overflow: "none",
          }}
        >
          <div
            className="bg-dark bg-opacity-25 w-100 h-100 flex justify-content-center
        text-center px-5 align-items-center"
          >
            <div className="px-5" style={{ width: "45%" }}>
              <table className="bg-light" style={{ height: "auto" }}>
                <thead>
                  <tr>
                    <th className="py-4">
                      <h4 className="m-0 p-0">Choose Your Payment Method</h4>
                    </th>
                  </tr>
                </thead>
                <tbody style={{ height: "auto", verticalAlign: "middle" }}>
                  <tr
                    className="payment-item"
                    style={{ borderBottom: "1px solid #333333" }}
                    onClick={() => {
                      const classId = localStorage.getItem("CLASS");
                      handlePayByVnpay(classId);
                      localStorage.removeItem("CLASS");
                    }}
                  >
                    <td className="row flex">
                      <div className="col-4 text-end">
                        <img
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR-1024x800.png"
                          alt=""
                          style={{ width: "30px", height: "30px" }}
                          className="mx-0"
                        />
                      </div>
                      <div className="col-8 text-start">
                        <h4 className="m-0 p-0">Payment Using VNPay</h4>
                      </div>
                    </td>
                  </tr>

                  <tr
                    className="payment-item"
                    style={{ borderBottom: "1px solid #333333" }}
                    onClick={() => {
                      const classId = localStorage.getItem("CLASS");
                      handlePayByAtm(classId);
                      localStorage.removeItem("CLASS");
                    }}
                  >
                    <td className="row flex">
                      <div className="col-4 text-end">
                        <img
                          src="https://pngimg.com/uploads/credit_card/credit_card_PNG60.png"
                          alt=""
                          style={{ width: "30px", height: "30px" }}
                          className="mx-0"
                        />
                      </div>
                      <div className="col-8 text-start">
                        <h4 className="m-0 p-0">Payment Using ATM</h4>
                      </div>
                    </td>
                  </tr>

                  <tr
                    className="payment-item"
                    style={{ borderBottom: "1px solid #333333" }}
                    onClick={() => {
                      const classId = localStorage.getItem("CLASS");
                      handlePayByCash(classId);
                      localStorage.removeItem("CLASS");
                    }}
                  >
                    <td className="row flex">
                      <div className="col-4 text-end">
                        <img
                          src="https://cdn3.iconfinder.com/data/icons/money-and-credit-card/100/money_pay_payment_dollar-08-512.png"
                          alt=""
                          style={{ width: "30px", height: "30px" }}
                          className="mx-0"
                        />
                      </div>
                      <div className="col-8 text-start">
                        {" "}
                        <h4 className="m-0 p-0">Payment By Cash</h4>{" "}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="border-0 mt-3 bg-black text-light"
                style={{ borderRadius: "10px" }}
                onClick={() => {
                  Swal.fire({
                    title: `<strong>Are you sure to cancel?</strong>`,
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
                      setPayWay(false);
                      localStorage.removeItem("CLASS");
                    } else {
                    }
                  });
                }}
              >
                <h5 className="m-0 p-0 py-2 px-3">Cancel</h5>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
