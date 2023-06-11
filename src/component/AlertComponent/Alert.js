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
};
