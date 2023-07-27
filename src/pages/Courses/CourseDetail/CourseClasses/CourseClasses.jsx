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
import { param } from "jquery";
import { useNavigate, NavLink } from "react-router-dom";

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
  const [currentClass, setCurrentClass] = useState(false);
  const [payingTime, setPayingTime] = useState(0);
  const [refundTime, setRefundTime] = useState(0);
  const [classChosen, setClassChosen] = useState(-1);
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

  const navigate = useNavigate();
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      // style: "currency",
      currency: "VND",
    }).format(price);
  };
  const handlePayByCash = (classId) => {
    Swal.fire({
      title: `<strong style="color:#d291bc">Payment By Cash</strong>`,
      // icon: 'info',
      html: `
        <p style="text-align:justify; margin:0;">
        Thank you for choosing our service. You should come to our place to complete your payment as soon as possible.</br></br>
        Our Address: <b>E12a, Long Thanh My Ward, District 9, Ho Chi Minh City</b></br></br>
        In case you have some question, please contact us via phone number: <b>
        <a style="text-decoration:none" href="tel: +84989545545">0989 545 545</a></b>
        or <b><a style="text-decoration:none" href="tel: +84989565565">0989 565 565</a></b></br>
        Or via our Email: <b> 
        <a style="text-decoration:none" href="mailto:yogacenter.contact@gmail.com" target="_blank">yogacenter.contact@gmail.com</a> </b>
        </br></br>
        Our Address: E12a, Long Thanh My Ward, District 9, Ho Chi Minh City.
        </br> Our center is open from 4:30 A.M to 10:00 P.M. 
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
        setPayWay(false);
      }
    });
  };

  const handlePayByAtm = (classId) => {
    Swal.fire({
      title: `<strong style="color:#d291bc">Payment Using Mobile Banking</strong>`,
      html: `
        <p style="text-align:justify; margin:0;">
        Thank you for choosing our service. You could complete your payment by banking to our following ATM accounts.</br></br>

        <b>Our ATM Accounts</br>
      1. Bank: Vietcombank</br>
      ATM Number: 1001 1059 2003 2002</br>
      Name: Vũ Ngọc Ánh Tuyết</br>
      Amount: ${formatPrice(price * (1 - discount / 100))} VND</br>
      Content: ${
        JSON.parse(localStorage.getItem("USER_LOGIN")).phoneNumber
      }</br></br>

      2. Bank: VIB</br>
      ATM Number: 101 109 203</br>
      Name: Vũ Ngọc Ánh Tuyết</br>
      Amount: ${formatPrice(price * (1 - discount / 100))} VND</br>
      Content: ${
        JSON.parse(localStorage.getItem("USER_LOGIN")).phoneNumber
      }</b></br></br>

        After banking, you need to <b>click "Confirm"</b> below, our staffs will check your banking immediately.
        Right after our confirming your banking, you will be added to your class.

        </br></br>

        In case you have some question, please contact us via phone number: <b>
        <a style="text-decoration:none" href="tel: +84989545545">0989 545 545</a></b>
        or <b><a style="text-decoration:none" href="tel: +84989565565">0989 565 565</a></b></br>
        Or via our Email: <b> 
        <a style="text-decoration:none" href="mailto:yogacenter.contact@gmail.com" target="_blank">yogacenter.contact@gmail.com</a> </b>
        </br></br>
        Our Address: E12a, Long Thanh My Ward, District 9, Ho Chi Minh City.
        </br> Our center is open from 4:30 A.M to 10:00 P.M.  
        </p>
        `,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: "#d291bc",
      confirmButtonText: "Confirm",
      focusConfirm: false,
      allowOutsideClick: false,
      // showCloseButton: false,
      didOpen: () => {},
    }).then((result) => {
      if (result.isConfirmed === true) {
        localStorage.setItem("TRANSACTION_NOTIFICATION", "atm");
        handleAddBooking(classId, false, 7);
      } else if (result.dismiss === Swal.DismissReason.close) {
        // navigate("/course");
      }
    });
  };

  const handleAddBooking = (classId, booking, status) => {
    if (booking) {
      Swal.fire({
        title: "Booking request is pending",
        html: "Please wait for a few seconds...",
        timer: 10000,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          setViewData(true);
          clearInterval(timerInterval);
        },
      });
    }
    if (status === 7) {
      Swal.fire({
        title: "Your request is pending",
        html: "Please wait for a few seconds...",
        timer: 10000,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          setViewData(true);
          clearInterval(timerInterval);
        },
      });
    }
    let arr = "";
    api
      .post(`/CheckOutVNPAY/AddBooking`, {
        accountId: parseInt(
          JSON.parse(localStorage.getItem("USER_LOGIN")).accountID
        ),
        classId: parseInt(classId),
        courseId: parseInt(courseId),
        status: parseInt(status),
      })
      .then((res) => {
        if (booking) {
          navigate("/transaction");
        }
        if (res.data.status == 5) {
          if (
            localStorage.getItem("trainee_list_booking") != undefined &&
            localStorage.getItem("trainee_list_booking") != null
          ) {
            arr = localStorage.getItem("trainee_list_booking");
            arr = `${arr},${res.data.id}`;
          } else {
            arr = `${res.data.id}`;
          }
          localStorage.setItem("trainee_list_booking", arr);
        }

        if (res.data.status == 7) {
          if (
            localStorage.getItem("trainee_list_booking") != undefined &&
            localStorage.getItem("trainee_list_booking") != null
          ) {
            arr = localStorage.getItem("trainee_list_booking");
            arr = `${arr},${res.data.id}`;
          } else {
            arr = `${res.data.id}`;
          }
          localStorage.setItem("trainee_list_booking", arr);
          navigate("/transaction");
        }

        // if (res.data.status == 0) {
        //   localStorage.setItem(
        //     "TRANSACTION_NOTIFICATION",
        //     `PAY-${res.data.id}-${res.data.courseId}`
        //   );
        // }
      })
      .catch((err) => {
        if (status === 5 || status === 7) {
          let filteredBookings = [];
          api
            .get(`/CheckOutVNPAY/GetAllBooking`)
            .then((res) => {
              const userAccountID = JSON.parse(
                localStorage.getItem("USER_LOGIN")
              ).accountID;
              filteredBookings = res.data.filter(
                (item) =>
                  item.account.accountID === userAccountID && item.status === 0
              );
              filteredBookings.forEach((item) => {
                api
                  .put(`/CheckOutVNPAY/CancelBooking?bookingId=${item.id}`)
                  .then((res) => {})
                  .catch((err) => {});
              });
            })
            .catch((err) => {})
            .finally(() => {
              handleAddBooking(classId, booking, status);
            });
        }
      });
    // }
  };

  const handlePayByVnpay = (classId) => {
    Swal.fire({
      title: `<strong style="color:#d291bc">Policy</strong>`,
      html: `
      <p style="text-align:justify; margin:0;"><b>Payment Policy:</b></br>
      Payment by VNPay should be completed within <b>15 minutes</b> and you will be added to class immediately.
      </br></br>
     <b>Refund Policy:</b></br>
      Upon successful payment, in the next <b>${refundTime}  ${
        refundTime > 1 ? " hours" : " hour"
      }</b>, you would have a chance to send a request to refund if you want.
      After your request, our staff will contact to support you.
      After <b>${refundTime}  ${
        refundTime > 1 ? " hours" : " hour"
      }</b>, we do not support you to refund the booking. <br /><br />  
      In case you have some question, please contact us via phone number: <b>
        <a style="text-decoration:none" href="tel: +84989545545">0989 545 545</a></b>
        or <b><a style="text-decoration:none" href="tel: +84989565565">0989 565 565</a></b></br>
        Or via our Email: <b> 
        <a style="text-decoration:none" href="mailto:yogacenter.contact@gmail.com" target="_blank">yogacenter.contact@gmail.com</a> </b>
        </br></br>
        Our Address: E12a, Long Thanh My Ward, District 9, Ho Chi Minh City.
        </br> Our center is open from 4:30 A.M to 10:00 P.M. 
      </p>
      `,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: "#d291bc",
      confirmButtonText: "I have read and I agree with the policy",
      focusConfirm: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed === true) {
        let link = "";
        Swal.fire({
          title: "Your request is pending",
          html: "Please wait for a few seconds...",
          timer: 1200,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            setViewData(true);
            clearInterval(timerInterval);
          },
        });
        api
          .post(`/CheckOutVNPAY`, {
            amount: price * (1 - discount / 100),
            accId: JSON.parse(localStorage.getItem("USER_LOGIN")).accountID,
            courseId: parseInt(courseId),
            classId: parseInt(classId),
          })
          .then((res) => {
            link = res.data;
            localStorage.setItem(
              "TRANSACTION_NOTIFICATION",
              `PAYVNPAY-${classId}-${courseId}`
            );
            handleAddBooking(classId, false, 0);
          })
          .catch((err) => {})
          .finally(() => {
            window.location.href = link;
          });
      }
    });
  };

  const handleRegisterClass = (classId) => {
    if (
      listOfBooking.filter(
        (item) =>
          item.account.accountID == userLogin.accountID && item.status == 5
      ).length > 0
    ) {
      Swal.fire({
        title: `<strong style="color:#d291bc">Failed Registration</strong>`,
        html: `
          <p style="text-align:justify; margin:0;">
          You have booked a class without being paid yet. Therefore, you could not register for another class now.<br /><br />  
          In case you have some question, please contact us via phone number: <b>
            <a style="text-decoration:none" href="tel: +84989545545">0989 545 545</a></b>
            or <b><a style="text-decoration:none" href="tel: +84989565565">0989 565 565</a></b></br>
            Or via our Email: <b> 
            <a style="text-decoration:none" href="mailto:yogacenter.contact@gmail.com" target="_blank">yogacenter.contact@gmail.com</a> </b>
            </br></br>
            Our Address: E12a, Long Thanh My Ward, District 9, Ho Chi Minh City.
            </br> Our center is open from 4:30 A.M to 10:00 P.M. 
          </p>
          `,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "#d291bc",
        confirmButtonText: "I understand",
        cancelButtonText: "View Your Booking",
        focusConfirm: false,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed === false) {
          navigate("/transaction");
        }
      });
    } else if (currentClass) {
      Swal.fire({
        title: `<strong style="color:#d291bc">Failed Registration</strong>`,
        html: `
          <p style="text-align:center; margin:0;">
          You have a class being not finished at the present.<br /><br />  
          In case you have some question, please contact us via phone number: <b>
            <a style="text-decoration:none" href="tel: +84989545545">0989 545 545</a></b>
            or <b><a style="text-decoration:none" href="tel: +84989565565">0989 565 565</a></b></br>
            Or via our Email: <b> 
            <a style="text-decoration:none" href="mailto:yogacenter.contact@gmail.com" target="_blank">yogacenter.contact@gmail.com</a> </b>
            </br></br>
            Our Address: E12a, Long Thanh My Ward, District 9, Ho Chi Minh City.
            </br> Our center is open from 4:30 A.M to 10:00 P.M. 
          </p>
          `,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonColor: "#d291bc",
        confirmButtonText: "I understand",
        focusConfirm: false,
        allowOutsideClick: false,
      });
    } else {
      setClassChosen(classId);
      setPayWay(true);
    }
  };
  const handleBookingClass = (classId) => {
    if (
      listOfBooking.filter(
        (item) =>
          item.account.accountID == userLogin.accountID && item.status == 5
      ).length > 0
    ) {
      Swal.fire({
        title: `<strong style="color:#d291bc">Failed Booking</strong>`,
        html: `
          <p style="text-align:justify; margin:0;">
          You have booked a class without being paid yet. Therefore, you could not book for another class now.<br /><br />  
          In case you have some question, please contact us via phone number: <b>
            <a style="text-decoration:none" href="tel: +84989545545">0989 545 545</a></b>
            or <b><a style="text-decoration:none" href="tel: +84989565565">0989 565 565</a></b></br>
            Or via our Email: <b> 
            <a style="text-decoration:none" href="mailto:yogacenter.contact@gmail.com" target="_blank">yogacenter.contact@gmail.com</a> </b>
            </br></br>
            Our Address: E12a, Long Thanh My Ward, District 9, Ho Chi Minh City.
            </br> Our center is open from 4:30 A.M to 10:00 P.M. 
          </p>
          `,
        showCloseButton: false,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "#d291bc",
        confirmButtonText: "I understand",
        cancelButtonText: "View Your Booking",
        focusConfirm: false,
        focusCancel: false,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed === false) {
          navigate("/transaction");
        }
      });
    } else if (currentClass) {
      Swal.fire({
        title: `<strong style="color:#d291bc">Failed Booking</strong>`,
        html: `
          <p style="text-align:center; margin:0;">
          You have a class being not finished at the present.<br /><br />  
          In case you have some question, please contact us via phone number: <b>
            <a style="text-decoration:none" href="tel: +84989545545">0989 545 545</a></b>
            or <b><a style="text-decoration:none" href="tel: +84989565565">0989 565 565</a></b></br>
            Or via our Email: <b> 
            <a style="text-decoration:none" href="mailto:yogacenter.contact@gmail.com" target="_blank">yogacenter.contact@gmail.com</a> </b>
            </br></br>
            Our Address: E12a, Long Thanh My Ward, District 9, Ho Chi Minh City.
            </br> Our center is open from 4:30 A.M to 10:00 P.M. 
          </p>
          `,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonColor: "#d291bc",
        confirmButtonText: "I understand",
        focusConfirm: false,
        allowOutsideClick: false,
      });
    } else {
      Swal.fire({
        title: `<strong style="color:#d291bc">Policy</strong>`,
        html: `
        <p style="text-align:justify; margin:0;"><b>Booking Policy:</b></br>
        Upon successful booking, in the next <b>${payingTime} ${
          payingTime > 1 ? " hours" : " hour"
        }</b>, you need to complete payment.
        After successful payment, you will be added to class immediately.</br>
        If the booking is still not paid after <b>${payingTime}  ${
          payingTime > 1 ? " hours" : " hour"
        }</b>, the booking will be cancelled.
        </br></br>
       <b>Refund Policy:</b></br>
       Upon successful payment, in the next <b>${refundTime}  ${
          refundTime > 1 ? " hours" : " hour"
        }</b>, you would have a chance to send a request to refund if you want.
       After your request, our staff will contact to support you.
       After <b>${refundTime}  ${
          refundTime > 1 ? " hours" : " hour"
        }</b>, we do not support you to refund the booking. <br /><br />  
        In case you have some question, please contact us via phone number: <b>
          <a style="text-decoration:none" href="tel: +84989545545">0989 545 545</a></b>
          or <b><a style="text-decoration:none" href="tel: +84989565565">0989 565 565</a></b></br>
          Or via our Email: <b> 
          <a style="text-decoration:none" href="mailto:yogacenter.contact@gmail.com" target="_blank">yogacenter.contact@gmail.com</a> </b>
          </br></br>
          Our Address: E12a, Long Thanh My Ward, District 9, Ho Chi Minh City.
          </br> Our center is open from 4:30 A.M to 10:00 P.M. 
        </p>
        `,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonColor: "#d291bc",
        confirmButtonText: "I have read and I agree with the policy",
        focusConfirm: false,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed === true) {
          localStorage.setItem("TRANSACTION_NOTIFICATION", "booking");
          handleAddBooking(classId, true, 5);
        }
      });
    }
  };
  // </br></br>
  //       <b>Class Cancellation:</b>
  //       In the event that we cancel the course you have registered for, our staff will notify you x days prior to the scheduled start date.
  //       In this situation, you have the option to receive a 100% refund or transfer to another class within the registered course.
  useEffect(() => {
    api
      .get(`CheckOutVNPAY/GetAllBooking`)
      .then((res) => {
        setListOfBooking(res.data);
      })
      .catch((err) => {});
    api
      .get(`/api/AdminRepositoryAPI/GetSettingList`)
      .then((res) => {
        res.data
          .filter((item) => item.id == 1)
          .forEach((item) => {
            setPayingTime(item.preactiveValue);
          });
        res.data
          .filter((item) => item.id == 2)
          .forEach((item) => {
            setRefundTime(item.preactiveValue);
          });
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
        api
          .get(`/Trainee/getCurrentListClassForTrainee?id=${USER.accountID}`)
          .then((res) => {
            if (
              res.data != null &&
              res.data != undefined &&
              res.data.length > 0
            ) {
              setCurrentClass(true);
            }
          })
          .catch((err) => {});
      }
    }

    if (courseClasses.length > 0) {
      for (let i = 0; i < courseClasses.length; i++) {
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

  useEffect(() => {
    if (payWay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [payWay]);

  return (
    <section className="p-0">
      {!payWay ? (
        <div className={`row flex justify-content-center`}>
          <div className="course-detail-classes col-11 col-lg-10">
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
                      <StyledTableCell align="center">Register</StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ maxWidth: "150px" }}
                      >
                        Schedule
                      </StyledTableCell>
                      <StyledTableCell
                        className="text-start mobile-schedule-guest-none d-table-cell d-lg-none"
                        style={{ maxWidth: "90px" }}
                      >
                        Date
                      </StyledTableCell>
                      <StyledTableCell
                        className="mobile-schedule-guest-none d-lg-table-cell d-none"
                        align="left"
                      >
                        Start Date
                      </StyledTableCell>
                      <StyledTableCell
                        className="mobile-schedule-guest-none d-lg-table-cell d-none"
                        align="left"
                      >
                        End Date
                      </StyledTableCell>
                      <StyledTableCell align="left">Trainer</StyledTableCell>
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
                        },
                        index
                      ) => {
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell align="center">
                              {availablePayment ? (
                                <div className="p-0 m-0 flex-column">
                                  <Button
                                    className="my-1"
                                    style={{
                                      backgroundColor: "#d291bc",
                                      border: "none",
                                    }}
                                    onClick={() => {
                                      handleRegisterClass(classId);
                                    }}
                                  >
                                    Pay Now
                                  </Button>
                                  <br></br>
                                  <Button
                                    className="my-1"
                                    style={{
                                      backgroundColor: "#000",
                                      color: "#fff",
                                      border: "none",
                                    }}
                                    onClick={() => {
                                      handleBookingClass(classId);
                                    }}
                                  >
                                    Booking
                                  </Button>
                                </div>
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
                                        title: `You need to log in first`,
                                        html: `Do you want to log in or register now?`,
                                        icon: "info",
                                        confirmButtonText: "Log in now",
                                        denyButtonText: "Register now",
                                        showCancelButton: false,
                                        showDenyButton: true,
                                        showConfirmButton: true,
                                        allowOutsideClick: false,
                                        showCloseButton: true,
                                        focusCancel: false,
                                        focusConfirm: false,
                                        focusDeny: false,
                                        confirmButtonColor: "#42c4ee",
                                        denyButtonColor: "#d08fba",
                                      }).then((result) => {
                                        if (result.isDenied === true) {
                                          // localStorage.setItem(
                                          //   "REDIRECT_LINK_BOOK_CLASS",
                                          //   `/courseDetail/${courseId}`
                                          // );
                                          // window.location.href = "/register";
                                          navigate(
                                            `/register?redirect=/courseDetail/${courseId}`
                                          );
                                        } else if (
                                          result.isConfirmed === true
                                        ) {
                                          // localStorage.setItem(
                                          //   "REDIRECT_LINK_BOOK_CLASS",
                                          //   `/courseDetail/${courseId}`
                                          // );
                                          // window.location.href = "/login";
                                          navigate(
                                            `/login?redirect=/courseDetail/${courseId}`
                                          );
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
                                    } else {
                                      navigate(`/courseDetail/${courseId}`);
                                    }
                                  }}
                                >
                                  Register
                                </button>
                              )}
                            </StyledTableCell>
                            <StyledTableCell
                              align="left"
                              style={{ maxWidth: "150px" }}
                            >
                              {schedule.map(({ date, time }, index) => (
                                <p className="p-0 m-0 py-1" key={index}>
                                  {date}, {time}
                                </p>
                              ))}
                              <div
                                className="mobile-schedule-guest"
                                style={{ color: "#d291bc", fontWeight: "500" }}
                              >
                                Start Date:{" "}
                                {moment(new Date(`${startDate}`)).format(
                                  "DD-MM-YYYY"
                                )}
                                <br></br>
                                End Date:{" "}
                                {moment(new Date(`${endDate}`)).format(
                                  "DD-MM-YYYY"
                                )}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell
                              className="mobile-schedule-guest-none d-none d-lg-table-cell"
                              align="left"
                            >
                              {moment(new Date(`${startDate}`)).format(
                                "DD-MM-YYYY"
                              )}
                            </StyledTableCell>
                            <StyledTableCell
                              className="mobile-schedule-guest-none d-none d-lg-table-cell"
                              align="left"
                            >
                              {moment(new Date(`${endDate}`)).format(
                                "DD-MM-YYYY"
                              )}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{ maxWidth: "110px" }}
                              className="w-100 m-0 text-start mobile-schedule-guest-none d-block d-lg-none"
                            >
                              <b>Start Date</b>
                              <br></br>
                              {moment(new Date(`${startDate}`)).format(
                                "DD-MM-YYYY"
                              )}
                              <br></br>
                              <b>End Date</b>
                              <br></br>
                              {moment(new Date(`${endDate}`)).format(
                                "DD-MM-YYYY"
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {firstname} {lastname}
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
            width: "100vw",
            height: "100vh",
            zIndex: "1000",
            top: "0",
            left: "0",
            bottom: "0",
            right: "0",
            overflow: "none",
            zIndex: "100",
          }}
        >
          <div
            className="bg-dark bg-opacity-25  flex justify-content-center
        text-center px-5 align-items-center"
            style={{ width: "100vw", height: "100vh" }}
          >
            <div
              className="px-5"
              style={{
                width: "100vw",
                maxWidth: "680px",
              }}
            >
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
                      handlePayByVnpay(classChosen);
                    }}
                  >
                    <td className="row flex">
                      <div className="col-4 text-end">
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/paymentImages%2FIcon-VNPAY-QR-1024x800.png?alt=media&token=4bd7ae20-65c6-43f8-b3f1-10a36d5b9810"
                          alt=""
                          style={{ width: "30px", height: "30px" }}
                          className="mx-0"
                        />
                      </div>
                      <div className="col-8 text-start">
                        <h4 className="m-0 p-0">Payment By VNPay</h4>
                      </div>
                    </td>
                  </tr>

                  <tr
                    className="payment-item"
                    style={{ borderBottom: "1px solid #333333" }}
                    onClick={() => {
                      handlePayByAtm(classChosen);
                    }}
                  >
                    <td className="row flex">
                      <div className="col-4 text-end">
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/paymentImages%2Fcredit_card_PNG60.png?alt=media&token=c1e6480b-326b-46ac-82d3-e1bccb64337d"
                          alt=""
                          style={{ width: "30px", height: "30px" }}
                          className="mx-0"
                        />
                      </div>
                      <div className="col-8 text-start">
                        <h4 className="m-0 p-0">
                          Payment Using Mobile Banking
                        </h4>
                      </div>
                    </td>
                  </tr>

                  <tr
                    className="payment-item"
                    style={{ borderBottom: "1px solid #333333" }}
                    onClick={() => {
                      handlePayByCash(classChosen);
                    }}
                  >
                    <td className="row flex">
                      <div className="col-4 text-end">
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/paymentImages%2F4581056.png?alt=media&token=caae4a32-2d5c-488a-8c90-29719233c7b0"
                          alt=""
                          style={{ width: "30px", height: "30px" }}
                          className="mx-0"
                        />
                      </div>
                      <div className="col-8 text-start">
                        {" "}
                        <h4 className="m-0 p-0">Payment By Cash</h4>
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
