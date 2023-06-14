import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../../component/Admin/HeaderAdmin/HeaderAdmin";
import MenuAdmin from "../../../component/Admin/MenuAdmin/MenuAdmin";
import { api } from "../../../constants/api";
import "./AdminDashboard.scss";

export default function AdminDashboard() {
  localStorage.setItem("MENU_ACTIVE", "admin-dashboard");
  const [countList, setCountList] = useState([]);
  useEffect(() => {
    api
      .get("/api/AdminRepositoryAPI/GetOverallStatistics")
      .then((res) => {
        const total = res.data;
        setCountList(total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <HeaderAdmin />
      <section className="main" id="admin-course-management-area">
        <MenuAdmin />
        <div className="main--content staff-course-view pt-3 px-5">
          <div className="overview">
            <div className="title">
              <h2 className="section--title">Overview</h2>
            </div>
            <div className="row cards flex justify-content-between">
              <div
                className="col-sm-3 card card-1 text-center"
                style={{ width: "28%" }}
              >
                <div className="card--data ">
                  <div className="card--content">
                    <h5 className="card--title">Total Staffs</h5>
                    <h1>{countList.numOfStaff}</h1>
                  </div>
                  <i className="ri-user-star-line card--icon--lg " />
                </div>
              </div>
              <div
                className="col-sm-3 card card-2 text-center"
                style={{ width: "28%" }}
              >
                <div className="card--data ">
                  <div className="card--content">
                    <h5 className="card--title">Total Trainers</h5>
                    <h1>{countList.numOfTrainer}</h1>
                  </div>
                  <i className="ri-user-2-line card--icon--lg " />
                </div>
              </div>
              <div
                className="col-sm-3 card card-3 text-center"
                style={{ width: "28%" }}
              >
                <div className="card--data  ">
                  <div className="card--content">
                    <h5 className="card--title">Total Trainees</h5>
                    <h1>{countList.numOfTrainee}</h1>
                  </div>
                  <i className="ri-team-line card--icon--lg " />
                </div>
              </div>
              <div
                className="col-sm-3 card card-4 text-center"
                style={{ width: "28%" }}
              >
                <div className="card--data ">
                  <div className="card--content">
                    <h5 className="card--title">Courses</h5>
                    <h1>{countList.numOfCourse}</h1>
                  </div>
                  <i className="mr-4  ri-book-mark-line card--icon--lg" />
                </div>
              </div>
              <div
                className="col-sm-3 card card-5 text-center"
                style={{ width: "28%" }}
              >
                <div className="card--data">
                  <div className="card--content">
                    <h5 className="card--title">Classes</h5>
                    <h1>{countList.numOfClass}</h1>
                  </div>
                  <i className="mr-4 ri-community-line card--icon--lg" />
                </div>
              </div>

              {/* <div className="col-sm-3 card card-6 text-center"
              style={{ width: "30%" }}>
                <div className="card--data ">
                  <div className="card--content">
                    <h5 className="card--title">Feedbacks</h5>
                    <h1>{countList.numOfFeedback}</h1>
                  </div>
                  <i className="mr-4 ri-wechat-line card--icon--lg" />
                </div>
              </div> */}

              <div
                className="col-sm-3 card card-7 text-center"
                style={{ width: "28%" }}
              >
                <div className="card--data ">
                  <div className="card--content">
                    <h5 className="card--title">Blogs</h5>
                    <h1>{countList.numOfBlog}</h1>
                  </div>
                  <i className="mr-4 ri-terminal-window-fill card--icon--lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
