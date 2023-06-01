let list = document.querySelectorAll(".menu-navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

for (i = 0; i < list.length; i++) {
  console.log("haha");
}
// list.foreach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
// let toggle = document.querySelector(".toggle");
// let navigation = document.querySelector(".navigation");
// let main = document.querySelector(".main");

// toggle.onclick = function () {
//   navigation.classList.toggle("active");
//   main.classList.toggle("active");
// };
