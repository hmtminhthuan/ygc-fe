import React, { useEffect, useState } from "react";
import maleImg from "../../../../assets/images/avt-male.jpg";
import femaleImg from "../../../../assets/images/avt-female.jpg";
import "../../../Courses/CourseDetail/CourseFeedback/CourseFeedback.scss";
import { api } from "../../../../constants/api";
export default function AdminCourseFeedback({ courseFeedback, ...restParams }) {
  let traineeInfoArr = [];
  let [traineeInfo, setTraineeInfo] = useState([]);
  let [count, setCount] = useState(0);

  useEffect(() => {
    courseFeedback.forEach(({ id, ...restParams }) => {
      api
        .get("/Feedback/GetFeedbackDetailForAdmin", {
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
        .catch((err) => {});
    });
    if (courseFeedback.length <= 0) {
      setCount((prevCount) => prevCount + 1);
    } else {
      setCount(0);
    }
  }, [count]);

  return (
    <div className="course-detail-fb row flex align-items-center justify-content-start px-3">
      <div
        className="col-10"
        style={{
          height: "180px",
          overflowY: "scroll",
        }}
      >
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
                let pos = traineeInfo.findIndex((obj) => {
                  return obj.id == id;
                });
                return (
                  <div
                    className="row flex justify-content-start align-items-start"
                    key={index}
                  >
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
                          traineeInfo.length == courseFeedback.length &&
                          traineeInfo[pos].img != null &&
                          traineeInfo[pos].img.toLowerCase().trim() == "male"
                            ? maleImg
                            : femaleImg
                        }
                      />
                    </div>
                    <div className="col-10">
                      {traineeInfo.length == courseFeedback.length ? (
                        <p className="p-0 m-0" style={{ fontWeight: "600" }}>
                          <span> {traineeInfo[pos].firstname}</span>{" "}
                          <span> {traineeInfo[pos].lastname}</span>{" "}
                        </p>
                      ) : (
                        <></>
                      )}
                      <p className="p-0 mt-2">
                        <span style={{ color: "#e47200", fontWeight: "500" }}>
                          Rating:
                        </span>{" "}
                        <i
                          className={`fa-solid fa-star ${
                            rating >= 1 ? "star-active" : ""
                          }`}
                        ></i>
                        <i
                          className={`fa-solid fa-star ${
                            rating >= 2 ? "star-active" : ""
                          }`}
                        ></i>
                        <i
                          className={`fa-solid fa-star ${
                            rating >= 3 ? "star-active" : ""
                          }`}
                        ></i>
                        <i
                          className={`fa-solid fa-star ${
                            rating >= 4 ? "star-active" : ""
                          }`}
                        ></i>
                        <i
                          className={`fa-solid fa-star ${
                            rating >= 5 ? "star-active" : ""
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
