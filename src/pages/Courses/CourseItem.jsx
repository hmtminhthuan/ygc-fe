import React from "react";
import { Button, Card } from "react-bootstrap";
import "./CourseItem.scss";
import { Link } from "react-router-dom";
import image from "../../assets/images/img-demo.jpg";
export default function CourseDetail({
    courseID,
    courseName,
    description,
    levelName,
    price,
    discount,
    ...restParams
}) {
    discount = 10;
    description =
        `Lorem ipx praesentium debitis, quidem eaque distinctio 
        saepe fugiat dolor laborum velit quis, obcaecati quibusdam. 
        Voluptate fugiat maxime recusandae voluptatibus!`;
    const formatPrice = (price) => {
        return Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };
    return (
        <div className="col-lg-4 col-md-6 flex justify-content-center">
            <Card style={{ width: "85%" }} className="my-4">
                <div className="w-100 text-center">
                    <Card.Img variant="top" src={image} />
                </div>
                <div className="course-tag-discount py-2 pt-1 px-2">
                    <p>{discount}&#37;</p>
                    <p>Discount</p>
                </div>
                <Card.Body>
                    <p className="course-level my-2 mt-2"> Level: {levelName}</p>
                    <Card.Title>{courseName}</Card.Title>
                    <Card.Text>
                        {description.length >= 120
                            ? description.substring(0, 120).trim() + "..."
                            : description}{" "}
                        {description.length >= 120 ? <Link to={`/courseDetail/${courseID}`} className="text-decoration-none">View More</Link> : <></>}
                    </Card.Text>
                    {discount != null && discount != "" && discount >= 0 ? (
                        <p className="my-2 mt-0">
                            <span className="course-price-before-discount p-0">
                                {formatPrice(price)}
                            </span>
                            <span className="course-price-after-discount mx-2 p-0">
                                {formatPrice(price - (price * discount) / 100)}
                            </span>
                        </p>
                    ) : (
                        <p className="course-price my-2 mt-2">{formatPrice(price)} </p>
                    )}

                    <div className="button text-center pt-1">
                        <Button href={`/courseDetail/${courseID}`} className="course-view-detail mx-1 mt-1" variant="">
                            View Details
                        </Button>
                        <Button href="" className="course-register-now mx-1 mt-1" variant="">
                            Register Now
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div >
    );
}
