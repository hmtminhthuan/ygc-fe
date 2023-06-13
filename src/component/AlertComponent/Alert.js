import Swal from "sweetalert2";

export const alert = {
  alertSuccess: function (title, html, callback) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      width: "30rem",
      background: "#eef6ec",
      // color: " red",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: `${title}`,
      html: `${html}`,
    }).then(function () {
      callback();
    });
  },
  alertFailed: function (title, html, callback) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      width: "30rem",
      background: "#fee3e2",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "error",
      title: `${title}`,
      html: `${html}`,
    }).then(function () {
      callback();
    });
  },
  alertSuccessWithTime: function (title, html, time, width, callback) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      width: `${width.toString()}rem`,
      background: "#eef6ec",
      showConfirmButton: false,
      timer: time,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: `${title}`,
      html: `${html}`,
    }).then(function () {
      callback();
    });
  },
  alertFailedWithTime: function (title, html, time, width, callback) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      width: `${width.toString()}rem`,
      background: "#fee3e2",
      showConfirmButton: false,
      timer: time,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "error",
      title: `${title}`,
      html: `${html}`,
    }).then(function () {
      callback();
    });
  },
  alertFailedWithTimeNoCallback: function (title, html, time, width) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      width: `${width.toString()}rem`,
      background: "#fee3e2",
      showConfirmButton: false,
      timer: time,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "error",
      title: `${title}`,
      html: `${html}`,
    });
  },
  alertInfoNotiForTrainee: function (title, html, callback) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      width: "35rem",
      padding: "2rem",
      background: "#e8ffff",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "info",
      title: `${title}`,
      html: `${html}`,
    }).then(function () {
      callback();
    });
  },
};
