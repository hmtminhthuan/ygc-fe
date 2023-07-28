import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "remixicon/fonts/remixicon.css";
import HeaderHome from "../../../component/HeaderHome/HeaderHome";
import "./BlogPage.scss";
import { NavLink } from "react-router-dom";
import { api } from "../../../constants/api";
import FooterHome from "../../../component/FooterHome/FooterHome";
import LoadingOverlay from "../../../component/Loading/LoadingOverlay";
import moment from "moment/moment";
export default function BlogPage() {
  localStorage.setItem("MENU_ACTIVE", "/blog");
  const param = useParams();
  const [blogDetail, setBlogDetail] = useState(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/Blog/GetBlogById", {
        params: { id: param.id },
      })
      .then((res) => {
        setBlogDetail(res.data);
        setLoading(false);
      })
      .catch((err) => {});
  }, [param.id]);

  if (blogDetail === null) {
    return <LoadingOverlay loading={loading} />;
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
    return moment(dateString).format("DD - MM - YYYY");
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
      <LoadingOverlay loading={loading} />
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
                  color: "#000",
                  fontWeight: "bolder",
                }}
              >
                Close
                <i className="fa-solid fa-circle-xmark ps-2"></i>
              </NavLink>
            </div>

            <div className="title align-items-center justify-content-center text-center my-3 mb-4">
              <h1 style={{ fontWeight: "800" }}>{header}</h1>
            </div>

            <div className="user mb-3">
              <a className="avatar " href="">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/userImages%2Fdefault--avt--male.jpg?alt=media&token=b62e9e4f-0e8e-43f9-ae9d-fba29d67d112"
                  alt="avatar"
                  style={{ border: "3px solid gray" }}
                />
              </a>

              <div className="info" style={{ color: "#d08fba" }}>
                <h3 style={{ margin: "0" }}>
                  <b>
                    {firstName} {lastName}
                  </b>
                </h3>
                <p className="time">{formattedDate}</p>
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
