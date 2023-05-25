import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import HeaderHome from "../../../component/HeaderHome/HeaderHome";
import user from "../../../assets/images/user.jpg";
import axios from "axios";
import "./BlogPage.scss";
import { Link } from "react-router-dom";

function BlogPage() {
  const param = useParams();
  const [blogDetail, setBlogDetail] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/Blog/GetBlogById", {
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
    return null; // Render loading state or handle the case when blogDetail is not available yet
  }

  let { blogID, header, content, firstName, date, ...restParams } = blogDetail;

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
      <HeaderHome />
      <main>
        <div className="box">
          <div className="inner-box">
            <div className="close">
              <Link to={"/blog"}>
                <a href="">Close</a>
                <i className="fa-solid fa-circle-xmark"></i>
              </Link>
            </div>

            <div className="exit mt-2">
              <a>
                {previousBlogID > 0 && (
                  <Link to={`/blogPage/${previousBlogID}`}>
                    <i className="fa-solid fa-arrow-left mx-3 mt-2"></i>
                  </Link>
                )}
              </a>

              <a>
                {" "}
                {nextBlogID > 0 && (
                  <Link to={`/blogPage/${nextBlogID}`}>
                    <i className="fa-solid fa-arrow-right mx-3"></i>
                  </Link>
                )}
              </a>
            </div>
            <div className="title text-center my-3 mb-4">
              <h1 style={{ fontWeight: "800" }}>{header}</h1>
            </div>

            <div className="user mb-4 mx-5">
              <a className="avatar " href="">
                <img src={user} alt="" />
              </a>

              <div className="info ">
                <a href="">{firstName}</a>
                <p className="time"> {formattedDate}</p>
              </div>
            </div>

            <div className="content">
              <p>{content}</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus vel nam possimus aperiam ea ut aliquid mollitia
                labore? Dignissimos quo, voluptates quae corporis quos saepe
                exercitationem. Voluptatibus quod non ab nesciunt mollitia ad
                assumenda corrupti maiores repudiandae quis fuga dolore,
                officiis voluptatem blanditiis nam, provident quisquam totam,
                iste accusamus ipsa alias. Accusantium autem officiis provident
                totam magni facere eveniet voluptates soluta? Modi libero animi
                nesciunt impedit rem tempore nemo, corporis perspiciatis
                quaerat, aliquid debitis adipisci minima inventore et. Numquam,
                tenetur et quas ipsam molestiae velit quo sequi mollitia, fugiat
                doloremque eaque deleniti vero, assumenda accusantium optio
                officiis! Atque, quas accusamus?
              </p>

              <p>
                <img
                  src="https://themewagon.github.io/yogalax/images/image_1.jpg"
                  alt=""
                />
              </p>

              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Ratione dicta fuga repellat rem numquam aliquid necessitatibus
                maiores sit quaerat id, aperiam exercitationem corrupti
                temporibus doloremque dolorum veritatis nesciunt vitae ad harum
                incidunt impedit atque? Aperiam, cumque molestias! Reprehenderit
                incidunt molestias eaque velit iusto sed neque delectus facilis
                voluptatum aliquam dignissimos asperiores dolore ullam labore
                laudantium officiis nesciunt numquam odit omnis doloribus
                voluptates consequatur, eius distinctio pariatur! Nostrum
                placeat illum earum, esse beatae ipsum. Laudantium veniam
                quaerat reprehenderit sit! Aliquam a officia quis quos minima
                officiis blanditiis fugit eaque quae veritatis eveniet commodi,
                doloremque perferendis expedita repellat ratione id corrupti!
                Minima?
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
    </div>
  );
}
export default BlogPage;