import React from "react";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import FooterHome from "../../component/FooterHome/FooterHome";
import HomeCarousel from "../../templates/HomeTemplate/HomeCarousel/HomeCarousel";
import HomeContent from "../../component/HomeContent/HomeContent";
import FAQ from "../../component/FAQ/FAQ";
import { motion } from "framer-motion";
export default function Home() {
  let arr = [];

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
    window.location.href = `${redirectLink}`;
  }
  return (
    <div>
      {redirectLink != null &&
      redirectLink != undefined &&
      userLogin != null &&
      userLogin != undefined ? (
        <></>
      ) : (
        <section>
          <HeaderHome />
          <HomeCarousel />
          <HomeContent />
          <FAQ />
          <FooterHome />
        </section>
      )}
    </div>
  );
}
