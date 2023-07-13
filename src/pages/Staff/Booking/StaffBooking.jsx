import React, { useEffect, useState } from "react";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import { api } from "../../../constants/api";
import moment from "moment/moment";
import { timeLeft } from "../../Trainee/TimeLeft";
import Swal from "sweetalert2";
import { alert } from "../../../component/AlertComponent/Alert";
import "./StaffBooking.scss";
import { Pagination } from "antd";
export default function StaffBooking() {
  localStorage.setItem("MENU_ACTIVE", "/staff/booking");
  const [listOfBooking, setListOfBooking] = useState([]);
  const [recently, setRecently] = useState([]);
  const [navigation, setNavigation] = useState(5);
  const [payingTime, setPayingTime] = useState(-1);
  const [refundTime, setRefundTime] = useState(-1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [numberOfPage, setNumberOfPage] = useState(-1);
  const [currentPagination, setCurrentPagination] = useState(-1);
  const [viewPagination, setViewPagination] = useState(false);
  const [viewPhoneSearch, setViewPhoneSearch] = useState(false);
  const [searchedPhone, setSearchedPhone] = useState("");
  const [viewNameSearch, setViewNameSearch] = useState(false);
  const [searchedName, setSearchedName] = useState("");
  const [listOfSearchedName, setListOfSearchedName] = useState([]);
  const [currentPageSize, setCurrentPageSize] = useState(5);
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
            .sort((a, b) => {
              return (
                new Date(b.bookingDate).getTime() -
                new Date(a.bookingDate).getTime()
              );
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
    renderBooking();
    setNumberOfPage(-1);
    setViewPagination(false);
    setCurrentPagination(1);
  }, [navigation]);

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

  useEffect(() => {
    setNumberOfPage(-1);
    setViewPagination(false);
    if ((searchedName != "" || searchedPhone != "") && currentPagination != 1) {
      setCurrentPagination(1);
    }
  }, [searchedName, searchedPhone]);

  useEffect(() => {
    if (payingTime >= 0) {
      listOfBooking
        .filter((item) => item.status == 5 || item.status == 7)
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
              }, 3500);
            }
          );
        });
    }
  }, [listOfBooking.length, refundTime]);

  const handleRefund = (accountID, courseID, status, bookingId) => {
    api
      .post(`/CheckOutVNPay/Refund`, {
        accId: parseInt(accountID),
        courseId: parseInt(courseID),
        status: status,
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
        setRecently([...recently, bookingId]);
      })
      .catch((err) => {
        console.log(err);
        alert.alertFailedWithTime("Failed To Refund", "", 2000, "25", () => {});
      })
      .finally(() => {
        renderAgain();
      });
  };

  const handleDenyRefund = (accountID, courseID, classID, id) => {
    api
      .put(`/CheckOutVNPAY/DenyRefund?bookingId=${id}`)
      .then((res) => {
        alert.alertSuccessWithTime(
          "Deny The Refund Successfully",
          "",
          2000,
          "30",
          () => {}
        );
        renderAgain();
      })
      .catch((err) => {
        alert.alertFailedWithTime(
          "Failed To Deny The Refund",
          "",
          2000,
          "30",
          () => {}
        );
      });
  };
  const handleConfirmInternetBankingBooking = (id) => {
    api
      .post(`/CheckOutVNPAY/ConfirmBookingByStaff?bookingId=${id}`)
      .then((res) => {
        alert.alertSuccessWithTime(
          "Confirm Payment Successfully",
          "",
          2000,
          "30",
          () => {}
        );
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
        renderAgain();
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

  const renderAgain = () => {
    setTimeout(() => {
      renderBooking();
    }, 3000);
  };

  useEffect(() => {
    setInterval(() => {
      renderBooking();
    }, 10000);
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
            alert.alertSuccessWithTime(
              `Cancel Booking Successfully`,
              "",
              2000,
              "25",
              () => {}
            );
            setRecently([...recently, id]);
            renderAgain();
          })
          .catch((err) => {
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

  return (
    <>
      <HeaderStaff />
      <section className="main bg-white" id="">
        <MenuStaff />
        <div className="main--content bg-white">
          <section className="staff-list-area staff-booking-area p-0 mt-2 px-3">
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
                  navigation == 7
                    ? "staff-booking-navigation-item bg-info text-black"
                    : ""
                }`}
                style={{
                  border: "none",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  width: "88px",
                }}
                onClick={() => {
                  setNavigation(7);
                }}
              >
                Confirming
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
            <table
              style={{
                fontSize: `${navigation === 5 ? "12.5px" : ""}`,
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>ID</th>
                  <th style={{ textAlign: "left" }}>
                    <div className="flex">
                      Name
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
                            if (viewNameSearch) {
                              setViewNameSearch(false);
                              setSearchedName("");
                            } else {
                              setViewPhoneSearch(false);
                              setSearchedPhone("");
                              setViewNameSearch(true);
                            }
                          }}
                        ></i>
                        {viewNameSearch ? (
                          <div
                            className=""
                            style={{
                              position: "absolute",
                              top: "100%",
                              right: "50%",
                              width: "100px",
                            }}
                          >
                            <input
                              type="search"
                              placeholder="Enter Part Of Name..."
                              style={{
                                borderRadius: "5px",
                                border: "1px solid gray",
                                outline: "none",
                                fontSize: "13px",
                              }}
                              className="px-1 py-1"
                              value={searchedName}
                              onChange={(e) => {
                                setSearchedName(e.target.value);
                              }}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </button>
                    </div>
                  </th>
                  <th style={{ textAlign: "left" }}>
                    <div className="flex">
                      Phone
                      <button
                        className="border-0 px-2 bg-transparent"
                        style={{
                          position: "relative",
                          cursor: "static",
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
                            if (viewPhoneSearch) {
                              setViewPhoneSearch(false);
                              setSearchedPhone("");
                            } else {
                              setViewNameSearch(false);
                              setSearchedName("");
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
                              width: "100px",
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
                    </div>
                  </th>
                  <th style={{ textAlign: "left" }}>Course</th>
                  <th style={{ textAlign: "right" }}>{`Amount (VND)`}</th>
                  {navigation == 1 || navigation == 4 ? (
                    <></>
                  ) : (
                    <th style={{ textAlign: "center" }}>Booking Time</th>
                  )}
                  {navigation == 1 ? (
                    <>
                      <th style={{ textAlign: "center" }}>Payment Time</th>
                    </>
                  ) : (
                    <></>
                  )}
                  {navigation == 1 || navigation == 4 ? (
                    <>
                      <th style={{ textAlign: "center" }}>Method</th>
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
                  {navigation == 7 ? (
                    <th style={{ textAlign: "center" }}>Confirm</th>
                  ) : (
                    <></>
                  )}
                  {/* {navigation != 7 ? (
                    <th style={{ textAlign: "center" }}>Status</th>
                  ) : (
                    <></>
                  )} */}
                  {/* {navigation == 1 ? (
                    <>
                      <th style={{ textAlign: "center" }}>Refund</th>
                    </>
                  ) : (
                    <></>
                  )} */}
                </tr>
              </thead>

              <tbody
                style={{
                  height: "auto",
                }}
              >
                {listOfBooking
                  .filter((item) => {
                    if (navigation === 1) {
                      return (
                        item.status === 1 ||
                        item.status === 3 ||
                        item.status === 8
                      );
                    }
                    if (navigation === 4) {
                      return (
                        item.status === 4 ||
                        item.status === 6 ||
                        item.status === 9
                      );
                    }
                    return item.status === navigation;
                  })
                  .filter((item) =>
                    item.account.phone
                      .trim()
                      .toLowerCase()
                      .includes(searchedPhone.trim().toLowerCase())
                  )
                  .filter((item) => {
                    if (
                      item != null &&
                      item != undefined &&
                      item.account != null &&
                      item.account != undefined
                    ) {
                      if (listOfSearchedName.length <= 0) {
                        return true;
                      } else if (listOfSearchedName.length <= 1) {
                        for (let i = 0; i < listOfSearchedName.length; i++) {
                          if (
                            item.account.firstName
                              .trim()
                              .toLowerCase()
                              .includes(
                                listOfSearchedName[i]
                                  .toString()
                                  .trim()
                                  .toLowerCase()
                              ) ||
                            item.account.lastName
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
                  .sort((a, b) => {
                    if (navigation == 5) {
                      return (
                        new Date(b.bookingDate).getTime() -
                        new Date(a.bookingDate).getTime()
                      );
                    }
                    if (navigation == 7) {
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
                      let indexCompare = Math.floor(index / currentPageSize);
                      if (index >= currentPageSize && !viewPagination) {
                        setViewPagination(true);
                      }
                      if (indexCompare > numberOfPage) {
                        setNumberOfPage(indexCompare + 1);
                      }
                      if (viewPagination) {
                        if (!(indexCompare === currentPagination - 1)) {
                          return <></>;
                        }
                      }
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
                            B{id.toString().length == 1 ? "00" : <></>}
                            {id.toString().length == 2 ? "0" : ""}
                            {id}
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

                          {navigation == 1 || navigation == 4 ? (
                            <></>
                          ) : (
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
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
                          )}

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

                          {/* Payment Method  */}
                          {status == 1 ||
                          status == 6 ||
                          ((status == 3 || status == 4) && id % 3 != 0) ? (
                            <td style={{ textAlign: "center" }}>VNPAY</td>
                          ) : (
                            <></>
                          )}
                          {status == 8 ||
                          status == 9 ||
                          ((status == 3 || status == 4) && id % 3 == 0) ? (
                            <td style={{ textAlign: "center" }}>ATM</td>
                          ) : (
                            <></>
                          )}

                          {/* {navigation == 1 || navigation == 4 ? (
                            <td style={{ textAlign: "center" }}>
                              {status == 1 || status == 6 ? (
                                <>"VNPAY"</>
                              ) : (
                                <></>
                              )}
                              {status == 8 || status == 7 ? <>"ATM"</> : <></>}
                            </td>
                          ) : (
                            <></>
                          )} */}

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
                              {status === 6 || status === 9 ? (
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
                                            status,
                                            id
                                          );
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
                          {navigation == 7 ? (
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
                              {status == 7 ? (
                                <>
                                  <button
                                    className="bg-success text-light border-0 py-1 px-2 mt-0"
                                    style={{ borderRadius: "10px" }}
                                    onClick={() => {
                                      Swal.fire({
                                        title: `Are you sure to confirm payment?`,
                                        icon: "info",
                                        showCancelButton: true,
                                        showConfirmButton: true,
                                        confirmButtonText: "Yes",
                                        cancelButtonText: "No",
                                        allowOutsideClick: false,
                                        focusCancel: false,
                                        focusConfirm: true,
                                        confirmButtonColor: "green",
                                        cancelButtonColor: "red",
                                      }).then((result) => {
                                        if (
                                          result.isDenied === true ||
                                          result.isDismissed === true
                                        ) {
                                        } else if (
                                          result.isConfirmed === true
                                        ) {
                                          handleConfirmInternetBankingBooking(
                                            id
                                          );
                                          setRecently([...recently, id]);
                                        }
                                      });
                                    }}
                                  >
                                    Confirm
                                  </button>
                                  <br></br>
                                  <button
                                    className="bg-danger text-light border-0
                                     py-1 mt-1 px-2 mt-0"
                                    style={{ borderRadius: "10px" }}
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
                            </td>
                          ) : (
                            <></>
                          )}
                          {/* {status == 7 ? (
                            <></>
                          ) : (
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
                          )} */}

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
                {viewPagination ? (
                  <tr>
                    <td colSpan={7}>
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
                        pageSizeOptions={[5, 10, 20, 50, 100]}
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
