export const menuAction = {
  menuActive: function () {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main--content");
    sidebar.classList.toggle("active");
    mainContent.classList.toggle("active");
  },
};
