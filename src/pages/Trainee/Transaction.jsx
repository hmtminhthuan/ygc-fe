import React, { useEffect, useState } from "react";
import { api } from "../../constants/api";
import moment from "moment/moment";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import "./Transaction.scss";
import { timeLeft } from "./TimeLeft";
export default function Transaction() {
  localStorage.setItem("MENU_ACTIVE", "home-booking");
  const [payingTime, setPayingTime] = useState(-1);
  const [refundTime, setRefundTime] = useState(-1);
  const [current, setCurrent] = useState(new Date());
  const [listOfBooking, setListOfBooking] = useState([]);
  useEffect(() => {
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
    api
      .get(`/CheckOutVNPAY/GetAllBooking`)
      .then((res) => {
        setListOfBooking(
          [...res.data]
            .filter((item) => {
              return (
                item.account.accountID ==
                JSON.parse(localStorage.getItem("USER_LOGIN")).accountID
              );
            })
            .sort((a, b) => {
              if (
                moment(new Date(a.bookingDate)) <
                moment(new Date(b.bookingDate))
              ) {
                return 1;
              }
              return -1;
            })
        );
      })
      .catch((err) => {});
  }, []);
  // const styleTimeLeft = (date) => {
  //   let seconds =
  //     payingTime * 60 * 60 -
  //     Math.abs(
  //       Math.round(
  //         (current.getTime() -
  //           (new Date(date).getTime() + 14 * 1000 * 60 * 60)) /
  //           1000
  //       )
  //     );
  //   let minutes = Math.floor(seconds / 60);
  //   let hour = Math.floor(seconds / 60 / 60);
  //   let minute = minutes - 60 * hour;
  //   let second = seconds - 60 * minute - hour * 60 * 60;
  //   return `${hour <= 9 ? "0" : ""}${hour}:${minute <= 9 ? "0" : ""}${minute}:${
  //     second <= 9 ? "0" : ""
  //   }${second}`;
  // };
  useEffect(() => {
    if (payingTime >= 0) {
      listOfBooking.forEach((item) => {
        timeLeft.getTimeLeft(item.bookingDate, item.id, payingTime);
      });
    }
  }, [listOfBooking, payingTime]);
  const styleDateAndTime = (date) => {
    return moment(
      new Date(`${date}`).setTime(
        new Date(`${date}`).getTime() + 14 * 60 * 60 * 1000
      )
    ).format("DD-MM-YYYY, HH:mm");
  };
  // console.log(listOfBooking[0]);
  return (
    <>
      <div className=" m-0 p-0">
        <HeaderHome />
      </div>
      <div className="mt-5 pt-3">
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
                <th style={{ textAlign: "center" }}>Booking Date</th>
                <th style={{ textAlign: "center" }}>Note</th>
                {/* <th style={{ textAlign: "center" }}>Payment Date</th>
                <th style={{ textAlign: "center" }}>Refund Date</th> */}
                {/* <th style={{ textAlign: "center" }}></th> */}
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
                  },
                  index
                ) => {
                  let { firstName, lastName, phone } = account;
                  let { courseName, courseID } = course;
                  let timeLeft = "";
                  return (
                    <tr key={index}>
                      <td style={{ textAlign: "left" }}>{index + 1}</td>
                      <td style={{ textAlign: "left" }}>{course.courseName}</td>
                      <td style={{ textAlign: "right" }}>{amount}</td>
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
                      {/* <td style={{ textAlign: "center" }}>Action</td> */}
                      <td style={{ textAlign: "center" }}>
                        {styleDateAndTime(bookingDate)}
                      </td>
                      <td>
                        {status == 0 && payingTime >= 0 ? (
                          <>
                            <span
                              style={{ fontWeight: "bolder" }}
                              className="text-success "
                            >
                              Time Left To Pay
                            </span>
                            <p
                              style={{ fontWeight: "bolder", fontSize: "18px" }}
                              className="text-success p-0 m-0"
                              id={`timeleft-id-${id}`}
                            ></p>
                            <button
                              className="p-0 m-0 bg-success text-light border-0 px-2 py-1 mt-1"
                              style={{ borderRadius: "15px" }}
                              onClick={() => {
                                handlePayAgain();
                              }}
                            >
                              Pay Now
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                        {(status == 1 || status == 3) &&
                        payDate != null &&
                        payDate != undefined &&
                        payDate != "" ? (
                          <>
                            Payment Time:
                            <br />
                            {styleDateAndTime(payDate)}
                          </>
                        ) : (
                          ""
                        )}
                        {status == 4 &&
                        refundDate != null &&
                        refundDate != undefined &&
                        refundDate != "" ? (
                          <>
                            Refund Time:
                            <br />
                            {moment(new Date(`${refundDate}`)).format(
                              `DD-MM-YYYY, HH:mm`
                            )}
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
