import React, { useEffect } from "react";
import "./HomeCarousel.scss";
import Aos from "aos";
import { NavLink } from "react-router-dom";

export default function HomeCarousel() {
  Aos.init();
  useEffect(() => {}, []);

  return (
    <section className="hero-wrap js-fullheight home-carousel-area">
      <div id="background-wrap">
        <div className="bubble x1">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x2">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x3">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x4">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x5">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x6">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x7">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x8">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x9">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x10">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x11">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble x12">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="overlay" />
      <div className="overlay2" />
      <div className="container">
        <div className="container row no-gutters slider-text js-fullheight align-items-center justify-content-center">
          <div className="col-md-8 ftco-animate">
            <h1
              id="home-carousel-title"
              className="typewrite mb-3"
              data-period={1500}
              data-type='[ "Inspiration&apos;s Living.", "Mental Therapy.", "Flexible Body."]'
            >
              <span className="wrap" />
            </h1>
            <h2 className="mb-5" style={{ color: "rgba(0, 0, 0)" }}>
              Do Yoga today for a better tomorrow
            </h2>

            <p>
              <NavLink
                to="/course"
                className="btn btn-primary p-3 px-4"
                style={{ fontSize: "18px" }}
              >
                <span style={{ fontWeight: "bolder", color: "#000" }}>
                  Super Hot
                </span>{" "}
                "Discount Course"
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
