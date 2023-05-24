import React, { useEffect, useState } from "react";
import maleImg from "../../../../assets/images/avt-male.jpg";
import femaleImg from "../../../../assets/images/avt-female.jpg";
import axios from "axios";
import "./CourseFeedback.scss";
export default function CourseFeedback({ courseFeedback, ...restParams }) {
    let traineeInfoArr = [];
    let [traineeInfo, setTraineeInfo] = useState([]);
    let [count, setCount] = useState(0);

    useEffect(() => {
        courseFeedback.forEach(({ id, ...restParams }) => {
            axios
                .get("http://localhost:5000/Feedback/GetFeedbackDetailForTrainee", {
                    params: {
                        feedbackId: id,
                    },
                })
                .then((res) => {
                    traineeInfoArr.push({ ...res.data, id });
                    if (traineeInfoArr.length == courseFeedback.length) {
                        setTraineeInfo(traineeInfoArr);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        if (courseFeedback.length <= 0) {
            setCount((prevCount) => prevCount + 1);
        } else {
            setCount(0);
        }
    }, [count]);

    return (
        <div className="row flex align-items-center justify-content-center">
            <div className="col-10">
                {courseFeedback.length <= 0 ? (
                    <p
                        className="text-danger text-center p-0 m-0"
                        style={{ fontSize: "18px", fontWeight: "600" }}
                    >
                        No rating or feedback yet!
                    </p>
                ) : (
                    <div>
                        {courseFeedback.map(
                            (
                                {
                                    id,
                                    traineeId,
                                    courseId,
                                    rating,
                                    status,
                                    description,
                                    coursename,
                                },
                                index
                            ) => {
                                let pos = traineeInfo.findIndex(obj => { return obj.id == id });
                                return (
                                    <div
                                        className="row m-3 mx-0 mx-lg-5 mt-0 flex justify-content-center align-items-start"
                                        key={index}
                                    >
                                        <div className="col-2 flex justify-content-end align-items-start px-3">
                                            <img
                                                className="feedback-trainee-img"
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                }}
                                                src={maleImg}
                                            />
                                        </div>
                                        <div className="col-9">
                                            {traineeInfo.length == courseFeedback.length ? (
                                                <p className="p-0 m-0" style={{ fontWeight: "600" }}>
                                                    <span> {traineeInfo[pos].firstname}</span>{" "}
                                                    <span>  {traineeInfo[pos].lastname}</span>{" "}
                                                </p>
                                            ) : (
                                                <></>
                                            )}
                                            <p className="p-0 mt-2">
                                                <span style={{ color: "#e47200", fontWeight: "500" }}>
                                                    Rating:
                                                </span>{" "}
                                                <i
                                                    className={`fa-solid fa-star ${rating >= 1 ? "star-active" : ""
                                                        }`}
                                                ></i>
                                                <i
                                                    className={`fa-solid fa-star ${rating >= 2 ? "star-active" : ""
                                                        }`}
                                                ></i>
                                                <i
                                                    className={`fa-solid fa-star ${rating >= 3 ? "star-active" : ""
                                                        }`}
                                                ></i>
                                                <i
                                                    className={`fa-solid fa-star ${rating >= 4 ? "star-active" : ""
                                                        }`}
                                                ></i>
                                                <i
                                                    className={`fa-solid fa-star ${rating >= 5 ? "star-active" : ""
                                                        }`}
                                                ></i>
                                            </p>

                                            <p className="p-0 m-0">{description}</p>
                                        </div>
                                        <hr className="mt-4" />
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
