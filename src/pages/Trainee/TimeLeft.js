export const timeLeft = {
  getTimeLeft: function (date, bookingID, payingTime) {
    setInterval(() => {
      let seconds =
        payingTime * 60 * 60 -
        Math.abs(
          Math.round(
            (new Date().getTime() -
              (new Date(date).getTime() + 14 * 1000 * 60 * 60)) /
              1000
          )
        );
      let minutes = Math.floor(seconds / 60);
      let hour = Math.floor(seconds / 60 / 60);
      let minute = Math.floor(minutes - 60 * hour);
      let second = Math.floor(seconds - 60 * minute - hour * 60 * 60);
      if (seconds < 0) {
        clearInterval();
        document.querySelector(`p#timeleft-id-${bookingID}`).innerHTML = "";
      } else {
        document.querySelector(`p#timeleft-id-${bookingID}`).innerHTML = `${
          hour <= 9 ? "0" : ""
        }${hour}:${minute <= 9 ? "0" : ""}${minute}:${
          second <= 9 ? "0" : ""
        }${second}`;
      }
    }, 1000);
  },
};
