import React from "react";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import FooterHome from "../../component/FooterHome/FooterHome";
import HomeCarousel from "../../templates/HomeTemplate/HomeCarousel/HomeCarousel";
import HomeContent from "../../component/HomeContent/HomeContent";
import FAQ from "../../component/FAQ/FAQ";
export default function Home() {
  localStorage.setItem("MENU_ACTIVE", "home-home");
  return (
    <div>
      <HeaderHome />
      <HomeCarousel />

      <HomeContent />

      <FooterHome />
    </div>
  );
}
