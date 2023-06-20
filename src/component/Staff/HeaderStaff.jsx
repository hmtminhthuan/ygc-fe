import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import user from "../../assets/images/user.jpg";
import maleImg from "../../assets/images/avt-male.jpg";
import femaleImg from "../../assets/images/avt-female.jpg";
import { Link } from "react-router-dom";
import "./HeaderStaff.scss";
import { api } from "../../constants/api";
import moment from "moment/moment";
export default function HeaderStaff({ background, ...restParams }) {
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  const USER = JSON.parse(USER_LOGIN);
  const [alarm, setAlarm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewStaffNotification, setViewStaffNotification] = useState(false);
  const renderNotificationItem = (title, content, date) => {
    return (
      <div className="staff-notifications-item">
        <p
          className="staff-notifications-title p-0 m-0"
          style={{
            fontSize: "16px",
            textAlign: "justify",
            fontWeight: "bolder",
          }}
        >
          {title}
        </p>
        <p
          className="staff-notifications-date p-0 m-0"
          style={{
            fontSize: "13px",
            textAlign: "justify",
            color: "gray",
          }}
        >
          {moment(new Date(date)).format("DD-MM-YYYY, HH:mm")}
          {/* {moment(new Date(date)).format("DD-MM-YYYY")} */}
        </p>
        <p
          className="staff-notifications-content p-0 m-0"
          style={{ fontSize: "14px", textAlign: "justify" }}
        >
          {content}
        </p>
        <hr className="p-0 m-0 mt-2" />
      </div>
    );
  };
  const [listOfNotification, setListOfNotification] = useState([]);
  const [listOfBooking, setListOfBooking] = useState([]);
  const renderBooking = () => {
    api
      .get(`/CheckOutVNPAY/GetAllBooking`)
      .then((res) => {
        setListOfBooking(res.data);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    let current_booking_id = localStorage.getItem("current_booking_id");
    if (current_booking_id == null || current_booking_id == undefined) {
      if (listOfBooking.length > 0) {
        localStorage.setItem("staff_booking_notification_seen", true);
        localStorage.setItem(
          "staff_booking_notification_view",
          JSON.stringify([])
        );
        localStorage.setItem("current_booking_id", listOfBooking.length);
        localStorage.setItem(
          "staff_booking_notification",
          JSON.stringify([
            {
              status: 0,
              quantity: listOfBooking.filter((item) => item.status == 0).length,
            },
            {
              status: 1,
              quantity: listOfBooking.filter((item) => item.status == 1).length,
            },
            {
              status: 2,
              quantity: listOfBooking.filter((item) => item.status == 2).length,
            },
            {
              status: 3,
              quantity: listOfBooking.filter((item) => item.status == 3).length,
            },
            {
              status: 4,
              quantity: listOfBooking.filter((item) => item.status == 4).length,
            },
            {
              status: 5,
              quantity: listOfBooking.filter((item) => item.status == 5).length,
            },
            {
              status: 6,
              quantity: listOfBooking.filter((item) => item.status == 6).length,
            },
          ])
        );
      }
    } else {
      // const currentDate = new Date();
      let current_booking_id_real = parseInt(
        localStorage.getItem("current_booking_id")
      );
      let notificationList = JSON.parse(
        localStorage.getItem("staff_booking_notification_view")
      );
      let seenYet = localStorage.getItem("staff_booking_notification_seen");
      let bookingList = JSON.parse(
        localStorage.getItem("staff_booking_notification")
      );
      bookingList.forEach((item) => {
        let number =
          listOfBooking.filter(
            (booking) => parseInt(booking.status) == parseInt(item.status)
          ).length - parseInt(item.quantity);
        if (
          number > 0 &&
          ((parseInt(item.status) == 5 &&
            current_booking_id_real < listOfBooking.length) ||
            parseInt(item.status) != 5)
        ) {
          item.quantity = listOfBooking.filter(
            (booking) => parseInt(booking.status) == parseInt(item.status)
          ).length;
          let pos = notificationList.findIndex(
            (theItem) =>
              theItem.status != undefined &&
              theItem.name == "staff-booking" &&
              parseInt(theItem.status) == parseInt(item.status)
          );
          if (pos >= 0) {
            // notificationList.splice(pos, 1);
            // notificationList = [
            //   ...notificationList,
            //   {
            //     name: "staff-booking",
            //     status: item.status,
            //     compare: localStorage.getItem("staff_booking_notification_seen")
            //       ? number
            //       : number + parseInt(notificationList[0].compare),
            //     date: currentDate,
            //   },
            // ];
            notificationList[pos].compare = localStorage.getItem(
              "staff_booking_notification_seen"
            )
              ? number
              : number + parseInt(notificationList[pos].compare);
            notificationList[pos].date = currentDate;
          } else {
            notificationList = [
              ...notificationList,
              {
                name: "staff-booking",
                status: item.status,
                compare: number,
                date: currentDate,
              },
            ];
          }
          localStorage.setItem("staff_booking_notification_seen", false);
          if (
            parseInt(item.status) == 1 ||
            (parseInt(item.status) == 5 &&
              current_booking_id_real < listOfBooking.length) ||
            parseInt(item.status) == 6
          ) {
            setAlarm(true);
          }
        }
      });
      // localStorage.setItem(
      //   "staff_booking_notification",
      //   JSON.stringify(bookingList)
      // );
      localStorage.setItem(
        "staff_booking_notification_view",
        JSON.stringify(notificationList)
      );
      localStorage.setItem(
        "staff_booking_notification",
        JSON.stringify([
          {
            status: 0,
            quantity: listOfBooking.filter((item) => item.status == 0).length,
          },
          {
            status: 1,
            quantity: listOfBooking.filter((item) => item.status == 1).length,
          },
          {
            status: 2,
            quantity: listOfBooking.filter((item) => item.status == 2).length,
          },
          {
            status: 3,
            quantity: listOfBooking.filter((item) => item.status == 3).length,
          },
          {
            status: 4,
            quantity: listOfBooking.filter((item) => item.status == 4).length,
          },
          {
            status: 5,
            quantity: listOfBooking.filter((item) => item.status == 5).length,
          },
          {
            status: 6,
            quantity: listOfBooking.filter((item) => item.status == 6).length,
          },
        ])
      );
      localStorage.setItem("current_booking_id", listOfBooking.length);
      if (notificationList != null && notificationList != undefined) {
        setListOfNotification(notificationList);
      }
      if (current_booking_id_real < listOfBooking.length) {
        localStorage.setItem("current_booking_id", listOfBooking.length);
        localStorage.setItem("staff_booking_notification_seen", false);
        // setAlarm(true);
      }
    }
  }, [listOfBooking, listOfBooking.length]);
  useEffect(() => {
    renderBooking();
    setCurrentDate(new Date());
    setInterval(() => {
      renderBooking();
      let notificationList = JSON.parse(
        localStorage.getItem("staff_booking_notification_view")
      );
      if (notificationList != null && notificationList != undefined) {
        setListOfNotification(notificationList);
      }
    }, 10000);
  }, []);
  console.log("header", listOfBooking);
  return (
    <>
      <section className="headerdb p-0">
        <div className="logo mt-2">
          <h2 style={{ cursor: "pointer" }}>
            <i className="ri-menu-line icon icon-0 menu mx-2" />
          </h2>
          <h2
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <img src={logo} />
            Yoga<span>Center</span>
          </h2>
        </div>
        <div
          style={{
            cursor: "pointer",
          }}
          className="search--notification--profile flex justify-content-end"
          onClick={() => {
            if (viewStaffNotification) {
              setViewStaffNotification(false);
            } else {
              setViewStaffNotification(true);
              localStorage.setItem("staff_booking_notification_seen", true);
              setAlarm(false);
            }
          }}
        >
          {/* <div className="search">
          <input type="text" placeholder="Search..." />
          <button>
            <i className="ri-search-2-line" />
          </button>
        </div> */}
          <div className="notification--profile">
            <div
              className="picon bell text-warning py-1"
              style={{
                fontSize: "20px",
                transform: "scaleX(1.2)",
                position: "relative",
              }}
            >
              <i className="ri-notification-2-line" />
              <div
                className="bg-danger"
                style={{
                  position: "absolute",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  bottom: "0",
                  right: "0",
                  display: `${alarm ? "" : "none"}`,
                }}
              ></div>
              {/* <div
              className="bg-info"
              style={{
                position: "absolute",
                zIndex: "10000",
                height: "100px",
                width: "20vw",
                top: "100%",
                right: "0",
              }}
            ></div> */}
            </div>

            <div className="picon profile">
              {USER.img == "male" ? (
                <img
                  src={maleImg}
                  alt="Image"
                  className="shadow img-user-profile"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <></>
              )}
              {USER.img == "female" ? (
                <img
                  src={femaleImg}
                  alt="Image"
                  className="shadow img-user-profile"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <></>
              )}
              {USER.img != "" && USER.img != "male" && USER.img != "female" ? (
                <img
                  src={USER.img}
                  alt="Image"
                  className="shadow img-user-profile"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="px-2 flex align-items-center">
              <h5
                className="p-0 px-3 m-0"
                style={{
                  fontWeight: "800",
                  transform: "scale(1.3)",
                  color: "rgb(227,106,200)",
                }}
              >{`${USER.firstName} ${USER.lastName}`}</h5>
            </div>
          </div>
        </div>
      </section>
      <div
        className="staff-notifications py-2"
        style={{
          position: "absolute",
          height: "500px",
          width: "20vw",
          top: "50px",
          right: "15px",
          zIndex: "99999",
          borderRadius: "5px",
          display: `${viewStaffNotification ? "" : "none"}`,
        }}
      >
        <div
          className="staff-notifications-area"
          style={{ width: "90%", margin: "0 auto" }}
        >
          {listOfNotification.length <= 0 ? (
            <h5 className="p-0 m-0" style={{ fontWeight: "bolder" }}>
              No Notifications yet
            </h5>
          ) : (
            ""
          )}
          {listOfNotification
            .filter((item) => item.name == "staff-booking")
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map(({ status, compare, date }, index) => {
              if (parseInt(status) == 5) {
                {
                  return renderNotificationItem(
                    "Booking: New Class Booking",
                    `There ${
                      compare > 1 ? "are" : "is"
                    } ${compare} new booking.`,
                    date
                  );
                }
              }
              if (parseInt(status) == 1) {
                {
                  return renderNotificationItem(
                    "Booking: New Payment",
                    `There ${
                      compare > 1 ? "are" : "is"
                    } ${compare} new booking having been paid.`,
                    date
                  );
                }
              }
              if (parseInt(status) == 6) {
                {
                  return renderNotificationItem(
                    "Booking: Request to refund",
                    `There ${
                      compare > 1 ? "are" : "is"
                    } ${compare} new request to refund.`,
                    date
                  );
                }
              }
              return <></>;
            })}
          {/* {renderNotificationItem("Booking", "hihi")} */}
        </div>
      </div>
    </>
  );
}
