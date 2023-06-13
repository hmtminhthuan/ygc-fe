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
      let minute = minutes - 60 * hour;
      let second = seconds - 60 * minute - hour * 60 * 60;
      document.querySelector(`p#timeleft-id-${bookingID}`).innerHTML = `${
        hour <= 9 ? "0" : ""
      }${hour}:${minute <= 9 ? "0" : ""}${minute}:${
        second <= 9 ? "0" : ""
      }${second}`;
      if (
        seconds < 0 ||
        document.querySelector(`p#timeleft-id-${bookingID}`) == null
      ) {
        clearInterval();
        if (document.querySelector(`p#timeleft-id-${bookingID}`) == null) {
          document.querySelector(`p#timeleft-id-${bookingID}`).innerHTML = "";
        }
      }
    }, 1000);
  },
};
