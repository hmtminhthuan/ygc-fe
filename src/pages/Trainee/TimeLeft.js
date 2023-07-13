export const timeLeft = {
  getTimeLeft: function (date, bookingID, payingTime, render) {
    let interval = setInterval(() => {
      let seconds =
        payingTime * 60 * 60 -
        Math.abs(
          Math.round((new Date().getTime() - new Date(date).getTime()) / 1000)
        ) +
        5;
      let minutes = Math.floor(seconds / 60);
      let hour = Math.floor(seconds / 60 / 60);
      let minute = Math.floor(minutes - 60 * hour);
      let second = Math.floor(seconds - 60 * minute - hour * 60 * 60);
      if (seconds < 0) {
        render();
        clearInterval(interval);
      } else {
        if (document.querySelector(`p#timeleft-id-${bookingID}`) != null) {
          document.querySelector(`p#timeleft-id-${bookingID}`).innerHTML = `${
            hour <= 9 ? "0" : ""
          }${hour}:${minute <= 9 ? "0" : ""}${minute}:${
            second <= 9 ? "0" : ""
          }${second}`;
        }
      }
    }, 1000);
  },
  checkRefundAvailable: function (payDate, bookingID, refundTime, render) {
    let interval = setInterval(() => {
      if (
        new Date(payDate).setTime(
          new Date(payDate).getTime() + refundTime * 60 * 60 * 1000
        ) -
          new Date().getTime() <
        0
      ) {
        if (document.querySelector(`p#refund-timeleft-${bookingID}`) != null) {
          document.querySelector(
            `p#refund-timeleft-${bookingID}`
          ).innerHTML = ``;
        }
        render();
        clearInterval(interval);
      } else {
        let seconds = Math.round(
          (new Date(payDate).setTime(
            new Date(payDate).getTime() + refundTime * 60 * 60 * 1000
          ) -
            new Date().getTime()) /
            1000
        );
        let minutes = Math.floor(seconds / 60);
        let hour = Math.floor(seconds / 60 / 60);
        let minute = Math.floor(minutes - 60 * hour);
        let second = Math.floor(seconds - 60 * minute - hour * 60 * 60);
        if (document.querySelector(`p#refund-timeleft-${bookingID}`) != null) {
          document.querySelector(
            `p#refund-timeleft-${bookingID}`
          ).innerHTML = `${hour <= 9 ? "0" : ""}${hour}:${
            minute <= 9 ? "0" : ""
          }${minute}:${second <= 9 ? "0" : ""}${second}`;
        }
      }
    }, 1000);
  },
};
