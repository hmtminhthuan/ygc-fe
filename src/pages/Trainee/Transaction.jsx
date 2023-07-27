import React, { useEffect, useState } from "react";
import { api } from "../../constants/api";
import moment from "moment/moment";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import "./Transaction.scss";
import { timeLeft } from "./TimeLeft";
import { alert } from "../../component/AlertComponent/Alert";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Aos from "aos";
import LoadingOverlay from "../../component/Loading/LoadingOverlay";
export default function Transaction() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  localStorage.setItem("MENU_ACTIVE", "/transaction");
  const [payingTime, setPayingTime] = useState(-1);
  const [refundTime, setRefundTime] = useState(-1);
  const [listOfBooking, setListOfBooking] = useState([]);
  const [payWay, setPayWay] = useState(false);
  const [idBookingPayNow, setIdBookingPayNow] = useState(0);
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      // style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderBooking = () => {
    api
      .get(`/CheckOutVNPAY/GetAllBooking`)
      .then((res) => {
        const userAccountID = JSON.parse(
          localStorage.getItem("USER_LOGIN")
        ).accountID;
        const filteredBookings = res.data
          .filter((item) => item.account.accountID === userAccountID)
          .sort((a, b) => {
            return (
              new Date(b.bookingDate).getTime() -
              new Date(a.bookingDate).getTime()
            );
          });
        setListOfBooking([...filteredBookings]);
        setTimeout(() => {
          setLoading(false);
        }, 200);
      })
      .catch((err) => {})
      .finally(() => {
        setTimeout(renderBooking, 5000);
        // // Call the API again after 5 seconds
      });
  };

  const renderSetting = () => {
    api
      .get(`/api/AdminRepositoryAPI/GetSettingList`)
      .then((res) => {
        res.data
          .filter((item) => item.id == 1)
          .forEach((item) => {
            if (
              item.preactiveValue != null ||
              item.preactiveValue != undefined
            ) {
              setPayingTime(item.preactiveValue);
            } else if (
              item.activeValue != null ||
              item.activeValue != undefined
            ) {
              setPayingTime(item.activeValue);
            }
          });
        res.data
          .filter((item) => item.id == 2)
          .forEach((item) => {
            if (
              item.preactiveValue != null ||
              item.preactiveValue != undefined
            ) {
              setRefundTime(item.preactiveValue);
            } else if (
              item.activeValue != null ||
              item.activeValue != undefined
            ) {
              setRefundTime(item.activeValue);
            }
          });
      })
      .catch((err) => {})
      .finally(() => {
        setTimeout(renderSetting, 5000);
        // Call the API again after 5 seconds
      });
  };

  useEffect(() => {
    const USER_LOGIN = localStorage.getItem("USER_LOGIN");
    let USER = {};
    USER = JSON.parse(USER_LOGIN);
    if (USER_LOGIN == null || USER_LOGIN == undefined || !(USER.role.id == 4)) {
      navigate("/");
    } else {
      renderBooking();
      renderSetting();
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("TRANSACTION_NOTIFICATION") != undefined &&
      listOfBooking.length > 0
    ) {
      const TRANSACTION_NOTIFICATION = localStorage.getItem(
        "TRANSACTION_NOTIFICATION"
      );
      if (TRANSACTION_NOTIFICATION == "booking") {
        if (listOfBooking.filter((item) => item.status === 5).length > 0) {
          alert.alertSuccessWithTime(
            "Book Course Successfully",
            "",
            3000,
            "30",
            () => {}
          );
        } else {
          alert.alertFailedWithTime(
            "Failed To Book Course",
            "",
            3000,
            "30",
            () => {}
          );
        }
      }
      if (TRANSACTION_NOTIFICATION == "atm") {
        if (listOfBooking.filter((item) => item.status === 7).length > 0) {
          alert.alertSuccessWithTime(
            "Confirm Payment Using Mobile Banking Successfully",
            "",
            3000,
            "30",
            () => {}
          );
        } else {
          alert.alertFailedWithTime(
            "Failed To Book Course By ATM",
            "",
            3000,
            "30",
            () => {}
          );
        }
      }
      if (TRANSACTION_NOTIFICATION == "cash") {
        if (listOfBooking.filter((item) => item.status === 7).length > 0) {
          alert.alertSuccessWithTime(
            "Confirm Payment Using Cash Successfully",
            "",
            3000,
            "30",
            () => {}
          );
        } else {
          alert.alertFailedWithTime(
            "Failed To Book Course By Cash",
            "",
            3000,
            "30",
            () => {}
          );
        }
      }
      if (TRANSACTION_NOTIFICATION.includes("PAYAGAINVNPAY")) {
        if (
          listOfBooking.filter(
            (item) =>
              item.status === 1 &&
              item.id.toString() == TRANSACTION_NOTIFICATION.split("-")[1]
          ).length > 0
        ) {
          alert.alertSuccessWithTime(
            "Pay Successfully",
            "",
            3000,
            "25",
            () => {}
          );
          renderBookingAgain();
        }
      } else if (TRANSACTION_NOTIFICATION.includes("PAYVNPAY")) {
        if (
          listOfBooking.filter(
            (item) =>
              item.status === 1 &&
              item.class.classID.toString() ==
                TRANSACTION_NOTIFICATION.split("-")[1]
          ).length > 0
        ) {
          alert.alertSuccessWithTime("Pay Successfully", "", 3000, "25", () => {
            renderBookingAgain();
          });
        } else {
          if (TRANSACTION_NOTIFICATION.split("-")[2] != undefined) {
            navigate(`/courseDetail/${TRANSACTION_NOTIFICATION.split("-")[2]}`);
          }
        }
      }
      // else if (TRANSACTION_NOTIFICATION.includes("PAY")) {
      //   if (
      //     listOfBooking.filter(
      //       (item) =>
      //         item.status === 1 &&
      //         item.id.toString() == TRANSACTION_NOTIFICATION.split("-")[1]
      //     ).length > 0
      //   ) {
      //     alert.alertSuccessWithTime("Pay Successfully", "", 3000, "25", () => {
      //       renderBookingAgain();
      //     });
      //   } else {
      //     if (TRANSACTION_NOTIFICATION.split("-")[2] != undefined) {
      //       navigate(`/courseDetail/${TRANSACTION_NOTIFICATION.split("-")[2]}`);
      //     }
      //   }
      // }
      localStorage.removeItem("TRANSACTION_NOTIFICATION");
    }
  }, [listOfBooking.length]);

  useEffect(() => {
    if (payingTime >= 0) {
      listOfBooking
        .filter((item) => item.status === 5)
        .forEach((item) => {
          timeLeft.getTimeLeft(item.bookingDate, item.id, payingTime, () => {
            setTimeout(() => {
              renderBookingAgain();
              setTimeout(() => {
                renderBookingAgain();
              }, 3000);
            }, 3000);
          });
        });
    }
  }, [listOfBooking.length, payingTime]);

  const styleDateAndTime = (date) => {
    return moment(new Date(`${date}`)).format("DD-MM-YYYY, HH:mm");
  };

  const renderBookingAgain = () => {
    setTimeout(() => {
      renderBooking();
    }, 1500);
  };

  const isRefundAvailableView = (payDate) => {
    return (
      new Date(payDate).setTime(
        new Date(payDate).getTime() + refundTime * 60 * 60 * 1000
      ) -
        new Date().getTime() >
      0
    );
  };

  const handleRefund = (id, status) => {
    if (status === 8) {
      api
        .put(`/CheckOutVNPAY/ChangeToPendingRefundWithATM?BookingId=${id}`)
        .then((res) => {
          alert.alertSuccessWithTime(
            "Request To Refund Successfully",
            "We will contact you as soon as possible",
            5500,
            "33",
            () => {}
          );
        })
        .catch((err) => {
          alert.alertFailedWithTime(
            "Request To Refund Failed",
            "",
            3000,
            "30",
            () => {}
          );
        })
        .finally(() => {
          renderBookingAgain();
        });
    } else {
      api
        .put(`/CheckOutVNPAY/ChangeToPendingRefund?BookingId=${id}`)
        .then((res) => {
          alert.alertSuccessWithTime(
            "Request To Refund Successfully",
            "We will contact you as soon as possible",
            5500,
            "33",
            () => {}
          );
        })
        .catch((err) => {
          alert.alertFailedWithTime(
            "Request To Refund Failed",
            "",
            3000,
            "30",
            () => {}
          );
        })
        .finally(() => {
          renderBookingAgain();
        });
    }
  };

  const handleCancelBooking = (id) => {
    Swal.fire({
      title: `Are you sure to cancel booking?`,
      icon: "info",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
      focusCancel: true,
      focusConfirm: false,
      confirmButtonColor: "red",
      cancelButtonColor: "green",
    }).then((result) => {
      if (result.isDenied === true || result.isDismissed === true) {
      } else if (result.isConfirmed === true) {
        api
          .put(`/CheckOutVNPAY/CancelBooking?bookingId=${id}`)
          .then((res) => {
            alert.alertSuccessWithTime(
              `Cancel Booking Successfully`,
              "",
              3000,
              "25",
              () => {}
            );
            renderBookingAgain();
          })
          .catch((err) => {
            alert.alertFailedWithTime(
              `Failed To Cancel Booking`,
              "",
              3000,
              "30",
              () => {}
            );
          });
      }
    });
  };

  const handlePayAgainByVNPay = (amount, classID, courseID, id) => {
    localStorage.setItem("TRANSACTION_NOTIFICATION", `PAYAGAINVNPAY-${id}`);
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
    api
      .post(`/CheckOutVNPAY`, {
        amount: amount,
        accId: JSON.parse(localStorage.getItem("USER_LOGIN")).accountID,
        courseId: courseID,
        classId: classID,
      })
      .then((res) => {
        window.location.href = res.data;
      })
      .catch((err) => {});
  };

  const handlePayAgainByAtm = (id) => {
    const booking = listOfBooking.filter((item) => item.id === id)[0];
    Swal.fire({
      title: `<strong style="color:#d291bc">Payment Using Mobile Banking</strong>`,

      html: `
      <p style="text-align:justify; margin:0;">
      Thank you for choosing our service. You could complete your payment by banking to our following ATM accounts.</br></br>

      <b>Our ATM Accounts</br>
      1. Bank: Vietcombank</br>
      ATM Number: 1001 1059 2003 2002</br>
      Name: Vũ Ngọc Ánh Tuyết</br>
      Amount: ${formatPrice(booking.amount)} VND</br>
      Content: ${
        JSON.parse(localStorage.getItem("USER_LOGIN")).phoneNumber
      }</br></br>

      2. Bank: VIB</br>
      ATM Number: 101 109 203</br>
      Name: Vũ Ngọc Ánh Tuyết</br>
      Amount: ${formatPrice(booking.amount)} VND</br>
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

      didOpen: () => {},
    }).then((result) => {
      if (result.isConfirmed === true) {
        //localStorage.setItem("TRANSACTION_NOTIFICATION", "atm");
        api
          .put(`/CheckOutVNPAY/ChangeStatusToSuccessWithATM?bookingId=${id}`)
          .then((res) => {
            alert.alertSuccessWithTime(
              "Confirm Payment Successfully",
              "",
              2000,
              "30",
              () => {}
            );
            renderBookingAgain();
            navigate("/transaction");
          })
          .catch((err) => {
            alert.alertFailedWithTime(
              "Failed To Confirm",
              "",
              2000,
              "30",
              () => {}
            );
          })
          .finally(() => {
            renderBookingAgain();
          });
        setPayWay(false);
      }
    });
  };

  const handlePayAgainByCash = (id) => {
    Swal.fire({
      title: `<strong style="color:#d291bc">Payment By Cash</strong>`,

      html: `
        <p style="text-align:justify; margin:0;">
        Thank you for choosing our service. You should come to our place to complete payment.</br></br>
        Our Address: <b>E12a, Long Thanh My Ward, District 9, Ho Chi Minh City</b></br></br>
        In case you have some question, please contact us via phone number: <b><a href="">0989 545 545</a> or <a href="">0989 565 565</a></b></br>
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
      didOpen: () => {},
    }).then((result) => {
      if (result.isConfirmed === true) {
        //localStorage.setItem("TRANSACTION_NOTIFICATION", "atm");
        api
          .put(`/CheckOutVNPAY/ChangeStatusToSuccessWithATM?bookingId=${id}`)
          .then((res) => {
            alert.alertSuccessWithTime(
              "Confirm Payment Successfully",
              "",
              2000,
              "30",
              () => {}
            );
            renderBookingAgain();
            navigate("/transaction");
          })
          .catch((err) => {
            alert.alertFailedWithTime(
              "Failed To Confirm",
              "",
              2000,
              "30",
              () => {}
            );
          })
          .finally(() => {
            renderBookingAgain();
          });
        setPayWay(false);
      }
    });
  };

  useEffect(() => {
    if (payWay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [payWay]);

  Aos.init();

  return (
    <>
      <LoadingOverlay loading={loading} />
      <div className=" m-0 p-0">
        <HeaderHome />
      </div>
      <div className="mt-5 pt-3">
        <h1 className="m-0 p-0 my-3 text-center">Billing History</h1>
        <div
          className="main--content transaction-trainee w-100"
          style={{ margin: "0 auto" }}
        >
          <section className="staff-list-area p-0 mt-2 px-4 history-responsive">
            <table
              className="responsive-font"
              data-aos="zoom-in"
              data-aos-duration="300"
              data-aos-delay="500"
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>ID</th>
                  <th style={{ textAlign: "left" }}>Course</th>
                  <th style={{ textAlign: "right" }}>{`Amount (VND)`}</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                  <th style={{ textAlign: "center" }}>Booking Time</th>
                  <th style={{ textAlign: "center" }}>Note</th>
                </tr>
              </thead>

              <tbody style={{ height: "auto" }}>
                {listOfBooking.map(
                  (
                    {
                      id,
                      bookingDate,
                      amount,
                      status,
                      course,
                      account,
                      payDate,
                      refundDate,
                      linkPayment,
                      classId,
                      ...restParams
                    },
                    index
                  ) => {
                    let { courseName, courseID } = course;
                    return (
                      <tr
                        key={index}
                        data-aos="zoom-out"
                        data-aos-duration="100"
                        data-aos-delay="0"
                        data-aos-offset="0"
                      >
                        <td style={{ textAlign: "left" }}>
                          B{id.toString().length == 1 ? "00" : <></>}
                          {id.toString().length == 2 ? "0" : ""}
                          {id}
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {course.courseName}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {formatPrice(amount)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {status === 5 ? (
                            <>
                              <span
                                style={{
                                  borderRadius: "10px",
                                  fontWeight: "bolder",
                                }}
                                className="m-0 p-0 py-1 px-2 border-0 bg-warning bg-opacity-10 text-warning"
                              >
                                Booking
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                          {status === 0 ? (
                            <>
                              <span
                                style={{
                                  borderRadius: "10px",
                                  fontWeight: "bolder",
                                }}
                                className="m-0 p-0 py-1 px-2 border-0 bg-secondary bg-opacity-10 text-secondary"
                              >
                                Pending
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                          {status === 1 || status === 8 || status === 3 ? (
                            <>
                              <span
                                style={{
                                  borderRadius: "10px",
                                  fontWeight: "bolder",
                                }}
                                className="m-0 p-0 py-1 px-2 border-0 bg-success bg-opacity-10 text-success"
                              >
                                Paid
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                          {status === 7 ? (
                            <>
                              <span
                                style={{
                                  borderRadius: "10px",
                                  fontWeight: "bolder",
                                }}
                                className="m-0 p-0 py-1 px-2 border-0 bg-info bg-opacity-10 text-info"
                              >
                                Confirming
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                          {status === 2 ? (
                            // &&
                            // localStorage.getItem("trainee_list_booking") !=
                            //   null &&
                            // localStorage.getItem("trainee_list_booking") !=
                            //   undefined &&
                            // localStorage
                            //   .getItem("trainee_list_booking")
                            //   .split(",")
                            //   .filter(
                            //     (theItem) => theItem.toString() == id.toString()
                            //   ).length > 0
                            <>
                              <span
                                style={{
                                  borderRadius: "10px",
                                  fontWeight: "bolder",
                                }}
                                className="m-0 p-0 py-1 px-2 border-0 bg-danger bg-opacity-10 text-danger"
                              >
                                Cancel
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                          {status === 4 || status === 6 || status === 9 ? (
                            <>
                              <span
                                style={{
                                  borderRadius: "10px",
                                  fontWeight: "bolder",
                                }}
                                className="m-0 p-0 py-1 px-2 border-0 bg-primary bg-opacity-10 text-primary"
                              >
                                Refund
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                        </td>
                        {/* <td style={{ textAlign: "center" }}>Action</td> */}
                        <td style={{ textAlign: "center" }}>
                          {styleDateAndTime(bookingDate)}
                        </td>
                        <td>
                          {!payWay && status === 5 ? (
                            <>
                              {(status === 5 && payingTime >= 0) ||
                              status === 0 ? (
                                <>
                                  <span
                                    style={{ fontWeight: "bolder" }}
                                    className="text-success "
                                  >
                                    Time Left To Pay
                                  </span>
                                  <p
                                    style={{
                                      fontWeight: "bolder",
                                      fontSize: "18px",
                                    }}
                                    className="text-success p-0 m-0"
                                    id={`timeleft-id-${id}`}
                                  ></p>
                                  <button
                                    className="p-0 m-0 bg-success text-light border-0 px-3 py-1 "
                                    style={{
                                      borderRadius: "15px",
                                      fontSize: "16px",
                                      fontWeight: "450",
                                    }}
                                    onClick={() => {
                                      setIdBookingPayNow(id);
                                      setPayWay(true);
                                    }}
                                  >
                                    {status === 5 ? "Pay Now" : "Pay Again"}
                                  </button>
                                  <br></br>
                                  <b className="p-0 m-0"> or</b>
                                  <button
                                    className="p-0 m-0 mt-0 bg-transparent 
                                text-danger border-0 mt-1 px-1"
                                    style={{
                                      borderRadius: "15px",
                                      fontSize: "14px",
                                      fontWeight: "450",
                                    }}
                                    onClick={() => {
                                      handleCancelBooking(id);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                          {(status === 1 ||
                            status === 8 ||
                            status === 7 ||
                            status === 3) &&
                          payDate != null &&
                          payDate != undefined &&
                          payDate != "" ? (
                            <>
                              Payment Time:
                              <br />
                              {styleDateAndTime(payDate)}
                              <br />
                              {status === 1 || status === 8 ? (
                                <button
                                  className="p-0 m-0 px-2 py-1 text-primary
                              bg-primary bg-opacity-10 border-0"
                                  style={{
                                    borderRadius: "20px",
                                    display: `${
                                      isRefundAvailableView(payDate)
                                        ? ""
                                        : "none"
                                    }`,
                                  }}
                                  onClick={() => {
                                    Swal.fire({
                                      title: `Are you sure to refund?`,
                                      icon: "info",
                                      showCancelButton: true,
                                      showConfirmButton: true,
                                      confirmButtonText: "Yes",
                                      cancelButtonText: "No",
                                      allowOutsideClick: false,
                                      focusCancel: true,
                                      focusConfirm: false,
                                      confirmButtonColor: "red",
                                      cancelButtonColor: "green",
                                    }).then((result) => {
                                      if (
                                        result.isDenied === true ||
                                        result.isDismissed === true
                                      ) {
                                      } else if (result.isConfirmed === true) {
                                        handleRefund(id, status);
                                      }
                                    });
                                  }}
                                >
                                  Refund
                                </button>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            ""
                          )}
                          {status === 6 ||
                          (status === 9 &&
                            payDate != null &&
                            payDate != undefined &&
                            payDate != "") ? (
                            <span className="text-primary">Pending...</span>
                          ) : (
                            ""
                          )}
                          {status === 4 &&
                          refundDate != null &&
                          refundDate != undefined &&
                          refundDate != "" ? (
                            <>
                              Refund Time:
                              <br />
                              {styleDateAndTime(refundDate)}
                            </>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </section>
          {payWay ? (
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
              data-aos="fade-in"
              data-aos-duration="200"
              data-aos-delay="0"
              data-aos-offset="0"
            >
              <div
                className="bg-dark bg-opacity-25 w-100 h-100 flex justify-content-center
        text-center px-5 align-items-center"
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
                          <h4 className="m-0 p-0">
                            Choose Your Payment Method
                          </h4>
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        height: "auto",
                        verticalAlign: "middle",
                      }}
                    >
                      <tr
                        className="payment-item"
                        style={{
                          borderBottom: "1px solid #333333",
                        }}
                        onClick={() => {
                          listOfBooking
                            .filter((item) => item.id === idBookingPayNow)
                            .forEach((item) => {
                              handlePayAgainByVNPay(
                                item.amount,
                                item.class.classID,
                                item.course.courseID,
                                item.id
                              );
                            });
                        }}
                      >
                        <td className="row flex">
                          <div className="col-4 text-end">
                            <img
                              src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/paymentImages%2FIcon-VNPAY-QR-1024x800.png?alt=media&token=4bd7ae20-65c6-43f8-b3f1-10a36d5b9810"
                              alt=""
                              style={{
                                width: "30px",
                                height: "30px",
                              }}
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
                        style={{
                          borderBottom: "1px solid #333333",
                        }}
                        onClick={() => {
                          handlePayAgainByAtm(idBookingPayNow);
                        }}
                      >
                        <td className="row flex">
                          <div className="col-4 text-end">
                            <img
                              src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/paymentImages%2Fcredit_card_PNG60.png?alt=media&token=c1e6480b-326b-46ac-82d3-e1bccb64337d"
                              alt=""
                              style={{
                                width: "30px",
                                height: "30px",
                              }}
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
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
