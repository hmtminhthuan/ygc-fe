import React, { useEffect, useState } from "react";
import HeaderHome from "../../component/HeaderHome/HeaderHome";
import Banner from "../../component/Banner/Banner";
import { Button, Card } from "react-bootstrap";
import image from "../../assets/images/banner-1.jpg";
import "./Course.scss";
import CourseDetail from "./CourseItem";
import axios from "axios";
import { Select } from "antd";
import { api } from "../../constants/api";
import FooterHome from "../../component/FooterHome/FooterHome";
export default function Course() {
  localStorage.setItem("MENU_ACTIVE", "/course");
  const [courseList, setCourseList] = useState([]);
  const [renderCourseList, setRenderCourseList] = useState([]);
  const [levelSort, setLevelSort] = useState("All");
  const [price, setPrice] = useState("All");
  const [discount, setDiscount] = useState("All");
  const redirectLink = localStorage.getItem("REDIRECT_LINK_BOOK_CLASS");
  const userLogin = localStorage.getItem("USER_LOGIN");

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  if (
    redirectLink != null &&
    redirectLink != undefined &&
    (userLogin == null || userLogin == undefined)
  ) {
    localStorage.removeItem("REDIRECT_LINK_BOOK_CLASS");
    localStorage.removeItem("NOTIFICATION_CHOOSE_CLASS");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      timer: 900,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    api
      .get("/Course/GetAllCourseForAdmin")
      .then(async (res) => {
        setCourseList(res.data);
        setRenderCourseList(res.data.sort((a, b) => b.discount - a.discount));
        setIsDataLoaded(true);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      Swal.close();
    }
  }, [isDataLoaded]);

  // useEffect(() => {
  //   setInterval(() => {
  //     api
  //       .get("/Course/GetAllCourseForAdmin")
  //       .then(async (res) => {
  //         setCourseList(res.data);
  //         setRenderCourseList(res.data.sort((a, b) => b.discount - a.discount));
  //       })
  //       .catch((err) => {});
  //   }, 10000);
  // }, []);

  useEffect(() => {
    let renderList = [...courseList];
    switch (levelSort) {
      case "All":
        renderList = [...courseList];
        break;
      default:
        renderList = [...courseList].filter((course) =>
          course.levelName.toLowerCase().includes(levelSort.toLowerCase())
        );
        break;
    }
    if (!discount.toLowerCase().includes("all")) {
      renderList = renderList.filter((course) => course.discount > 0);
      renderList = renderList.sort((a, b) => b.discount - a.discount);
    }
    switch (price) {
      case "Ascending":
        renderList = renderList.sort(
          (a, b) =>
            a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100)
        );
        break;
      case "Descending":
        renderList = renderList.sort(
          (a, b) =>
            b.price * (1 - b.discount / 100) - a.price * (1 - a.discount / 100)
        );
        break;
    }
    setRenderCourseList(renderList);
  }, [levelSort]);

  useEffect(() => {
    let renderList = [...courseList];
    if (!levelSort.toLowerCase().includes("all")) {
      renderList = [...courseList].filter((course) =>
        course.levelName.toLowerCase().includes(levelSort.toLowerCase())
      );
    }
    switch (discount) {
      case "Available":
        renderList = renderList.filter((course) => course.discount > 0);
        renderList = renderList.sort((a, b) => b.discount - a.discount);
        break;
      case "All":
        // renderList = [...courseList];
        break;
    }
    switch (price) {
      case "Ascending":
        renderList = renderList.sort(
          (a, b) =>
            a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100)
        );
        break;
      case "Descending":
        renderList = renderList.sort(
          (a, b) =>
            b.price * (1 - b.discount / 100) - a.price * (1 - a.discount / 100)
        );
        break;
    }
    setRenderCourseList(renderList);
  }, [discount]);

  useEffect(() => {
    let renderList = [...courseList];
    if (!levelSort.toLowerCase().includes("all")) {
      renderList = renderList.filter((course) =>
        course.levelName.toLowerCase().includes(levelSort.toLowerCase())
      );
    }
    if (!discount.toLowerCase().includes("all")) {
      renderList = renderList.filter((course) => course.discount > 0);
      renderList = renderList.sort((a, b) => b.discount - a.discount);
    }
    switch (price) {
      case "Ascending":
        renderList = renderList.sort(
          (a, b) =>
            a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100)
        );
        break;
      case "Descending":
        renderList = renderList.sort(
          (a, b) =>
            b.price * (1 - b.discount / 100) - a.price * (1 - a.discount / 100)
        );
        break;
      default:
        // renderList = [...courseList];
        break;
    }
    setRenderCourseList(renderList);
  }, [price]);

  return (
    <div>
      <HeaderHome />
      <Banner title={"Yoga Courses"} descripton={"Yoga Healthy Courses"} />
      <section className="w-100 py-5 pt-2 courlist-area flex-column justify-content-center align-items-center">
        <div
          className="row flex justify-content-center pt-4"
          style={{ margin: "0 auto", width: "85%" }}
        >
          <div
            className="col-lg-4 col-md-12 flex justify-content-center
          sort-course-guest"
          >
            <h4 className="p-0 m-0 py-2 p-0 text-end px-2">Sort By Price</h4>
            <div className="w-50">
              <Select
                className="w-100 text-dark"
                name="price"
                value={price}
                onChange={(value) => {
                  setPrice(value);
                }}
              >
                <Select.Option value={"Ascending"}>Ascending</Select.Option>
                <Select.Option value={"Descending"}>Descending</Select.Option>
                <Select.Option value={"All"}>All</Select.Option>
              </Select>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-12 flex justify-content-center 
           sort-course-guest"
          >
            <h4 className="p-0 m-0 py-2 p-0 text-end px-2">Sort By Discount</h4>
            <div className="w-50">
              <Select
                className="w-100 text-dark"
                name="discount"
                value={discount}
                onChange={(value) => {
                  setDiscount(value);
                }}
              >
                <Select.Option value={"Available"}>
                  Available Discount
                </Select.Option>
                <Select.Option value={"All"}>All</Select.Option>
              </Select>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-12 flex justify-content-center 
           sort-course-guest"
          >
            <h4 className="p-0 m-0 py-2 p-0 text-end px-2">Sort by Level</h4>
            <div className="w-50">
              <Select
                className="w-100 text-dark"
                name="levelSort"
                value={levelSort}
                onChange={(value) => {
                  setLevelSort(value);
                }}
              >
                <Select.Option value={"Beginner"}>Beginner</Select.Option>
                <Select.Option value={"Intermediate"}>
                  Intermediate
                </Select.Option>
                <Select.Option value={"Advanced"}>Advanced</Select.Option>
                <Select.Option value={"All"}>All</Select.Option>
              </Select>
            </div>
          </div>
        </div>

        <div className="course-contaier flex justify-content-center align-content-center">
          <div className="row w-100">
            {renderCourseList
              .filter((item) => !item.deleted)
              .map((course, index) => {
                return (
                  <div
                    className="col-lg-4 col-sm-12 col-md-6 flex justify-content-center"
                    data-aos="fade-up"
                  >
                    <CourseDetail
                      key={index}
                      courseID={course.courseID}
                      courseName={course.courseName}
                      description={course.description}
                      levelName={course.levelName}
                      price={course.price.toString()}
                      discount={course.discount}
                      courseImg={course.courseImg}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      <FooterHome />
    </div>
  );
}
