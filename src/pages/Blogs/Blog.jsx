import React, { useEffect, useState } from "react";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Banner from "../../component/Banner/Banner";
import BlogDetail from "./BlogDetail";
import axios from "axios";
import "./Blog.scss";
import "./BlogDetail.scss";
import { api } from "../../constants/api";
import FooterHome from "../../component/FooterHome/FooterHome";

function Blog() {
  let [blogList, setBlogList] = useState([]);

  useEffect(() => {
    api
      .get("/Blog/GetBlogList")
      .then((res) => {
        setBlogList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      <HeaderHome />
      <Banner title={"Our Blog"} descripton={"Yoga Blog Series"} />
      <section className="w-100 bloglist-area px-md-4">
        <div className="blog-contaier flex justify-content-center align-content-center">
          <div className="row">
            {blogList.map((blog, index) => {
              const formattedDate = formatDate(blog.date);
              return (
                <BlogDetail
                  key={index}
                  blogID={blog.blogID}
                  header={blog.header}
                  content={blog.content}
                  date={formattedDate}
                  firstName={blog.firstName}
                />
              );
            })}
          </div>
        </div>
      </section>

      <nav aria-label="Page navigation example ">
        <ul className="pagination justify-content-center align-content-center">
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">«</span>
              <span className="sr-only">Previous</span>
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">»</span>
              <span className="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="mt-5">
        <FooterHome />
      </div>
    </div>
  );
}

export default Blog;
