import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate, NavLink } from "react-router-dom";
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

  const handleDashboardClick = () => {
    if (userLogin.role.id == 1) {
      navigateTo("home-dashboard-admin");
      navigate("/admin");
    } else if (userLogin.role.id == 2) {
      navigateTo("home-dashboard-staff");
      navigate("/staff");
    }
  };

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
            <Navbar.Brand href="/" className="header-brand">
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
            <Nav className="">
              <NavLink
                to="/"
                className={`px-4 nav-item
              ${
                menu_active != null && menu_active == "home-home"
                  ? "nav-item-after-login"
                  : ""
              }`}
                // onClick={() => {
                //   localStorage.setItem("MENU_ACTIVE", "home-home");
                // }}
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
                menu_active != null && menu_active == "home-course"
                  ? "nav-item-after-login"
                  : ""
              }`}
                // onClick={() => {
                //   localStorage.setItem("MENU_ACTIVE", "home-course");
                // }}
                onClick={() => {
                  navigateTo("home-course");
                }}
              >
                Course
              </NavLink>
              <NavLink
                to="/blog"
                className={`px-4 nav-item
              ${
                menu_active != null && menu_active == "home-blog"
                  ? "nav-item-after-login"
                  : ""
              }`}
                // onClick={() => {
                //   localStorage.setItem("MENU_ACTIVE", "home-blog");
                // }}
                onClick={() => {
                  navigateTo("home-blog");
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
                      className={`px-4 nav-item`}
                      onClick={() => {
                        if (userLogin.role.id == 1) {
                          navigate("/admin");
                        }
                        if (userLogin.role.id == 2) {
                          navigate("/staff");
                        }
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
                        className={`px-4 nav-item
                    ${
                      menu_active != null && menu_active == "home-schedule"
                        ? "nav-item-after-login"
                        : ""
                    }`}
                        onClick={() => {
                          navigateTo("home-schedule");
                          navigate("/trainer/schedule");
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
                        className={`px-4 nav-item
                    ${
                      menu_active != null && menu_active == "home-schedule"
                        ? "nav-item-after-login"
                        : ""
                    }`}
                        // onClick={() => {
                        //   localStorage.setItem("MENU_ACTIVE", "home-schedule");
                        //   window.location.href = "/trainee/schedule";
                        // }}
                        onClick={() => {
                          navigateTo("home-schedule");
                          navigate("/trainee/schedule");
                        }}
                      >
                        Schedule
                      </NavLink>
                      <NavLink
                        className={`px-4 nav-item
                    ${
                      menu_active != null && menu_active == "home-booking"
                        ? "nav-item-after-login"
                        : ""
                    }`}
                        // onClick={() => {
                        //   localStorage.setItem("MENU_ACTIVE", "home-booking");
                        //   window.location.href = "/transaction";
                        // }}
                        onClick={() => {
                          navigateTo("home-booking");
                          navigate("/transaction");
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
                    className={`px-4 nav-item
                     ${
                       menu_active != null && menu_active === "home-profile"
                         ? "nav-item-after-login"
                         : ""
                     }`}
                    onClick={() => {
                      navigateTo("home-profile");
                      navigate(`/profile`);
                    }}
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
                menu_active != null && menu_active == "home-login"
                  ? "nav-item-after-login"
                  : ""
              }`}
                    // onClick={() => {
                    //   localStorage.setItem("MENU_ACTIVE", "home-login");
                    // }}
                    onClick={() => {
                      navigateTo("home-login");
                    }}
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={`px-4 nav-item
              ${
                menu_active != null && menu_active == "home-register"
                  ? "nav-item-after-login"
                  : ""
              }`}
                    // onClick={() => {
                    //   localStorage.setItem("MENU_ACTIVE", "home-register");
                    // }}
                    onClick={() => {
                      navigateTo("home-register");
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
                  className={`px-4 nav-item`}
                  onClick={() => {
                    localStorage.removeItem("USER_LOGIN");
                    localStorage.removeItem("MENU_ACTIVE");
                    USER = {};
                    setUserLogin({});
                    // window.location.href = "/";
                    navigate("/");
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
