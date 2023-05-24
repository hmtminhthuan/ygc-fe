import React, { useEffect } from "react";
import { useParams } from "react-router";
import HeaderHome from "../../../component/HeaderHome/HeaderHome";
import axios from "axios";
export default function CourseDetail() {
    const param = useParams();
    console.log(param.id);

    useEffect(() => {
        axios
            .get("http://localhost:5000/Course/GetCourseByID", {
                params: { id: param.id },
            })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <div>
            <HeaderHome />
        </div>
    );
}
