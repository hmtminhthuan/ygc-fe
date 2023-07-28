import React from "react";
import { Card } from "react-bootstrap";
import "./BlogDetail.scss";
import { NavLink, useNavigate } from "react-router-dom";
export default function BlogDetail({
  blogID,
  header,
  content,
  firstName,
  lastName,
  img,
  day,
  month,
  year,
  ...restParam
}) {
  const navigate = useNavigate();
  return (
    <Card
      className="blog-entry justify-content-end my-5 mx-5 shadow-none shadow-none border-0"
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate(`/blogPage/${blogID}`);
      }}
    >
      <div className="w-100 block-20">
        <Card.Img src={img} />
      </div>
      <Card.Body className="text p-4 float-right d-block">
        <Card.Title>
          <div className="d-flex align-items-center pt-2 mb-3 ">
            <div className="one" style={{ width: "80px" }}>
              <span className="day">{day}</span>
            </div>

            <div
              className="two"
              style={{
                width: "calc(100% - 80px)",
              }}
            >
              <span className="yr" style={{ display: "block" }}>
                {year}
              </span>
              <span className="mos" style={{ display: "block" }}>
                {month}
              </span>
            </div>
          </div>
        </Card.Title>

        <Card.Text>
          <h3 className="heading mt-2 mb-2">
            <NavLink
              to={`/blogPage/${blogID}`}
              style={{ textDecoration: "none" }}
            >
              {header}
            </NavLink>
          </h3>

          <p>
            {content.length >= 80
              ? content.substring(0, 80).trim() + "..."
              : content}{" "}
            {content.length >= 80 ? (
              <NavLink
                to={`/blogPage/${blogID}`}
                className="text-decoration-none"
              >
                View More
              </NavLink>
            ) : (
              <></>
            )}
          </p>
        </Card.Text>

        <p className="blogger mt-5 pt-2">
          {firstName} {lastName}
        </p>
      </Card.Body>
    </Card>
  );
}
