import React, { useEffect, useState } from "react";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import { api } from "../../../constants/api";
import moment from "moment/moment";

export default function StaffBooking() {
  localStorage.setItem("MENU_ACTIVE", "staff-booking");
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      // style: "currency",
      currency: "VND",
    }).format(price);
  };
  const [listOfBooking, setListOfBooking] = useState([]);
  const [recently, setRecently] = useState([]);
  const renderBooking = () => {
    api
      .get(`/CheckOutVNPAY/GetAllBooking`)
      .then((res) => {
        console.log(res);
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
  useEffect(() => {
    renderBooking();
  }, []);
  const handleAcceptFromPending = (accountID, courseID, classID) => {
    api
      .post(`/api/AdminRepositoryAPI/UpdateBooking`, {
        status: 1,
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
  };
  const handleRefund = (accountID, courseID, classID) => {
    console.log({
      accId: parseInt(accountID),
      courseId: parseInt(courseID),
    });
    // api
    //   .post(`/api/AdminRepositoryAPI/UpdateBooking`, {
    //     status: 4,
    //     accountId: parseInt(accountID),
    //     classId: parseInt(classID),
    //     courseId: parseInt(courseID),
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     renderBooking();
    //   });
    api
      .post(`/CheckOutVNPay/Refund`, {
        accId: parseInt(accountID),
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
  };
  const styleDateAndTime = (date) => {
    return moment(
      new Date(`${date}`).setTime(
        new Date(`${date}`).getTime() + 14 * 60 * 60 * 1000
      )
    ).format(`DD-MM-YYYY, HH:mm`);
  };
  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuStaff />
        <div className="main--content pt-0 px-4 staff-template-scss">
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>No.</th>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "left" }}>Phone</th>
                <th style={{ textAlign: "left" }}>Course</th>
                <th style={{ textAlign: "left" }}>Class</th>
                <th style={{ textAlign: "right" }}>{`Amount (VND)`}</th>
                <th style={{ textAlign: "center" }}>Booking Date</th>
                <th style={{ textAlign: "center" }}>Payment Date</th>
                <th style={{ textAlign: "center" }}>Refund Date</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th style={{ textAlign: "center" }}></th>
              </tr>
            </thead>

            <tbody style={{ height: "auto" }}>
              {listOfBooking.map(
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
                  //   restParams.class.classID
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
                      <td style={{ textAlign: "left" }}>{course.courseName}</td>
                      <td style={{ textAlign: "left" }}>
                        {restParams.class.className}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatPrice(amount)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {
                          // moment(new Date(`${bookingDate}`)).format(
                          //   `DD-MM-YYYY, HH:mm`
                          // )
                          styleDateAndTime(bookingDate)
                        }
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {payDate != null &&
                        payDate != undefined &&
                        payDate != "" ? (
                          <>
                            {
                              moment(new Date(`${payDate}`)).format(
                                `DD-MM-YYYY, HH:mm`
                              )
                              // styleDateAndTime(payDate)
                            }
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
                            {
                              moment(new Date(`${refundDate}`)).format(
                                `DD-MM-YYYY, HH:mm`
                              )
                              // styleDateAndTime(refundDate)
                            }
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {status == 0 ? (
                          <>
                            <span
                              style={{ borderRadius: "10px" }}
                              className="m-0 p-0 py-1 px-2 border-0 bg-warning bg-opacity-10 text-warning"
                            >
                              Pending
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
                      <td style={{ textAlign: "center" }}>
                        {/* {status == 0 ? (
                          <button
                            className="bg-success text-light border-0 py-1 px-2"
                            style={{ borderRadius: "10px" }}
                            onClick={() => {
                              handleAcceptFromPending(
                                accountID,
                                courseID,
                                restParams.class.classID
                              );
                              setRecently([...recently, id]);
                            }}
                          >
                            Accept
                          </button>
                        ) : (
                          ""
                        )} */}
                        {status == 1 ? (
                          <button
                            className="bg-primary text-light border-0 py-1 px-2"
                            style={{ borderRadius: "10px" }}
                            onClick={() => {
                              handleRefund(
                                accountID,
                                courseID,
                                restParams.class.classID
                              );
                              setRecently([...recently, id]);
                            }}
                          >
                            Refund
                          </button>
                        ) : (
                          ""
                        )}
                        {status == 3 ? (
                          <p
                            className="bg-transparent text-danger border-0 p-0 m-0"
                            style={{ borderRadius: "10px" }}
                          >
                            Failed Refund
                          </p>
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
        </div>
      </section>
    </>
  );
}
