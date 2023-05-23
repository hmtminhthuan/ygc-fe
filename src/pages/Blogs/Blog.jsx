import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import $ from "jquery";
import "jquery-migrate";
import "popper.js";
import "bootstrap";
import "jquery.easing";
import "jquery.waypoints";
import "jquery.stellar";
import "owl.carousel";
import "jquery.magnific-popup";
import "aos";
import "jquery.animateNumber";
import "bootstrap-datepicker";
import "jquery.timepicker";
import "scrollax";
import "google-map";
import "main";

function Blog() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" id="ftco-navbar">
        <Container>
          <Navbar.Brand href="index.html">Yogalax</Navbar.Brand>
          <Navbar.Toggle aria-controls="ftco-nav" />
          <Navbar.Collapse id="ftco-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="classes.html">Classes</Nav.Link>
              <Nav.Link href="schedule.html">Schedule</Nav.Link>
              <Nav.Link href="about.html">About</Nav.Link>
              <Nav.Link href="blog.html" active>
                Blog
              </Nav.Link>
              <Nav.Link href="contact.html">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <section
        className="hero-wrap js-fullheight"
        style={{ backgroundImage: "url('images/bg_3.jpg')" }}
      >
        <div className="overlay"></div>
        <Container>
          <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center">
            <div className="col-md-9 ftco-animate text-center">
              <h1 className="mb-3 bread">Our Blog</h1>
              <p className="breadcrumbs">
                <span className="mr-2">
                  <a href="index.html">Home</a>
                </span>{" "}
                <span>Blog</span>
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="ftco-section bg-light">
        <Container>
          <div className="row d-flex">{/* Blog entries */}</div>
          <div className="row mt-5">
            <div className="col text-center">
              <div className="block-27">
                <ul>
                  <li>
                    <a href="#">&lt;</a>
                  </li>
                  <li className="active">
                    <span>1</span>
                  </li>
                  <li>
                    <a href="#">2</a>
                  </li>
                  <li>
                    <a href="#">3</a>
                  </li>
                  <li>
                    <a href="#">4</a>
                  </li>
                  <li>
                    <a href="#">5</a>
                  </li>
                  <li>
                    <a href="#">&gt;</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <footer className="ftco-footer ftco-section img">
        <div className="overlay"></div>
        <Container>
          <div className="row mb-5">{/* Footer widgets */}</div>
          <div className="row">
            <div className="col-md-12 text-center">
              <p>{/* Footer text */}</p>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}

export default Blog;
