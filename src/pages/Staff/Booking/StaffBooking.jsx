import React, { useEffect, useState } from "react";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import { api } from "../../../constants/api";
import moment from "moment/moment";
import { timeLeft } from "../../Trainee/TimeLeft";
import Swal from "sweetalert2";
import { alert } from "../../../component/AlertComponent/Alert";
import "./StaffBooking.scss";
export default function StaffBooking() {
  localStorage.setItem("MENU_ACTIVE", "staff-booking");
  const [listOfBooking, setListOfBooking] = useState([]);
  const [recently, setRecently] = useState([]);
  const [navigation, setNavigation] = useState(5);
  const [payingTime, setPayingTime] = useState(-1);
  const [refundTime, setRefundTime] = useState(-1);
  const [currentDate, setCurrentDate] = useState(new Date());
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
        setListOfBooking(
          [...res.data]
            .sort((a, b) => {
              return b.id - a.id;
            })
            .sort((a, b) => {
              return a.status - b.status;
            })
        );
      })
      .catch((err) => {});
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
      .catch((err) => {});
  };
  useEffect(() => {
    renderBooking();
    renderSetting();
  }, []);
  useEffect(() => {
    renderBooking();
  }, [navigation]);
  useEffect(() => {
    if (payingTime >= 0) {
      listOfBooking
        .filter((item) => item.status == 5)
        .forEach((item) => {
          timeLeft.getTimeLeft(item.bookingDate, item.id, payingTime, () => {
            setTimeout(() => {
              setCurrentDate(new Date());
              renderBooking();
            }, 3500);
          });
        });
    }
  }, [listOfBooking.length, payingTime]);
  useEffect(() => {
    if (refundTime >= 0) {
      listOfBooking
        .filter((item) => item.status == 1)
        .forEach((item) => {
          timeLeft.checkRefundAvailable(
            item.payDate,
            item.id,
            refundTime,
            () => {
              setTimeout(() => {
                setCurrentDate(new Date());
                // renderBooking();
              }, 3500);
            }
          );
        });
    }
  }, [listOfBooking.length, refundTime]);
  // const handleAcceptFromPending = (accountID, courseID, classID) => {
  //   api
  //     .post(`/api/AdminRepositoryAPI/UpdateBooking`, {
  //       status: 1,
  //       accountId: parseInt(accountID),
  //       classId: parseInt(classID),
  //       courseId: parseInt(courseID),
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  //     .finally(() => {
  //       renderBooking();
  //     });
  // };
  const handleRefund = (accountID, courseID, classID) => {
    console.log({
      accId: parseInt(accountID),
      courseId: parseInt(courseID),
    });
    api
      .post(`/api/AdminRepositoryAPI/UpdateBooking`, {
        status: 4,
        accountId: parseInt(accountID),
        classId: parseInt(classID),
        courseId: parseInt(courseID),
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        renderBooking();
      });
    api
      .post(`/CheckOutVNPay/Refund`, {
        accId: parseInt(accountID),
        courseId: parseInt(courseID),
      })
      .then((res) => {
        console.log(res);
        alert.alertSuccessWithTime(
          "Refund Successfully",
          "",
          2000,
          "25",
          () => {}
        );
      })
      .catch((err) => {
        console.log(err);
        alert.alertFailedWithTime("Failed To Refund", "", 2000, "25", () => {});
      })
      .finally(() => {
        renderBooking();
      });
  };
  const handleDenyRefund = (accountID, courseID, classID, id) => {
    api
      .put(`/CheckOutVNPAY/DenyRefund?bookingId=${id}`)
      .then((res) => {
        console.log(res);
        alert.alertSuccessWithTime(
          "Deny The Refund Successfully",
          "",
          2000,
          "30",
          () => {}
        );
      })
      .catch((err) => {
        console.log(err);
        alert.alertFailedWithTime(
          "Failed To Deny The Refund",
          "",
          2000,
          "30",
          () => {}
        );
      });
  };
  const styleDateAndTime = (date) => {
    return moment(
      new Date(`${date}`)
      // .setTime(new Date(`${date}`).getTime())
    ).format(`DD-MM-YYYY, HH:mm`);
  };
  const styleDateAndTimeExpired = (bookingDate) => {
    return moment(
      new Date(`${bookingDate}`).setTime(
        new Date(`${bookingDate}`).getTime() + payingTime * 60 * 60 * 1000
      )
    ).format(`DD-MM-YYYY, HH:mm`);
  };
  const styleDateAndTimeExpiredRefund = (paymentDate) => {
    return moment(
      new Date(`${paymentDate}`).setTime(
        new Date(`${paymentDate}`).getTime() + refundTime * 60 * 60 * 1000
      )
    ).format(`DD-MM-YYYY, HH:mm`);
  };
  const isRefundAvailableView = (payDate) => {
    return (
      new Date(payDate).setTime(
        new Date(payDate).getTime() + refundTime * 60 * 60 * 1000
      ) -
        currentDate.getTime() >
      0
    );
  };

  useEffect(() => {
    if (navigation == 1) {
      setCurrentDate(new Date());
    }
    renderBooking();
  }, [navigation]);
  useEffect(() => {
    setInterval(() => {
      renderBooking();
      setCurrentDate(new Date());
    }, 5000);
  }, []);
  useEffect(() => {
    setInterval(() => {
      renderSetting();
    }, 5000);
  }, []);
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
              2000,
              "25",
              () => {}
            );
          })
          .catch((err) => {
            console.log(err);
            alert.alertFailedWithTime(
              `Failed To Cancel Booking`,
              "",
              2000,
              "30",
              () => {}
            );
          });
      }
    });
  };
  console.log(listOfBooking);
  return (
    <>
      <HeaderStaff />
      <section className="main bg-white" id="">
        <MenuStaff />
        <div className="main--content bg-white">
          <section className="staff-list-area p-0 mt-2 px-4">
            <div className="px-3 staff-booking-navigation">
              <button
                className={`px-2 pt-1 admin-course-list staff-booking-navigation-item-normal
                ${
                  navigation == 5
                    ? "staff-booking-navigation-item bg-warning text-black"
                    : ""
                }`}
                style={{
                  border: "none",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  width: "80px",
                }}
                onClick={() => {
                  setNavigation(5);
                }}
              >
                Reserved
              </button>
              <button
                className={`px-2 pt-1 admin-course-list staff-booking-navigation-item-normal 
                ${
                  navigation == 1
                    ? "staff-booking-navigation-item bg-success text-light"
                    : ""
                }`}
                // className={`px-2 pt-1 admin-course-list staff-booking-navigation-item-normal ${
                //   isDeleted ? "admin-course-list-active" : ""
                // }`}
                style={{
                  border: "none",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  width: "70px",
                }}
                onClick={() => {
                  setNavigation(1);
                }}
              >
                Paid
              </button>
              <button
                className={`px-2 pt-1 admin-course-list staff-booking-navigation-item-normal 
                ${
                  navigation == 4
                    ? "staff-booking-navigation-item bg-primary text-light"
                    : ""
                }`}
                style={{
                  border: "none",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  width: "70px",
                }}
                onClick={() => {
                  setNavigation(4);
                }}
              >
                Refund
              </button>
              <button
                className={`px-2 pt-1 admin-course-list staff-booking-navigation-item-normal
                ${
                  navigation == 2
                    ? "staff-booking-navigation-item bg-danger text-light"
                    : ""
                }`}
                style={{
                  border: "none",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  width: "70px",
                }}
                onClick={() => {
                  setNavigation(2);
                }}
              >
                Cancel
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>No.</th>
                  <th style={{ textAlign: "left" }}>Name</th>
                  <th style={{ textAlign: "left" }}>Phone</th>
                  <th style={{ textAlign: "left" }}>Course</th>
                  <th style={{ textAlign: "right" }}>{`Amount (VND)`}</th>
                  <th style={{ textAlign: "center" }}>Booking Time</th>
                  {navigation == 1 ? (
                    <>
                      <th style={{ textAlign: "center" }}>Payment Time</th>
                    </>
                  ) : (
                    <></>
                  )}
                  {navigation == 4 ? (
                    <th style={{ textAlign: "center" }}>Refund Time</th>
                  ) : (
                    <></>
                  )}
                  {navigation == 5 ? (
                    <>
                      <th style={{ textAlign: "center" }}>Expried Time</th>
                      <th style={{ textAlign: "center" }}>Time Left</th>
                    </>
                  ) : (
                    <></>
                  )}
                  <th style={{ textAlign: "center" }}>Status</th>
                  {/* {navigation == 1 ? (
                    <>
                      <th style={{ textAlign: "center" }}>Refund</th>
                    </>
                  ) : (
                    <></>
                  )} */}
                </tr>
              </thead>

              <tbody style={{ height: "auto" }}>
                {listOfBooking
                  .filter((item) => {
                    if (navigation == 1) {
                      return item.status == 1 || item.status == 3;
                    }
                    if (navigation == 4) {
                      return item.status == 4 || item.status == 6;
                    }
                    return item.status == navigation;
                  })
                  .sort((a, b) => {
                    if (navigation == 5) {
                      return (
                        new Date(b.bookingDate).getTime() -
                        new Date(a.bookingDate).getTime()
                      );
                    }
                    if (navigation == 1) {
                      return (
                        new Date(a.payDate).getTime() -
                        new Date(b.payDate).getTime()
                      );
                    }
                    if (navigation == 2) {
                      return (
                        new Date(a.bookingDate).getTime() -
                        new Date(b.bookingDate).getTime()
                      );
                    }
                    if (navigation == 4) {
                      return (
                        new Date(b.refundDate).getTime() -
                        new Date(a.refundDate).getTime()
                      );
                    }
                    return -1;
                  })
                  .sort((a, b) => {
                    // if (navigation == 1) {
                    //   return a.status - b.status;
                    // }
                    if (navigation == 4) {
                      return b.status - a.status;
                    }
                    return -1;
                  })
                  .map(
                    (
                      {
                        bookingDate,
                        amount,
                        status,
                        course,
                        account,
                        id,
                        payDate,
                        refundDate,
                        ...restParams
                      },
                      index
                    ) => {
                      let { accountID, firstName, lastName, phone } = account;
                      let { courseName, courseID } = course;
                      return (
                        <tr key={index}>
                          <td
                            style={{ textAlign: "left" }}
                            className={`${
                              recently.filter((item) => item == id).length > 0
                                ? "bg-dark bg-opacity-50 text-light"
                                : ""
                            }`}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{ textAlign: "left" }}
                          >{`${firstName} ${lastName}`}</td>
                          <td style={{ textAlign: "left" }}>{phone}</td>
                          <td style={{ textAlign: "left" }}>
                            {course.courseName}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {formatPrice(amount)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div className="p-0 m-0 flex-column">
                              <p className="p-0 m-0">
                                {styleDateAndTime(bookingDate)
                                  .split(",")[0]
                                  .trim()}
                              </p>
                              <p className="p-0 m-0">
                                {styleDateAndTime(bookingDate)
                                  .split(",")[1]
                                  .trim()}
                              </p>
                            </div>
                          </td>
                          {navigation == 5 ? (
                            <>
                              {payingTime >= 0 ? (
                                <td style={{ textAlign: "center" }}>
                                  <div className="p-0 m-0 flex-column">
                                    <p className="p-0 m-0">
                                      {styleDateAndTimeExpired(bookingDate)
                                        .split(",")[0]
                                        .trim()}
                                    </p>
                                    <p className="p-0 m-0">
                                      {styleDateAndTimeExpired(bookingDate)
                                        .split(",")[1]
                                        .trim()}
                                    </p>
                                  </div>
                                </td>
                              ) : (
                                <td></td>
                              )}
                              <td>
                                <p
                                  style={{ fontWeight: "600" }}
                                  className={`p-0 m-0`}
                                  id={`timeleft-id-${id}`}
                                ></p>
                                <button
                                  className="p-0 m-0 mt-0 bg-transparent 
                                text-danger border-0 px-1"
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
                              </td>
                            </>
                          ) : (
                            <></>
                          )}

                          {navigation == 1 ? (
                            <td style={{ textAlign: "center" }}>
                              {payDate != null &&
                              payDate != undefined &&
                              payDate != "" ? (
                                <div className="p-0 m-0 flex-column">
                                  <p className="p-0 m-0">
                                    {styleDateAndTime(payDate)
                                      .split(",")[0]
                                      .trim()}
                                  </p>
                                  <p className="p-0 m-0">
                                    {styleDateAndTime(payDate)
                                      .split(",")[1]
                                      .trim()}
                                  </p>
                                </div>
                              ) : (
                                ""
                              )}
                            </td>
                          ) : (
                            <></>
                          )}

                          {navigation == 4 ? (
                            <td style={{ textAlign: "center" }}>
                              {refundDate != null &&
                              refundDate != undefined &&
                              refundDate != "" ? (
                                <div className="p-0 m-0 flex-column">
                                  <p className="p-0 m-0">
                                    {styleDateAndTime(refundDate)
                                      .split(",")[0]
                                      .trim()}
                                  </p>
                                  <p className="p-0 m-0">
                                    {styleDateAndTime(refundDate)
                                      .split(",")[1]
                                      .trim()}
                                  </p>
                                </div>
                              ) : (
                                ""
                              )}
                              {status == 6 ? (
                                <>
                                  <button
                                    className="bg-primary text-light border-0 py-1 px-2 mt-0"
                                    style={{ borderRadius: "10px" }}
                                    onClick={() => {
                                      Swal.fire({
                                        title: `Are you sure to accept the refund?`,
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
                                        } else if (
                                          result.isConfirmed === true
                                        ) {
                                          handleRefund(
                                            accountID,
                                            courseID,
                                            restParams.class.classID
                                          );
                                          setRecently([...recently, id]);
                                        }
                                      });
                                    }}
                                  >
                                    Accept
                                  </button>
                                  <br></br>
                                  <button
                                    className="bg-danger text-light border-0 py-1 mt-1 px-3 mt-0"
                                    style={{ borderRadius: "10px" }}
                                    onClick={() => {
                                      Swal.fire({
                                        title: `Are you sure to deny the refund?`,
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
                                        } else if (
                                          result.isConfirmed === true
                                        ) {
                                          handleDenyRefund(
                                            accountID,
                                            courseID,
                                            restParams.class.classID,
                                            id
                                          );
                                          setRecently([...recently, id]);
                                        }
                                      });
                                    }}
                                  >
                                    Deny
                                  </button>
                                </>
                              ) : (
                                <></>
                              )}
                            </td>
                          ) : (
                            <></>
                          )}

                          <td style={{ textAlign: "center" }}>
                            {status == 6 ? (
                              <span
                                style={{ borderRadius: "10px" }}
                                className="m-0 p-0 py-1 px-2 border-0 bg-warning bg-opacity-10 text-warning"
                              >
                                Pending
                              </span>
                            ) : (
                              <></>
                            )}
                            {status == 5 ? (
                              <>
                                <span
                                  style={{ borderRadius: "10px" }}
                                  className="m-0 p-0 py-1 px-2 border-0 bg-warning bg-opacity-10 text-warning"
                                >
                                  Reserved
                                </span>
                              </>
                            ) : (
                              <></>
                            )}
                            {status == 1 || status == 3 ? (
                              <>
                                <span
                                  style={{ borderRadius: "10px" }}
                                  className="m-0 p-0 py-1 px-2 border-0 bg-success bg-opacity-10 text-success"
                                >
                                  Paid
                                </span>
                                {status == 3 ? (
                                  // <p
                                  //   style={{ borderRadius: "10px" }}
                                  //   className="m-0 p-0 py-1 px-2
                                  //     border-0 text-danger text-center"
                                  // >
                                  //   Failed Refund
                                  // </p>
                                  <></>
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                            {status == 2 ? (
                              <>
                                {" "}
                                <span
                                  style={{ borderRadius: "10px" }}
                                  className="m-0 p-0 py-1 px-2 border-0 bg-danger bg-opacity-10 text-danger"
                                >
                                  Cancel
                                </span>
                              </>
                            ) : (
                              <></>
                            )}
                            {status == 4 ? (
                              <>
                                <span
                                  style={{ borderRadius: "10px" }}
                                  className="m-0 p-0 py-1 px-2 border-0 bg-primary bg-opacity-10 text-primary"
                                >
                                  Refund
                                </span>
                              </>
                            ) : (
                              <></>
                            )}
                          </td>

                          {/* {navigation == 1 ? (
                            <td style={{ textAlign: "center" }}>
                              {status == 1 && isRefundAvailableView(payDate) ? (
                                <div
                                  className={`p-0 m-0`}
                                  id={`refund-available-${id}`}
                                >
                                  <div className="m-0 p-0 flex-column text-center">
                                    <p className="m-0 p-0 text-center">
                                      {styleDateAndTimeExpiredRefund(payDate)}
                                    </p>
                                    <p
                                      className="m-0 p-0 text-center"
                                      id={`refund-timeleft-${id}`}
                                    ></p>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </td>
                          ) : (
                            <></>
                          )} */}
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
            <div className="">
              {navigation != 0 ? (
                <>
                  {listOfBooking
                    .filter((item) => item.status == 5)
                    .map(({ id, status, ...restParams }, index) => {
                      if (navigation == 5) {
                        return <p key={`${id}${status}`}></p>;
                      }
                      return (
                        <div className="d-none" key={`${id}${status}`}>
                          <p
                            style={{ fontWeight: "bolder" }}
                            className={`p-0 m-0 ${
                              navigation != 0 ? "d-none" : ""
                            }`}
                            id={`timeleft-id-${id}`}
                          ></p>
                        </div>
                      );
                    })}
                </>
              ) : (
                <></>
              )}
              {navigation != 1 ? (
                <>
                  {" "}
                  {listOfBooking
                    .filter((item) => item.status == 1)
                    .map(({ id, status, ...restParams }, index) => {
                      if (navigation == 1) {
                        return <p key={`${id}${status}`}></p>;
                      }
                      return (
                        <div className="d-none" key={`${id}${status}`}>
                          <div
                            style={{ fontWeight: "bolder" }}
                            className={`p-0 m-0 ${
                              navigation != 0 ? "d-none" : ""
                            }`}
                            id={`refund-available-${id}`}
                          ></div>
                          <p
                            className="m-0 p-0 text-center"
                            id={`refund-timeleft-${id}`}
                          ></p>
                        </div>
                      );
                    })}
                </>
              ) : (
                <></>
              )}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
