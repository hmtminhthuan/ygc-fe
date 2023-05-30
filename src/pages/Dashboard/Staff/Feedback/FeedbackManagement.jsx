import React, { useEffect, useState } from "react";
import maleImg from "../../../../assets/images/avt-male.jpg";
import femaleImg from "../../../../assets/images/avt-female.jpg";
import { api } from "../../../../constants/api";
import { Link } from "react-router-dom";

export default function FeedbackManagement() {
  const [feedbackList, setFeedbackList] = useState([]);
  useEffect(() => {
    api
      .get("/Feedback/GetFeedbackDetailForAdmin")
      .then((res) => {
        setFeedbackList(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="staff-feedback-area">
      <div className="feedback">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Feedback</th>
              <th>Coursename</th>
              <th>Status</th>
              <th>
                <button className="btn-home px-3 pt-2 pb-2 justify-content-center">
                  <i className="ri-home-2-fill"></i>
                  <Link to={"/dashboard"} className="exit-list">
                    Home
                  </Link>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>
                  <div>
                    <div>
                      Name: {feedback.firstname} {feedback.lastname}
                    </div>
                    <div>Rating: {feedback.rating}</div>
                    <div>Description: {feedback.description}</div>
                  </div>
                </td>
                <td>{feedback.coursename}</td>
                <td>{feedback.status}</td>
                <td className="setting">
                  <i
                    className="ri-delete-bin-line mx-2"
                    // onClick={() => deleteTrainer(trainer.accountID)}
                    // style={{ cursor: "pointer" }}
                  ></i>
                </td>
                <td className="setting">
                  <i
                    className="ri-delete-bin-line mx-2"
                    // onClick={() => deleteTrainer(trainer.accountID)}
                    // style={{ cursor: "pointer" }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
