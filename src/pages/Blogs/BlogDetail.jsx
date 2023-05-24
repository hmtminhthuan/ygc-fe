import React from "react";
import { Button, Card } from "react-bootstrap";
import image from "../../assets/images/banner-1.jpg";
export default function BlogDetail({
  header,
  content,
  firstName,
  lastName,
  ...restParams
}) {
  return (
    <div className="col-lg-4 col-md-6 flex justify-content-center">
      <Card style={{ width: "85%" }} className="my-5">
        <div className="w-100 text-center mt-4">
          <Card.Img variant="top" src={image} />
        </div>
        <Card.Body>
          <Card.Title>{header}</Card.Title>

          <Card.Text>{content}</Card.Text>
          <p className="course-level"> {firstName}</p>

          <div className="button text-center">
            <Button className="course-view-detail" variant=" mx-1 mt-2">
              Read More
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
