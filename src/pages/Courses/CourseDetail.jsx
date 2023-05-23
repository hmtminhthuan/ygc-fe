import React from 'react'
import { Button, Card } from "react-bootstrap";
import image from "../../assets/images/banner-1.jpg"
export default function CourseDetail({ courseName, description, levelName, price, ...restParams }) {
    return (
        <div className="col-lg-4 col-md-6 flex justify-content-center">
            <Card style={{ width: '80%' }} className='p-0 my-5'>
                <Card.Img variant="top" src={image} />
                <Card.Body>
                    <Card.Title>{courseName}</Card.Title>
                    <Card.Text>
                        {description}
                    </Card.Text>
                    <Card.Text>
                        {levelName}
                    </Card.Text>
                    <Card.Text>
                        {price}
                    </Card.Text>
                    <Button variant="primary">View Details</Button>
                </Card.Body>
            </Card>
        </div>
    )
}
