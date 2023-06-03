import React, { useEffect, useState } from "react";
import maleImg from "../../../../assets/images/avt-male.jpg";
import femaleImg from "../../../../assets/images/avt-female.jpg";
import { api } from "../../../../constants/api";

export default function FeedbackInfo({ feedback, ...restParams }) {
  const [traineeInfo, setTraineeInfo] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  useEffect(() => {
    if (feedback.description.length >= 190) {
      setViewMore(true);
    }
    api
      .get(`/Account/GetUserProfile?id=${feedback.traineeId}`)
      .then((res) => {
        setTraineeInfo(res.data);
      })
      .catch((err) => {});
  }, [feedback.traineeId]);

  const { id, traineeId, courseId, rating, status, description, coursename } =
    feedback;

  return (
    <div className="row flex justify-content-start align-items-start">
      <div className="col-1 flex justify-content-end align-items-star mx-2">
        <img
          className={`course-feedback-trainee-img-null-`}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid #33333330",
          }}
          src={
            traineeInfo.img != null &&
            traineeInfo.img != undefined &&
            traineeInfo.img.toLowerCase().trim() == "male"
              ? maleImg
              : femaleImg
          }
        />
      </div>
      <div className="col-10">
        {traineeInfo.length == feedback.length ? (
          <p className="p-0 m-0 text-start" style={{ fontWeight: "600" }}>
            <span> {traineeInfo.firstname}</span>{" "}
            <span> {traineeInfo.lastname}</span>{" "}
          </p>
        ) : (
          <></>
        )}
        <p className="p-0 mt-2 text-start">
          <span style={{ color: "#e47200", fontWeight: "500" }}>Rating:</span>{" "}
          <i
            className={`fa-solid fa-star ${rating >= 1 ? "star-active" : ""}`}
          ></i>
          <i
            className={`fa-solid fa-star ${rating >= 2 ? "star-active" : ""}`}
          ></i>
          <i
            className={`fa-solid fa-star ${rating >= 3 ? "star-active" : ""}`}
          ></i>
          <i
            className={`fa-solid fa-star ${rating >= 4 ? "star-active" : ""}`}
          ></i>
          <i
            className={`fa-solid fa-star ${rating >= 5 ? "star-active" : ""}`}
          ></i>
        </p>

        <p className="p-0 m-0" style={{ textAlign: "justify" }}>
          {description.length >= 190 && viewMore ? (
            <span>
              {description.substring(0, 190).trim()}
              {"..."}
            </span>
          ) : (
            <span>{description}</span>
          )}{" "}
          {viewMore ? (
            <button
              className="p-0 m-0 border-0 bg-transparent text-info"
              style={{ fontWeight: "500" }}
              onClick={() => {
                setViewMore(false);
                setHideButton(true);
              }}
            >
              View more
            </button>
          ) : (
            <></>
          )}
          {hideButton ? (
            <button
              className="p-0 m-0 border-0 bg-transparent text-info"
              style={{ fontWeight: "500" }}
              onClick={() => {
                setViewMore(true);
                setHideButton(false);
              }}
            >
              Hide
            </button>
          ) : (
            <></>
          )}
        </p>
      </div>
    </div>
  );
}
