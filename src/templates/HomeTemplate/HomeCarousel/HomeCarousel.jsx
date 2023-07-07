import React, { useEffect } from "react";
import "./HomeCarousel.scss";

export default function HomeCarousel() {
  useEffect(() => {
    var TxtType = function (el, toRotate, period) {
      this.toRotate = toRotate;
      this.el = el;
      this.loopNum = 0;
      this.period = 1000;
      this.txt = "";
      this.tick();
      this.isDeleting = false;
    };

    TxtType.prototype.tick = function () {
      var i = this.loopNum % this.toRotate.length;
      var fullTxt = this.toRotate[i];

      if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }

      this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

      var that = this;
      var delta = 200 - Math.random() * 100;

      if (this.isDeleting) {
        delta /= 2;
      }

      if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === "") {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
      }

      setTimeout(function () {
        that.tick();
      }, delta);
    };

    window.onload = function () {
      var elements = document.getElementsByClassName("typewrite");
      for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute("data-type");
        var period = elements[i].getAttribute("data-period");
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
      }
      // INJECT CSS
      var css = document.createElement("style");
      css.type = "text/css";
      css.innerHTML = ".typewrite > .wrap { border-right: 2px solid #000;";
      document.body.appendChild(css);
    };
  }, []);

  return (
    <section className="hero-wrap js-fullheight">
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
              <a
                href="/"
                className="btn btn-primary p-3 px-4"
                style={{ fontSize: "18px" }}
              >
                <span style={{ fontWeight: "bolder", color: "#000" }}>
                  Super Hot
                </span>{" "}
                "15 Day Free Trial"
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
