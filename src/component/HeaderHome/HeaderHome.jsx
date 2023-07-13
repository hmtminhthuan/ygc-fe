import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import "./HeaderHome.scss";
export default function HeaderHome() {
  const menu_active = localStorage.getItem("MENU_ACTIVE");
  const [userLogin, setUserLogin] = useState({});
  const navigateTo = (link) => {
    localStorage.setItem("MENU_ACTIVE", link);
    navigate(link);
  };

  const navigate = useNavigate();

  let USER = {};
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  if (USER_LOGIN != null && !userLogin.accountID) {
    USER = JSON.parse(USER_LOGIN);
    setUserLogin(USER);
  }
  useEffect(() => {
    document.addEventListener("scroll", () => {
      let header = document.getElementById("bg-header");
      if (window.scrollY > 50 && !(header == null)) {
        header.classList.add("bg-header-scrolled");
      } else if (header != null) {
        header.classList.remove("bg-header-scrolled");
      }
    });
  }, []);

  return (
    <header>
      <Navbar
        expand="lg"
        className="justify-content-center header border-0"
        id="bg-header"
      >
        <Container className="header-container">
          <div className="flex align-items-center">
            <img
              src={logo}
              style={{ height: "40px", width: "40px", marginRight: "10px" }}
            />
            <Navbar.Brand
              as={NavLink}
              to="/"
              className="header-brand"
              onClick={() => navigateTo("/")}
            >
              Yoga Center
            </Navbar.Brand>
          </div>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="header-toggle"
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="flex justify-content-end px-3 py-2 pt-0 header-small navbar-item"
          >
            <Nav
              className="nav-item-area"
              style={{ transform: "translateY(5px)" }}
            >
              <NavLink
                to="/"
                className={`px-4 nav-item
                ${
                  menu_active != null && menu_active == "home-home"
                    ? "nav-item-after-login"
                    : ""
                }`}
                onClick={() => {
                  navigateTo("home-home");
                }}
              >
                Home
              </NavLink>
              <NavLink
                to="/course"
                className={`px-4 nav-item
                ${
                  menu_active != null && menu_active == "/course"
                    ? "nav-item-after-login"
                    : ""
                }`}
                onClick={() => {
                  navigateTo("/course");
                }}
              >
                Course
              </NavLink>
              <NavLink
                to="/blog"
                className={`px-4 nav-item
                ${
                  menu_active != null && menu_active == "/blog"
                    ? "nav-item-after-login"
                    : ""
                }`}
                onClick={() => {
                  navigateTo("/blog");
                }}
              >
                Blog
              </NavLink>
              {USER_LOGIN != null &&
              userLogin.accountID != null &&
              userLogin.accountID != undefined ? (
                <>
                  {userLogin.role.id != undefined &&
                  userLogin.role.id != null &&
                  (userLogin.role.id == 1 || userLogin.role.id == 2) ? (
                    <NavLink
                      to={userLogin.role.id == 1 ? "/admin" : "/staff"}
                      className={`px-4 nav-item`}
                      onClick={() => {
                        navigateTo(
                          userLogin.role.id == 1 ? "/admin" : "/staff"
                        );
                      }}
                    >
                      Dashboard
                    </NavLink>
                  ) : (
                    <></>
                  )}
                  {userLogin.role.id != undefined &&
                  userLogin.role.id != null &&
                  userLogin.role.id == 3 ? (
                    <>
                      <NavLink
                        to="/trainer/schedule"
                        className={`px-4 nav-item
                        ${
                          menu_active != null &&
                          menu_active == "/trainer/schedule"
                            ? "nav-item-after-login"
                            : ""
                        }`}
                        onClick={() => {
                          navigateTo("/trainer/schedule");
                        }}
                      >
                        Schedule
                      </NavLink>
                    </>
                  ) : (
                    <></>
                  )}
                  {userLogin.role.id != undefined &&
                  userLogin.role.id != null &&
                  userLogin.role.id == 4 ? (
                    <>
                      <NavLink
                        to="/trainee/schedule"
                        className={`px-4 nav-item
                        ${
                          menu_active != null &&
                          menu_active == "/trainee/schedule"
                            ? "nav-item-after-login"
                            : ""
                        }`}
                        onClick={() => {
                          navigateTo("/trainee/schedule");
                        }}
                      >
                        Schedule
                      </NavLink>
                      <NavLink
                        to="/transaction"
                        className={`px-4 nav-item
                        ${
                          menu_active != null && menu_active == "/transaction"
                            ? "nav-item-after-login"
                            : ""
                        }`}
                        onClick={() => {
                          navigateTo("/transaction");
                        }}
                      >
                        History
                      </NavLink>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* <p className="p-0 m-0 flex align-items-center px-2">
                    Welcome, {userLogin.firstName} {userLogin.lastName}
                  </p> */}

                  <NavLink
                    to="/profile"
                    className={`px-4 nav-item
                     ${
                       menu_active != null && menu_active == "/profile"
                         ? "nav-item-after-login"
                         : ""
                     }`}
                    onClick={() => {
                      navigateTo("/profile");
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    Profile
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={`px-4 nav-item
                    ${
                      menu_active != null && menu_active == "/login"
                        ? "nav-item-after-login"
                        : ""
                    }`}
                    onClick={() => {
                      navigateTo("/login");
                    }}
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={`px-4 nav-item
                    ${
                      menu_active != null && menu_active == "/register"
                        ? "nav-item-after-login"
                        : ""
                    }`}
                    onClick={() => {
                      navigateTo("/register");
                    }}
                  >
                    Register
                  </NavLink>
                </>
              )}
              {USER_LOGIN != null &&
              userLogin.accountID != null &&
              userLogin.accountID != undefined ? (
                <NavLink
                  to="/"
                  className={`px-4 nav-item`}
                  onClick={() => {
                    localStorage.removeItem("USER_LOGIN");
                    localStorage.removeItem("MENU_ACTIVE");
                    USER = {};
                    setUserLogin({});
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: `<h1>Log Out Successfully</h1>`,
                      html: ``,
                      showConfirmButton: false,
                      timer: 1000,
                    });
                  }}
                >
                  <div className="flex p-0 m-0">LogOut</div>
                </NavLink>
              ) : (
                <></>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
