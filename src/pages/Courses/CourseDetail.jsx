import React from "react";
import { Button, Card } from "react-bootstrap";
import image from "../../assets/images/banner-1.jpg";
import './CourseDetail.scss'
export default function CourseDetail({
    courseName,
    description,
    levelName,
    price,
    ...restParams
}) {
    return (
        <div className="col-lg-4 col-md-6 flex justify-content-center">
            <Card style={{ width: "85%" }} className="my-5">
                <div className="w-100 text-center mt-4"><Card.Img variant="top" src={image} /></div>
                <Card.Body>
                    <Card.Title>{courseName}</Card.Title>
                    <p className="course-level"> Level: {levelName}</p>
                    <Card.Text>{description}</Card.Text>
                    <h3 className="course-price my-3">Price: {price}</h3>
                    <div className="button text-center">
                        <Button className="course-view-detail" variant=" mx-1 mt-2">View Details</Button>
                        <Button className="course-register-now" variant=" mx-1 mt-2">Register Now</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
