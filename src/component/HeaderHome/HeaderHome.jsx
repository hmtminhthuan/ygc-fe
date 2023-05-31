import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import "./HeaderHome.scss";
export default function HeaderHome() {
  const [userLogin, setUserLogin] = useState({});
  let USER = {};
  const USER_LOGIN = localStorage.getItem("USER_LOGIN");
  if (USER_LOGIN != null && !userLogin.accountID) {
    USER = JSON.parse(USER_LOGIN);
    setUserLogin(USER);
  }
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
            className="flex justify-content-end header-small navbar-item"
          >
            <Nav className="">
              <Nav.Link href="/" className="px-4 nav-item">
                Home
              </Nav.Link>
              <Nav.Link href="/course" className="px-4 nav-item">
                Course
              </Nav.Link>
              <Nav.Link href="/blog" className="px-4 nav-item">
                Blog
              </Nav.Link>
              {USER_LOGIN != null &&
              userLogin.accountID != null &&
              userLogin.accountID != undefined ? (
                <>
                  <Nav.Link
                    className="px-4 nav-item"
                    onClick={() => {
                      localStorage.removeItem("USER_LOGIN");
                      USER = {};
                      setUserLogin({});
                      window.location.href = "/";
                    }}
                  >
                    Log out
                  </Nav.Link>
                  {userLogin.role.id != undefined &&
                  userLogin.role.id != null &&
                  (userLogin.role.id == 1 || userLogin.role.id == 2) ? (
                    <Nav.Link
                      className="px-4 nav-item nav-item-after-login"
                      onClick={() => {
                        window.location.href = "/dashboard";
                      }}
                    >
                      Dashboard
                    </Nav.Link>
                  ) : (
                    <></>
                  )}
                  {userLogin.role.id != undefined &&
                  userLogin.role.id != null &&
                  userLogin.role.id == 3 ? (
                    <Nav.Link
                      className="px-4 nav-item nav-item-after-login"
                      onClick={() => {
                        window.location.href = "/trainer";
                      }}
                    >
                      View Schedule
                    </Nav.Link>
                  ) : (
                    <></>
                  )}
                  {userLogin.role.id != undefined &&
                  userLogin.role.id != null &&
                  userLogin.role.id == 4 ? (
                    <Nav.Link
                      className="px-4 nav-item nav-item-after-login"
                      onClick={() => {
                        window.location.href = "/trainee";
                      }}
                    >
                      View Schedule
                    </Nav.Link>
                  ) : (
                    <></>
                  )}
                  <p className="p-0 m-0 flex align-items-center px-2 hello-user">
                    Welcome, {userLogin.firstName} {userLogin.lastName}
                  </p>
                  <Nav.Link
                    className="px-4 nav-item nav-item-after-login"
                    onClick={() => {
                      window.location.href = "/profile/" + userLogin.accountID;
                    }}
                  >
                    Profile
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href="/login" className="px-4 nav-item">
                    Log in
                  </Nav.Link>
                  <Nav.Link href="/register" className="px-4 nav-item">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
