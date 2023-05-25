import React, { useEffect, useState } from "react";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Banner from "../../component/Banner/Banner";
import BlogDetail from "./BlogDetail";
import axios from "axios";
import "./Blog.scss";
import "./BlogDetail.scss";

function Blog() {
  let [blogList, setBlogList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/Blog/GetBlogList")
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

      {/* Footer */}
      <footer className="w3-row-padding w3-padding-32">
        <div className="w3-third">
          <h3>FOOTER</h3>
          <p>
            Praesent tincidunt sed tellus ut rutrum. Sed vitae justo
            condimentum, porta lectus vitae, ultricies congue gravida diam non
            fringilla.
          </p>
        </div>

        {/* <div className="w3-third">
          <h3>BLOG POSTS</h3>
          <ul className="w3-ul w3-hoverable">
            <li className="w3-padding-16">
              <img
                src="https://www.w3schools.com/w3images/workshop.jpg"
                className="w3-left w3-margin-right"
                style={{ width: "50px" }}
              />
              <span className="w3-large">Lorem</span>
              <br />
              <span>Sed mattis nunc</span>
            </li>
            <li className="w3-padding-16">
              <img
                src="https://www.w3schools.com/w3images/gondol.jpg"
                className="w3-left w3-margin-right"
                style={{ width: "50px" }}
              />
              <span className="w3-large">Ipsum</span>
              <br />
              <span>Praes tinci sed</span>
            </li>
          </ul>
        </div> */}
        <div className="w3-third w3-serif">
          <h3>POPULAR TAGS</h3>
          <p>
            <span className="w3-tag w3-black w3-margin-bottom">Travel</span>{" "}
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              New York
            </span>{" "}
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Dinner
            </span>
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Salmon
            </span>{" "}
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              France
            </span>{" "}
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Drinks
            </span>
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Ideas
            </span>{" "}
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Flavors
            </span>{" "}
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Cuisine
            </span>
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Chicken
            </span>{" "}
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Dressing
            </span>{" "}
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Fried
            </span>
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Fish
            </span>{" "}
            <span className="w3-tag w3-dark-grey w3-small w3-margin-bottom">
              Duck
            </span>
          </p>
        </div>
      </footer>
      {/* </div> */}
    </div>
  );
}

export default Blog;
