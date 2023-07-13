import React, { useEffect, useState } from "react";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import FooterHome from "../../component/FooterHome/FooterHome";
import HomeCarousel from "../../component/HomeCarousel/HomeCarousel";
import HomeContent from "../../component/HomeContent/HomeContent";
import FAQ from "../../component/FAQ/FAQ";
import { useNavigate } from "react-router";
export default function Home() {
  const navigate = useNavigate();
  localStorage.setItem("MENU_ACTIVE", "home-home");
  const redirectLink = localStorage.getItem("REDIRECT_LINK_BOOK_CLASS");
  const userLogin = localStorage.getItem("USER_LOGIN");
  if (
    redirectLink != null &&
    redirectLink != undefined &&
    (userLogin == null || userLogin == undefined)
  ) {
    localStorage.removeItem("REDIRECT_LINK_BOOK_CLASS");
    localStorage.removeItem("NOTIFICATION_CHOOSE_CLASS");
  }
  if (
    redirectLink != null &&
    redirectLink != undefined &&
    userLogin != null &&
    userLogin != undefined
  ) {
    localStorage.removeItem("REDIRECT_LINK_BOOK_CLASS");
    navigate(`${redirectLink}`);
  }
  useEffect(() => {
    window.scrollTo(0, 0);
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

    // window.onload = function () {
    var elements = document.getElementsByClassName("typewrite");
    for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute("data-type");
      var period = elements[i].getAttribute("data-period");
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    if (document.body.getElementsByTagName("style")[0] == undefined) {
      var css = document.createElement("style");
      css.type = "text/css";
      css.innerHTML = ".typewrite > .wrap { border-right: 2px solid #000;";
      document.body.appendChild(css);
    }
    // };
  }, []);
  return (
    <div>
      {redirectLink != null &&
      redirectLink != undefined &&
      userLogin != null &&
      userLogin != undefined ? (
        <></>
      ) : (
        <>
          <HeaderHome />
          <HomeCarousel />
          <HomeContent />
          <FAQ />
          <FooterHome />
        </>
      )}
    </div>
  );
}
