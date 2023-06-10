import Swal from "sweetalert2";

export const alert = {
  alertSuccess: function (title, html, callback) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      width: "30rem",
      background: "green",
      color: " red",
      showConfirmButton: false,
      timer: 3000,
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
};
