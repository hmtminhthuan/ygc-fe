import React, { useEffect, useState } from "react";
import { api } from "../../constants/api";
import moment from "moment/moment";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import "./Transaction.scss";
import { timeLeft } from "./TimeLeft";
import { alert } from "../../component/AlertComponent/Alert";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function Transaction() {
  const navigate = useNavigate();
  localStorage.setItem("MENU_ACTIVE", "/transaction");
  const [payingTime, setPayingTime] = useState(-1);
  const [refundTime, setRefundTime] = useState(-1);
  const [current, setCurrent] = useState(new Date());
  const [listOfBooking, setListOfBooking] = useState([]);
  const [payWay, setPayWay] = useState(false);
  const [userLogin, setUserLogin] = useState({});
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRegisterClass = (link, classId, id) => {
    if (
      listOfBooking.filter(
        (item) =>
          item.account.accountID == userLogin.accountID && item.status === 5
      ).length > 0
    ) {
      Swal.fire({
        title: `<strong style="color:#d291bc">Failed Registration</strong>`,
        html: `
          <p style="text-align:justify; margin:0;">
          You have booked a class without being paid yet. Therefore, you could not register for another class now.</br></br>
          In case that you want to register for another class and cancel the current class you have booked,
          please contact us via our hot line: <b><a href="">0989 545 545</a></b> or<b> <a href="">0989 565 565</a></b></br></br>
          Thank you very much for choosing our service.
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
      setPayWay(true);
      localStorage.setItem("CLASS", classId);
    }
    navigate("/transaction");
  };

  // const renderBooking = () => {
  //   api
  //     .get(`/CheckOutVNPAY/GetAllBooking`)
  //     .then((res) => {
  //       setListOfBooking(
  //         [...res.data]
  //           .filter((item) => {
  //             return (
  //               item.account.accountID ==
  //               JSON.parse(localStorage.getItem("USER_LOGIN")).accountID
  //             );
  //           })
  //           .sort((a, b) => {
  //             if (
  //               moment(new Date(a.bookingDate)) <
  //               moment(new Date(b.bookingDate))
  //             ) {
  //               return 1;
  //             }
  //             return -1;
  //           })
  //       );
  //     })
  //     .catch((err) => {});
  // };
  const renderBooking = () => {
    api
      .get(`/CheckOutVNPAY/GetAllBooking`)
      .then((res) => {
        const userAccountID = JSON.parse(
          localStorage.getItem("USER_LOGIN")
        ).accountID;
        const filteredBookings = res.data.filter(
          (item) => item.account.accountID === userAccountID
        );
        setListOfBooking([...filteredBookings]);
      })
      .catch((err) => {})
      .finally(() => {
        setTimeout(renderBooking, 5000); // Call the API again after 5 seconds
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
            // setPayingTime(9.165);
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
        setTimeout(renderSetting, 5000); // Call the API again after 5 seconds
      });
  };
  useEffect(() => {
    renderBooking();
    renderSetting();
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
            "Confirm Payment Using ATM Successfully",
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
      if (
        TRANSACTION_NOTIFICATION != undefined &&
        TRANSACTION_NOTIFICATION.includes("PAY")
      ) {
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
        } else {
          localStorage.setItem("NOTIFICATION_CHOOSE_CLASS_NONE", "true");
          localStorage.setItem("NOTIFICATION_CHOOSE_CLASS", "true");
          //navigate(`/courseDetail/${TRANSACTION_NOTIFICATION.split("-")[2]}`);
        }
      }
      localStorage.removeItem("TRANSACTION_NOTIFICATION");
    }
  }, [listOfBooking.length]);

  // useEffect(() => {
  //   if (payingTime >= 0) {
  //     listOfBooking
  //       .filter((item) => item.status == 0)
  //       .forEach((item) => {
  //         // if (
  //         //   payingTime * 60 * 60 -
  //         //     Math.abs(
  //         //       Math.round(
  //         //         (new Date().getTime() -
  //         //           (new Date(item.bookingDate).getTime() +
  //         //             14 * 1000 * 60 * 60)) /
  //         //           1000
  //         //       )
  //         //     ) >
  //         //   0
  //         // ) {
  //         timeLeft.getTimeLeft(item.bookingDate, item.id, payingTime, () => {\
  //         });
  //         // }
  //       });
  //   }
  // }, [listOfBooking, payingTime]);

  const styleDateAndTime = (date) => {
    return moment(
      new Date(`${date}`)
      // .setTime(new Date(`${date}`).getTime())
    ).format("DD-MM-YYYY, HH:mm");
  };
  // console.log(listOfBooking[0]);
  useEffect(() => {
    if (payingTime >= 0) {
      listOfBooking
        .filter((item) => item.status === 5)
        .forEach((item) => {
          timeLeft.getTimeLeft(item.bookingDate, item.id, payingTime, () => {
            setTimeout(() => {
              // setCurrent(new Date());
              renderBooking();
            }, 3500);
          });
        });
    }
  }, [listOfBooking.length, payingTime]);
  const isRefundAvailableView = (payDate) => {
    return (
      new Date(payDate).setTime(
        new Date(payDate).getTime() + refundTime * 60 * 60 * 1000
      ) -
        new Date().getTime() >
      0
    );
  };
  // const handlePayAgain = (amount, classID, courseID, id) => {
  //   localStorage.setItem("TRANSACTION_NOTIFICATION", `PAY-${id}`);
  //   api
  //     .post(`/CheckOutVNPAY`, {
  //       amount: amount,
  //       accId: JSON.parse(localStorage.getItem("USER_LOGIN")).accountID,
  //       courseId: courseID,
  //       classId: classID,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       navigate(res.data);
  //     })
  //     .catch((err) => {});
  // };
  const handleRefund = (id) => {
    api
      .put(`/CheckOutVNPAY/ChangeToPendingRefund?BookingId=${id}`)
      .then((res) => {
        console.log(res);
        alert.alertSuccessWithTime(
          "Request To Refund Successfully",
          "We will contact you as soon as possible",
          5500,
          "33",
          () => {}
        );
      })
      .catch((err) => {
        console.log(err);
        alert.alertFailedWithTime(
          "Request To Refund Failed",
          "",
          3000,
          "30",
          () => {}
        );
      });
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
            console.log(res);
            alert.alertSuccessWithTime(
              `Cancel Booking Successfully`,
              "",
              3000,
              "25",
              () => {}
            );
          })
          .catch((err) => {
            console.log(err);
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
    localStorage.setItem("TRANSACTION_NOTIFICATION", `PAY-${id}`);
    api
      .post(`/CheckOutVNPAY`, {
        amount: amount,
        accId: JSON.parse(localStorage.getItem("USER_LOGIN")).accountID,
        courseId: courseID,
        classId: classID,
      })
      .then((res) => {
        console.log(res);
        window.location.href = res.data;
      })
      .catch((err) => {});
  };

  const handlePayAgainByAtm = (id) => {
    Swal.fire({
      title: `<strong style="color:#d291bc">Payment Using ATM</strong>`,

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

        In case you have some question, please contact us via phone number: <b><a href="">0989 545 545</a>
        or <a href="">0989 565 565</a></b></br>
        Or via our Email: <b>yogacenter.contact@gmail.com</b></br></br>
        Our Address: <b>E12a, Long Thanh My Ward, District 9, Ho Chi Minh City</b>
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
            console.log(res);
            alert.alertSuccessWithTime(
              "Confirm Payment Successfully",
              "",
              2000,
              "30",
              () => {}
            );
            navigate("/transaction");
          })
          .catch((err) => {
            console.log(err);
            alert.alertFailedWithTime(
              "Failed To Confirm",
              "",
              2000,
              "30",
              () => {}
            );
          })
          .finally(() => {
            navigate("/transaction");
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
            console.log(res);
            alert.alertSuccessWithTime(
              "Confirm Payment Successfully",
              "",
              2000,
              "30",
              () => {}
            );
            navigate("/transaction");
          })
          .catch((err) => {
            console.log(err);
            alert.alertFailedWithTime(
              "Failed To Confirm",
              "",
              2000,
              "30",
              () => {}
            );
          })
          .finally(() => {
            navigate("/transaction");
          });
        setPayWay(false);
      }
    });
  };

  return (
    <>
      <div className=" m-0 p-0">
        <HeaderHome />
      </div>
      <div
        className="mt-5 pt-3"
        style={{
          display: `${
            localStorage.getItem("TRANSACTION_NOTIFICATION") != undefined &&
            localStorage.getItem("TRANSACTION_NOTIFICATION").includes("PAY") &&
            listOfBooking.filter(
              (item) =>
                item.status === 1 &&
                item.id.toString() ==
                  localStorage.getItem("TRANSACTION_NOTIFICATION").split("-")[1]
            ).length <= 0
              ? "none"
              : ""
          }`,
        }}
      >
        <h1 className="m-0 p-0 my-3 text-center">Billing History</h1>
        <div
          className="main--content transaction-trainee m-0 px-5 w-100"
          style={{ margin: "0 auto" }}
        >
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>No.</th>
                <th style={{ textAlign: "left" }}>Course</th>
                <th style={{ textAlign: "right" }}>{`Amount (VND)`}</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th style={{ textAlign: "center" }}>Booking Time</th>
                <th style={{ textAlign: "center" }}>Note</th>
                {/* <th style={{ textAlign: "center" }}>Payment Date</th>
                <th style={{ textAlign: "center" }}>Refund Date</th> */}
                {/* <th style={{ textAlign: "center" }}></th> */}
              </tr>
            </thead>

            <tbody style={{ height: "auto" }}>
              {listOfBooking
                // .filter((item) => {
                //   if (item.status == 2) {
                //     return (
                //       localStorage.getItem("trainee_list_booking") != null &&
                //       localStorage.getItem("trainee_list_booking") !=
                //         undefined &&
                //       localStorage
                //         .getItem("trainee_list_booking")
                //         .split(",")
                //         .filter(
                //           (theItem) => theItem.toString() == item.id.toString()
                //         ).length > 0
                //     );
                //   }
                //   return true;
                // })
                .map(
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
                    let { firstName, lastName, phone } = account;
                    let { courseName, courseID } = course;
                    return (
                      <tr key={index}>
                        <td style={{ textAlign: "left" }}>{index + 1}</td>
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
                                Unpaid
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
                                Payment failed
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                          {status === 1 || status === 3 ? (
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
                                Waiting Confirm
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
                          {status === 4 || status === 6 ? (
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
                          {!payWay ? (
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
                                      handleRegisterClass(linkPayment, classId);
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
                                  <table
                                    className="bg-light"
                                    style={{ height: "auto" }}
                                  >
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
                                          handlePayAgainByVNPay(
                                            amount,
                                            restParams.class.classID,
                                            courseID,
                                            id
                                          );
                                        }}
                                      >
                                        <td className="row flex">
                                          <div className="col-4 text-end">
                                            <img
                                              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR-1024x800.png"
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
                                              Payment By VNPay
                                            </h4>
                                          </div>
                                        </td>
                                      </tr>

                                      <tr
                                        className="payment-item"
                                        style={{
                                          borderBottom: "1px solid #333333",
                                        }}
                                        onClick={() => {
                                          handlePayAgainByAtm(id);
                                        }}
                                      >
                                        <td className="row flex">
                                          <div className="col-4 text-end">
                                            <img
                                              src="https://pngimg.com/uploads/credit_card/credit_card_PNG60.png"
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
                                              Payment Using ATM
                                            </h4>
                                          </div>
                                        </td>
                                      </tr>

                                      <tr
                                        className="payment-item"
                                        style={{
                                          borderBottom: "1px solid #333333",
                                        }}
                                        onClick={() => {
                                          handlePayAgainByCash(id);
                                        }}
                                      >
                                        <td className="row flex">
                                          <div className="col-4 text-end">
                                            <img
                                              src="https://cdn3.iconfinder.com/data/icons/money-and-credit-card/100/money_pay_payment_dollar-08-512.png"
                                              alt=""
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                              }}
                                              className="mx-0"
                                            />
                                          </div>
                                          <div className="col-8 text-start">
                                            {" "}
                                            <h4 className="m-0 p-0">
                                              Payment By Cash
                                            </h4>{" "}
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
                                    <h5 className="m-0 p-0 py-2 px-3">
                                      Cancel
                                    </h5>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          {(status === 1 || status === 7 || status === 3) &&
                          payDate != null &&
                          payDate != undefined &&
                          payDate != "" ? (
                            <>
                              Payment Time:
                              <br />
                              {styleDateAndTime(payDate)}
                              <br />
                              {status === 1 ? (
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
                                        handleRefund(id);
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
                          {status === 6 &&
                          payDate != null &&
                          payDate != undefined &&
                          payDate != "" ? (
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
                        {/* <td style={{ textAlign: "center" }}>
                        {payDate != null &&
                        payDate != undefined &&
                        payDate != "" ? (
                          <>
                            {styleDateAndTime(payDate)}
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {refundDate != null &&
                        refundDate != undefined &&
                        refundDate != "" ? (
                          <>
                            {moment(new Date(`${refundDate}`)).format(
                              `DD-MM-YYYY, HH:mm`
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </td> */}
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
