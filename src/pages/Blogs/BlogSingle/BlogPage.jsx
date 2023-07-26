import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "remixicon/fonts/remixicon.css";
import HeaderHome from "../../../component/HeaderHome/HeaderHome";
import user from "../../../assets/images/user.jpg";

import "./BlogPage.scss";
import { NavLink } from "react-router-dom";
import { api } from "../../../constants/api";
import FooterHome from "../../../component/FooterHome/FooterHome";

export default function BlogPage() {
  localStorage.setItem("MENU_ACTIVE", "/blog");
  const param = useParams();
  const [blogDetail, setBlogDetail] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      timer: 800,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    api
      .get("/Blog/GetBlogById", {
        params: { id: param.id },
      })
      .then((res) => {
        setBlogDetail(res.data);
        setIsDataLoaded(true);
      })
      .catch((err) => {});
  }, [param.id]);

  useEffect(() => {
    if (isDataLoaded) {
      Swal.close();
    }
  }, [isDataLoaded]);

  if (blogDetail === null) {
    return null;
  }

  let {
    blogID,
    header,
    content,
    firstName,
    lastName,
    date,
    img,
    ...restParams
  } = blogDetail;

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formattedDate = formatDate(date);

  const formatContentWithBoldPhrases = (content) => {
    return content.split("\n").map((paragraph, index) => {
      const colonIndex = paragraph.indexOf(":");
      if (colonIndex !== -1) {
        const boldPart = paragraph.slice(0, colonIndex + 1); // Get the part before colon, including the colon itself
        const normalPart = paragraph.slice(colonIndex + 1); // Get the part after colon
        return (
          <React.Fragment key={index}>
            <strong style={{ fontSize: "20px" }}>{boldPart}</strong>
            {normalPart}
            <br />
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={index}>
            {paragraph}
            <br />
          </React.Fragment>
        );
      }
    });
  };

  const formattedContent = formatContentWithBoldPhrases(content);

  return (
    <div>
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>
      <main className="pt-5">
        <div className={`box course-detail-area mt-5 my-5 px-5 pt-4`}>
          <div className="course-detail-info w-100 form-container flex-column justify-content-start align-items-start p-3">
            <div
              className="close px-0 mx-0"
              style={{ textAlign: "right", margin: "10px 50px" }}
            >
              <NavLink
                to={"/blog"}
                style={{
                  textDecoration: "none",
                  marginRight: "10px",
                  color: "rgb(208, 143, 186)",
                }}
              >
                Close
                <i className="fa-solid fa-circle-xmark"></i>
              </NavLink>
            </div>

            <div className="title align-items-center justify-content-center text-center my-3 mb-4">
              <h1 style={{ fontWeight: "800" }}>{header}</h1>
            </div>

            <div className="user mb-3">
              <a className="avatar " href="">
                <img src={user} alt="" />
              </a>

              <div className="info">
                <p style={{ margin: "0" }}>
                  {firstName} {lastName}
                </p>
                <p className="time"> {formattedDate}</p>
              </div>
            </div>

            <div className="content blog-content">
              <p>{formattedContent}</p>

              <p className="">
                <img src={img} alt="" style={{ borderRadius: "25px" }} />
              </p>

              <div className="tag-widget post-tag-container mb-5 mt-5">
                <div className="tag-cloud">
                  <a href="" className="tag-cloud-link">
                    Life
                  </a>
                  <a href="" className="tag-cloud-link">
                    Sport
                  </a>
                  <a href="" className="tag-cloud-link">
                    Tech
                  </a>
                  <a href="" className="tag-cloud-link">
                    Travel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div>
        <FooterHome />
      </div>
    </div>
  );
}
