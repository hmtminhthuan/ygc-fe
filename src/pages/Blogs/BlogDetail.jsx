import React from "react";
import { Button, Card } from "react-bootstrap";
import "./BlogDetail.scss";
import image from "../../assets/images/img_blog.jpg";
export default function BlogDetail({
  date,
  header,

  content,
  firstName,

  ...restParams
}) {
  return (
    <div className=" col-lg-4 col-md-6 flex justify-content-center">
      <Card className="blog-entry justify-content-end my-5 mx-5 shadow-none shadow-none border-0">
        <div className="w-100 block-20">
          <Card.Img src={image} />
        </div>
        <Card.Body className="text p-4 float-right d-block">
          <Card.Title>
            <div className="d-flex align-items-center pt-2 mb-3 ">
              <div className="one" style={{ width: "80px" }}>
                <span className="day">31</span>
              </div>

              <div
                className="two"
                style={{
                  width: "calc(100% - 80px)",
                }}
              >
                <span className="yr" style={{ display: "block" }}>
                  2023
                </span>
                <span className="mos" style={{ display: "block" }}>
                  January
                </span>
              </div>
            </div>
          </Card.Title>

          <Card.Text>
            <h3 className="heading mt-2">
              <a href="" style={{ textDecoration: "none" }}>
                {header}
              </a>
            </h3>
            {/* {content} */}
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum,
              explicabo?
            </p>
          </Card.Text>

          <p className="blogger mt-2">{firstName}</p>
        </Card.Body>
      </Card>
    </div>
  );
}
