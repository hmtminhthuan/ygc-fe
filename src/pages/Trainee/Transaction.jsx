import React, { useEffect, useState } from "react";
import { api } from "../../constants/api";
import moment from "moment/moment";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import "./Transaction.scss";
export default function Transaction() {
  localStorage.setItem("MENU_ACTIVE", "home-booking");
  const styleDateAndTime = (date) => {
    return moment(
      new Date(`${date}`).setTime(
        new Date(`${date}`).getTime() + 14 * 60 * 60 * 1000
      )
    ).format("DD-MM-YYYY, HH:mm");
  };
  const [listOfBooking, setListOfBooking] = useState([]);
  useEffect(() => {
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
  console.log(listOfBooking[0]);
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
                <th style={{ textAlign: "center" }}>Payment Date</th>
                <th style={{ textAlign: "center" }}>Refund Date</th>
                {/* <th style={{ textAlign: "center" }}></th> */}
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
                    payDate,
                    refundDate,
                  },
                  index
                ) => {
                  let { firstName, lastName, phone } = account;
                  let { courseName, courseID } = course;
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
                      <td style={{ textAlign: "center" }}>
                        {payDate != null &&
                        payDate != undefined &&
                        payDate != "" ? (
                          <>
                            {moment(new Date(`${payDate}`)).format(
                              `DD-MM-YYYY, HH:mm`
                            )}
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
                      </td>
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
