import React, { useEffect, useState } from "react";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Banner from "../../component/Banner/Banner";
import BlogDetail from "./BlogDetail";
import axios from "axios";
import "./Blog.scss";
import "./BlogDetail.scss";
import { api } from "../../constants/api";
import FooterHome from "../../component/FooterHome/FooterHome";
import Aos from "aos";

function Blog() {
  localStorage.setItem("MENU_ACTIVE", "/blog");
  let [blogList, setBlogList] = useState([]);
  const redirectLink = localStorage.getItem("REDIRECT_LINK_BOOK_CLASS");
  const userLogin = localStorage.getItem("USER_LOGIN");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  if (
    redirectLink != null &&
    redirectLink != undefined &&
    (userLogin == null || userLogin == undefined)
  ) {
    localStorage.removeItem("REDIRECT_LINK_BOOK_CLASS");
    localStorage.removeItem("NOTIFICATION_CHOOSE_CLASS");
  }
  useEffect(() => {
    window.scrollTo(0, 0);
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
      .get("/Blog/GetBlogList")
      .then((res) => {
        setBlogList(res.data);
        setIsDataLoaded(true);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      Swal.close();
    }
  }, [isDataLoaded]);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  Aos.init();
  return (
    <div>
      <HeaderHome />
      <Banner title={"Our Blog"} descripton={"Yoga Blog Series"} />
      <section className="w-100 bloglist-area py-0 px-md-4">
        <div className="blog-contaier flex justify-content-center align-content-center">
          <div className="row">
            {blogList.map((blog) => {
              const formattedDate = formatDate(blog.date);
              const dateObj = new Date(blog.date);
              const day = dateObj.getDate();
              const month = dateObj.toLocaleString("default", {
                month: "long",
              });
              const year = dateObj.getFullYear();
              return (
                <div
                  className=" col-lg-4 col-md-6 flex justify-content-center"
                  data-aos="zoom-in-up"
                >
                  <BlogDetail
                    // key={index}
                    blogID={blog.blogID}
                    header={blog.header}
                    content={blog.content}
                    // date={formattedDate}
                    day={day}
                    month={month}
                    year={year}
                    firstName={blog.firstName}
                    lastName={blog.lastName}
                    img={blog.img}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mt-5">
        <FooterHome />
      </div>
    </div>
  );
}

export default Blog;
