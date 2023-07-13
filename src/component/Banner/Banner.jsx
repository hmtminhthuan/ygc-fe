import React from "react";
import HeaderHome from "../HeaderHome/HeaderHome";
import "./Banner.scss";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
export default function Banner({ title, descripton, ...restparams }) {
  return (
    <div>
      <section className="hero-wrap hero-wrap-banner js-fullheight">
        <div className="overlay" />
        <div className="container banner-container w-100 h-100 flex justify-content-center align-items-center">
          <h1 style={{ fontSize: "50px", fontWeight: "bolder" }}>{title}</h1>
          <p style={{ fontSize: "25px" }}>{descripton}</p>
        </div>
      </section>
    </div>
  );
}
