import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
import logo from "../../assets/images/logo.png"
import "./HeaderHome.scss";
export default function HeaderHome() {
  return (
    <header>
      <Navbar
        expand="lg"
        className="justify-content-center header border-0"
        id="bg-header"
      >
        <Container className="header-container">
          <div className="flex align-items-center">
            <img src={logo}
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
            className="flex justify-content-end header-small"
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
              <Nav.Link href="/login" className="px-4 nav-item">
                Log in
              </Nav.Link>
              <Nav.Link href="/register" className="px-4 nav-item">
                Register
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
