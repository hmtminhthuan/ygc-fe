import React, { useEffect, useState } from "react";
import { api } from "../../constants/api";
import moment from "moment/moment";

export default function Transaction() {
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
    <div>
      <h1 className="m-0 p-0 my-3 text-center">Billing History</h1>
      <div className="main--content transaction-trainee m-0 px-4 w-50">
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>No.</th>
              <th style={{ textAlign: "left" }}>Course</th>
              <th style={{ textAlign: "left" }}>Booking Date</th>
              <th style={{ textAlign: "right" }}>{`Amount (VND)`}</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}></th>
            </tr>
          </thead>

          <tbody style={{ height: "auto" }}>
            {listOfBooking.map(
              ({ bookingDate, amount, status, course }, index) => {
                return (
                  <tr key={index}>
                    <td style={{ textAlign: "left" }}>{index + 1}</td>
                    <td style={{ textAlign: "left" }}>{course.courseName}</td>
                    <td style={{ textAlign: "left" }}>
                      {moment(new Date(bookingDate)).format("DD - MM - YYYY")}
                    </td>
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
                            Success
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
                    <td style={{ textAlign: "center" }}>Action</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
