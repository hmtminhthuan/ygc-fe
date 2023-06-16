import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "remixicon/fonts/remixicon.css";
import HeaderHome from "../../../component/HeaderHome/HeaderHome";
import user from "../../../assets/images/user.jpg";

import "./BlogPage.scss";
import { Link } from "react-router-dom";
import { api } from "../../../constants/api";
import FooterHome from "../../../component/FooterHome/FooterHome";

function BlogPage() {
  localStorage.setItem("MENU_ACTIVE", "home-blog");
  const param = useParams();
  const [blogDetail, setBlogDetail] = useState(null);

  useEffect(() => {
    api
      .get("/Blog/GetBlogById", {
        params: { id: param.id },
      })
      .then((res) => {
        setBlogDetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [param.id]);

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

  const previousBlogID = blogID - 1;
  const nextBlogID = blogID + 1;

  return (
    <div>
      <div className="header-top m-4 mx-0 mt-0">
        <HeaderHome />
      </div>
      <main className="pt-5">
        <div className={`box course-detail-area mt-5 my-5 px-5 pt-4`}>
          <div className="course-detail-info w-100 form-container flex-column justify-content-start align-items-start p-3">
            <div className="close px-0 mx-0">
              <Link to={"/blog"}>
                <a href="">Close</a>
                <i className="fa-solid fa-circle-xmark"></i>
              </Link>
            </div>

            <div className="exit mt-5">
              <a>
                {previousBlogID > 0 && (
                  <Link to={`/blogPage/${previousBlogID}`}>
                    <i className="ri-arrow-left-line mx-3 mt-2">aaaaaa</i>
                  </Link>
                )}
              </a>
              <a>
                {nextBlogID > 0 && (
                  <Link to={`/blogPage/${nextBlogID}`}>
                    <i className="fa-solid fa-arrow-right mx-3"></i>
                  </Link>
                )}
              </a>
            </div>
            <div className="title align-items-center justify-content-center text-center my-3 mb-4">
              <h1 style={{ fontWeight: "800" }}>{header}</h1>
            </div>

            <div className="user mb-3">
              <a className="avatar " href="">
                <img src={user} alt="" />
              </a>

              <div className="info">
                <p>
                  {firstName} {lastName}
                </p>
                <p className="time"> {formattedDate}</p>
              </div>
            </div>

            <div className="content blog-content">
              <p>
                {content.split("\r\n").map((paragraph, index) => (
                  <React.Fragment key={index}>
                    {paragraph}
                    <br />
                  </React.Fragment>
                ))}
              </p>

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
export default BlogPage;
