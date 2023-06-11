import React, { useEffect, useState } from "react";
import HeaderStaff from "../../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../../component/Staff/MenuStaff";
import { useFormik } from "formik";
import { DatePicker, Form, Input, Select } from "antd";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import moment from "moment/moment";
import { api } from "../../../../constants/api";
import { alert } from "../../../../component/AlertComponent/Alert";

export default function StaffClassCreate() {
  localStorage.setItem("MENU_ACTIVE", "staff-class");
  const formItemLayout = {
    labelCol: { xs: { span: 10 }, sm: { span: 4 } },
    wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
  };
  const param = useParams();
  const listOfDay = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const listOfRoom = ["YG1", "YG2", "YG3"];
  const [listOfTimeFrame, setListOfTimeFrame] = useState([]);
  const [comeback, setComeback] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseRoom, setCourseRoom] = useState("");
  const [courseStartDate, setCourseStartDate] = useState("");
  const [courseEndDate, setCourseEndDate] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [slotDto, setSlotDto] = useState([]);

  const styleInputDate = (date) => {
    return moment(new Date(`${date}`)).format("YYYY-MM-DD");
  };
  const styleViewDate = (date) => {
    return moment(new Date(`${date}`)).format("DD-MM-YYYY");
  };
  const styleRealDate = (date) => {
    return moment(new Date(`${date}`));
  };
  const currentDate = moment(new Date());
  const [form] = Form.useForm();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      className: "",
      trainerId: 0,
      courseId: param.id,
      room: "",
      startDate: "",
      endDate: "",
      finished: false,
    },
    onSubmit: (values) => {
      console.log("values", values);
      console.log("slotDto", slotDto);
      if (slotDto.length <= 0) {
        alert.alertFailed(
          "Create Class Failed",
          "You need to add schedule",
          () => {}
        );
      } else {
        let theSlotDTOs = [];
        slotDto.forEach((item) => {
          theSlotDTOs = [
            ...theSlotDTOs,
            {
              dayOfWeek: item.dayOfWeek,
              timeFrameId: item.timeFrameId,
            },
          ];
        });
        console.log("obj", {
          classDTO: values,
          slotDTOs: theSlotDTOs,
        });
      }
    },
  });
  useEffect(() => {
    let listOfTime = [];
    api
      .get(`Timeframe/GetTimeFrameList`)
      .then((res) => {
        listOfTime = res.data;
        listOfTime.forEach((item) => {
          let str = item.timeFrame1.split("-");
          item.timeFrame1 = `${str[0].trim()} - ${str[1].trim()}`;
        });
      })
      .catch((err) => {})
      .finally(() => {
        setListOfTimeFrame([...listOfTime]);
      });

    let timetableList = [];
    listOfRoom.forEach((room) => {
      let listClassOfRoom = [];
      api
        .get(`Class/GetClassesOfRoom?room=${room}`)
        .then((res) => {
          listClassOfRoom = res.data;
          listClassOfRoom.forEach((classItem) => {
            if (styleRealDate(classItem.endDate) <= currentDate) {
              return;
            }
            classItem.schedule.forEach((theSchedule) => {
              let classAdd = { ...classItem };
              classAdd.schedule = theSchedule;
              timetableList = [...timetableList, classAdd];
            });
          });
        })
        .catch((err) => {})
        .finally(() => {
          setTimetable([...timetableList]);
        });
    });

    const BACK_TO_CLASS = localStorage.getItem("BACK_TO_CLASS");
    const COURSE_NAME_CREATE_CLASS = localStorage.getItem(
      "COURSE_NAME_CREATE_CLASS"
    );
    if (BACK_TO_CLASS == "1") {
      setComeback(`/staff/classManagement`);
      localStorage.removeItem("BACK_TO_CLASS");
    } else {
      setComeback(`/staff/classDetail/${param.id}`);
      localStorage.removeItem("BACK_TO_CLASS");
    }
    if (
      COURSE_NAME_CREATE_CLASS != null &&
      COURSE_NAME_CREATE_CLASS != undefined
    ) {
      setCourseName(COURSE_NAME_CREATE_CLASS);
      localStorage.removeItem("COURSE_NAME_CREATE_CLASS");
    }
  }, []);
  useEffect(() => {
    setSlotDto([]);
  }, [courseRoom]);
  useEffect(() => {
    let listOfSlot = [...slotDto];
    listOfSlot.forEach((slot) => {
      if (
        timetable.filter(
          (item) =>
            item.schedule.date
              .trim()
              .toLowerCase()
              .includes(slot.dayOfWeek.trim().toLowerCase()) &&
            item.room
              .trim()
              .toLowerCase()
              .includes(courseRoom.trim().toLowerCase()) &&
            item.schedule.timeframeId == slot.timeFrameId &&
            (styleRealDate(item.endDate) >= styleRealDate(courseStartDate) ||
              styleInputDate(item.endDate) == styleInputDate(courseStartDate))
        ).length > 0
      ) {
        slot.validSlot = false;
        setSlotDto([...listOfSlot]);
      }
    });
  }, [courseStartDate]);
  const handleChangeStartDate = (value) => {
    let startDate = styleInputDate(value);
    setCourseStartDate(value);
    formik.setFieldValue("startDate", startDate);
  };
  const handleChangeEndDate = (value) => {
    let endDate = styleInputDate(value);
    setCourseEndDate(value);
    formik.setFieldValue("endDate", endDate);
  };
  const handleChangeRoom = (value) => {
    setCourseRoom(value);
    formik.setFieldValue("room", value);
  };
  const handleAddSlot = async (theDay, theTime) => {
    let listOfSlot = [...slotDto];
    let pos = listOfSlot.findIndex(
      (item) =>
        item.dayOfWeek
          .trim()
          .toLowerCase()
          .includes(theDay.trim().toLowerCase()) && item.timeFrameId == theTime
    );
    if (pos < 0) {
      let valid = true;
      timetable
        .filter(
          (item) =>
            item.schedule.date
              .trim()
              .toLowerCase()
              .includes(theDay.trim().toLowerCase()) &&
            item.room
              .trim()
              .toLowerCase()
              .includes(courseRoom.trim().toLowerCase()) &&
            item.schedule.timeframeId == theTime &&
            item.room
              .trim()
              .toLowerCase()
              .includes(courseRoom.trim().toLowerCase())
        )
        .forEach((item) => {
          if (
            styleRealDate(item.endDate) >= styleRealDate(courseStartDate) ||
            styleInputDate(item.endDate) == styleInputDate(courseStartDate)
          ) {
            valid = false;
          }
        });
      let slot = {
        dayOfWeek: theDay,
        timeFrameId: theTime,
        validSlot: valid,
      };
      listOfSlot = [...listOfSlot, slot];
      setSlotDto(
        [...listOfSlot]
          .sort((a, b) => {
            return a.timeFrameId - b.timeFrameId;
          })
          .sort((a, b) => {
            let posA = -1;
            let posB = -1;
            for (i = 0; i < listOfDay.length; i++) {
              if (
                a.dayOfWeek
                  .trim()
                  .toLowerCase()
                  .includes(listOfDay[i].trim().toLowerCase())
              ) {
                posA = i;
              }
              if (
                b.dayOfWeek
                  .trim()
                  .toLowerCase()
                  .includes(listOfDay[i].trim().toLowerCase())
              ) {
                posB = i;
              }
            }
            return posA - posB;
          })
      );
    }
  };
  const handleDeleteSlot = (theDay, theTime) => {
    let listOfSlot = [...slotDto];
    let pos = listOfSlot.findIndex(
      (item) =>
        item.dayOfWeek
          .trim()
          .toLowerCase()
          .includes(theDay.trim().toLowerCase()) && item.timeFrameId == theTime
    );
    if (pos >= 0) {
      listOfSlot[pos].dayOfWeek = "";
      setSlotDto([...listOfSlot].filter((item) => item.dayOfWeek != ""));
    }
  };
  console.log(slotDto);
  console.log(timetable);
  return (
    <>
      <HeaderStaff />
      <section className="main" id="admin-course-management-area">
        <MenuStaff />
        <div className="main--content pt-3 px-5">
          <div className="row justify-content-center">
            <div className="col-12">
              <Link
                to={comeback}
                className="course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                style={{ fontSize: "18px", fontWeight: "500" }}
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span className="mx-2">Back</span>
              </Link>
            </div>{" "}
          </div>

          <div
            className="title flex-column m-0 p-0"
            style={{ color: "#e36ac8" }}
          >
            <h2 className="m-0 p-0">Create New Class</h2>
            <h5 className="m-0 p-0 pt-1">Course Name: {courseName}</h5>
          </div>

          <div className="row create-course-content mt-4">
            <Form
              onFinish={formik.handleSubmit}
              {...formItemLayout}
              form={form}
              size="large"
              autoComplete="off"
            >
              <div className="row flex align-items-start justify-content-between">
                <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                  <span className="text-danger px-1">
                    <i
                      className="fa-solid fa-star-of-life"
                      style={{
                        fontSize: "6px",
                        verticalAlign: "middle",
                      }}
                    ></i>{" "}
                  </span>
                  Class Name:
                </p>
                <div className="col-10">
                  <Form.Item
                    name="className"
                    label={``}
                    rules={[
                      {
                        required: true,
                        message: "Class Name cannot be blank",
                      },
                      {
                        max: 50,
                        message: "Class Name must not be over 50 characters",
                      },
                      {
                        whitespace: true,
                        message: "Class Name cannot be empty",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      style={{ width: "100%" }}
                      name="className"
                      value={formik.values.className}
                      onChange={formik.handleChange}
                      placeholder="Enter Class Name"
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="row flex align-items-start justify-content-between">
                <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                  <span className="text-danger px-1">
                    <i
                      className="fa-solid fa-star-of-life"
                      style={{
                        fontSize: "6px",
                        verticalAlign: "middle",
                      }}
                    ></i>{" "}
                  </span>
                  Start Date:
                </p>
                <div className="col-10">
                  <Form.Item
                    name="startDate"
                    label={``}
                    rules={[
                      {
                        required: true,
                        message: "Start Date cannot be blank",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!(currentDate < styleRealDate(value)) && value) {
                            return Promise.reject(
                              "End Date cannot be before or equal to Current Date"
                            );
                          }
                          if (
                            !value ||
                            !getFieldValue("endDate") ||
                            (!(
                              styleRealDate(value) >
                              styleRealDate(getFieldValue("endDate"))
                            ) &&
                              !(
                                styleInputDate(getFieldValue("endDate")) ==
                                styleInputDate(value)
                              ))
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "Start Date cannot be after or equal to End Date"
                          );
                        },
                      }),
                    ]}
                    hasFeedback
                  >
                    <DatePicker
                      name="startDate"
                      className="w-100"
                      format={"DD/MM/YYYY"}
                      value={formik.values.startDate}
                      onChange={handleChangeStartDate}
                      placeholder="Enter Start Date"
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="row flex align-items-start justify-content-between">
                <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                  <span className="text-danger px-1">
                    <i
                      className="fa-solid fa-star-of-life"
                      style={{
                        fontSize: "6px",
                        verticalAlign: "middle",
                      }}
                    ></i>{" "}
                  </span>
                  End Date:
                </p>
                <div className="col-10">
                  <Form.Item
                    name="endDate"
                    label={``}
                    rules={[
                      {
                        required: true,
                        message: "End Date cannot be blank",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!(currentDate < styleRealDate(value)) && value) {
                            return Promise.reject(
                              "End Date cannot be before or equal to Current Date"
                            );
                          }
                          if (
                            !value ||
                            !getFieldValue("startDate") ||
                            (!(
                              styleRealDate(getFieldValue("startDate")) >
                              styleRealDate(value)
                            ) &&
                              !(
                                styleInputDate(getFieldValue("startDate")) ==
                                styleInputDate(value)
                              ))
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "Start Date cannot be after or equal to End Date"
                          );
                        },
                      }),
                    ]}
                    hasFeedback
                  >
                    <DatePicker
                      name="endDate"
                      className="w-100"
                      format={"DD/MM/YYYY"}
                      value={formik.values.endDate}
                      onChange={handleChangeEndDate}
                      placeholder="Enter End Date"
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="row flex align-items-start justify-content-between">
                <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                  <span className="text-danger px-1">
                    <i
                      className="fa-solid fa-star-of-life"
                      style={{
                        fontSize: "6px",
                        verticalAlign: "middle",
                      }}
                    ></i>{" "}
                  </span>
                  Room:
                </p>
                <div className="col-10">
                  <Form.Item
                    label=""
                    name="room"
                    rules={[
                      {
                        required: true,
                        message: "Room must be selected",
                      },
                    ]}
                    hasFeedback
                  >
                    <Select
                      name="room"
                      width="200px"
                      placeholder="Select Room"
                      value={formik.values.room}
                      onChange={handleChangeRoom}
                    >
                      {listOfRoom.map((room, index) => {
                        return (
                          <Select.Option key={index} value={room}>
                            {room}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </div>

              {courseRoom != "" &&
              courseStartDate != "" &&
              courseEndDate != "" ? (
                <>
                  <div className="row flex align-items-start justify-content-between">
                    <p className="col-12 p-0 m-0 px-3 my-2 mt-0 flex">
                      <span className="text-danger px-1">
                        <i
                          className="fa-solid fa-star-of-life"
                          style={{
                            fontSize: "6px",
                            verticalAlign: "middle",
                          }}
                        ></i>{" "}
                      </span>
                      Schedule:
                    </p>
                  </div>
                  <table className="table-bordered text-center ">
                    <thead>
                      <tr className="bg-light-gray">
                        <th className="text-uppercase">Time</th>
                        {listOfDay.map((day) => {
                          return <th className="text-uppercase">{day}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {listOfTimeFrame.map((timeFrame) => (
                        <tr key={timeFrame.id}>
                          <td className="align-middle">
                            {timeFrame.timeFrame1}
                          </td>
                          {listOfDay.map((dayOfTheWeek, index) => {
                            return (
                              <td
                                key={dayOfTheWeek}
                                className={`m-0 p-0 py-1 bg-opacity-25
                                ${
                                  slotDto.findIndex(
                                    (item) =>
                                      item.dayOfWeek
                                        .trim()
                                        .toLowerCase()
                                        .includes(
                                          dayOfTheWeek.trim().toLowerCase()
                                        ) &&
                                      item.timeFrameId == timeFrame.id &&
                                      item.validSlot
                                  ) >= 0
                                    ? "bg-success"
                                    : ""
                                }
                                ${
                                  slotDto.findIndex(
                                    (item) =>
                                      item.dayOfWeek
                                        .trim()
                                        .toLowerCase()
                                        .includes(
                                          dayOfTheWeek.trim().toLowerCase()
                                        ) &&
                                      item.timeFrameId == timeFrame.id &&
                                      !item.validSlot
                                  ) >= 0
                                    ? "bg-danger"
                                    : ""
                                }`}
                                style={{
                                  position: "relative",
                                  verticalAlign: "middle",
                                }}
                              >
                                {timetable
                                  .filter(
                                    (s) =>
                                      s.schedule.date
                                        .trim()
                                        .toLowerCase()
                                        .includes(
                                          `${dayOfTheWeek}`.trim().toLowerCase()
                                        ) &&
                                      s.schedule.timeframeId == timeFrame.id
                                  )
                                  .filter((item) =>
                                    item.room
                                      .trim()
                                      .toLowerCase()
                                      .includes(
                                        `${courseRoom}`.trim().toLowerCase()
                                      )
                                  )
                                  .filter((item) => {
                                    if (courseStartDate == "") {
                                      return true;
                                    }
                                    if (
                                      styleInputDate(courseStartDate) ==
                                      styleInputDate(item.endDate)
                                    ) {
                                      return true;
                                    }
                                    return (
                                      styleRealDate(courseStartDate) <=
                                      styleRealDate(item.endDate)
                                    );
                                  }).length <= 0 ? (
                                  <div className="p-0 m-0">
                                    <i
                                      className="fa-solid fa-plus bg-success text-success bg-opacity-10 p-2 mx-2"
                                      style={{
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        handleAddSlot(
                                          dayOfTheWeek,
                                          timeFrame.id
                                        );
                                      }}
                                    ></i>
                                    <i
                                      className="fa-solid fa-trash bg-danger text-danger bg-opacity-10 p-2 mx-2"
                                      style={{
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        handleDeleteSlot(
                                          dayOfTheWeek,
                                          timeFrame.id
                                        );
                                      }}
                                    ></i>
                                  </div>
                                ) : (
                                  <></>
                                )}

                                {slotDto.findIndex(
                                  (item) =>
                                    item.dayOfWeek
                                      .trim()
                                      .toLowerCase()
                                      .includes(
                                        dayOfTheWeek.trim().toLowerCase()
                                      ) &&
                                    item.timeFrameId == timeFrame.id &&
                                    !item.validSlot
                                ) >= 0 ? (
                                  <div className="p-0 m-0">
                                    <i
                                      className="fa-solid fa-trash bg-danger text-danger bg-opacity-10 p-2 mx-2"
                                      style={{
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        handleDeleteSlot(
                                          dayOfTheWeek,
                                          timeFrame.id
                                        );
                                      }}
                                    ></i>
                                  </div>
                                ) : (
                                  <></>
                                )}

                                {timetable
                                  .filter(
                                    (s) =>
                                      s.schedule.date
                                        .trim()
                                        .toLowerCase()
                                        .includes(
                                          `${dayOfTheWeek}`.trim().toLowerCase()
                                        ) &&
                                      s.schedule.timeframeId == timeFrame.id
                                  )
                                  .filter((item) =>
                                    item.room
                                      .trim()
                                      .toLowerCase()
                                      .includes(
                                        `${courseRoom}`.trim().toLowerCase()
                                      )
                                  )
                                  .filter((item) => {
                                    if (courseStartDate == "") {
                                      return true;
                                    }
                                    if (
                                      styleInputDate(courseStartDate) ==
                                      styleInputDate(item.endDate)
                                    ) {
                                      return true;
                                    }
                                    return (
                                      styleRealDate(courseStartDate) <=
                                      styleRealDate(item.endDate)
                                    );
                                  })
                                  .map((filteredItem, index) => (
                                    <div
                                      className="content"
                                      key={`${dayOfTheWeek}+${timeFrame.id}+${filteredItem.startDate}`}
                                    >
                                      {index != 0 ? (
                                        <hr className="my-1 mt-2" />
                                      ) : (
                                        <></>
                                      )}
                                      {/* <hr className="m-0 p-0 mt-1" /> */}
                                      <p
                                        className="p-0 m-0"
                                        style={{
                                          fontWeight: "bold",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {filteredItem.courseName}
                                      </p>
                                      <p className="p-0 m-0">
                                        Class: {filteredItem.className}
                                      </p>
                                      <p className="p-0 m-0">
                                        Start:{" "}
                                        {styleViewDate(filteredItem.startDate)}
                                      </p>
                                      <p className="p-0 m-0">
                                        End:{" "}
                                        {styleViewDate(filteredItem.endDate)}
                                      </p>
                                    </div>
                                  ))}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="">
                    {slotDto.length > 0 ? (
                      <h5 className="m-0 p-0 px-4 mt-2">Preview Schedule</h5>
                    ) : (
                      <></>
                    )}
                    {slotDto.map((slot, index) => {
                      return (
                        <p
                          className={`p-0 m-0 px-4 mt-2 
                          ${!slot.validSlot ? "text-danger" : ""}`}
                          style={{ fontWeight: "500" }}
                        >
                          <span>
                            <i
                              className="fa-solid fa-trash bg-danger text-danger bg-opacity-10 p-2 mx-2"
                              style={{
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                handleDeleteSlot(
                                  slot.dayOfWeek,
                                  slot.timeFrameId
                                );
                              }}
                            ></i>
                          </span>
                          <span className="px-2">{slot.dayOfWeek},</span>{" "}
                          <span>
                            {
                              listOfTimeFrame[
                                listOfTimeFrame.findIndex(
                                  (item) => item.id == slot.timeFrameId
                                )
                              ].timeFrame1
                            }
                          </span>
                          {!slot.validSlot ? (
                            <span className="px-3">
                              {"(Duplicate Schedule)"}
                            </span>
                          ) : (
                            ""
                          )}
                        </p>
                      );
                    })}
                    <hr className="m-0 p-0 mt-3" />
                  </div>
                </>
              ) : (
                <></>
              )}

              {/* <div className="row flex align-items-start justify-content-between">
                <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                  <span className="text-danger px-1">
                    <i
                      className="fa-solid fa-star-of-life"
                      style={{
                        fontSize: "6px",
                        verticalAlign: "middle",
                      }}
                    ></i>{" "}
                  </span>
                  {"Price (VND):"}
                </p>
                <div className="col-10">
                  <Form.Item
                    name="price"
                    // label="Price"
                    rules={[
                      {
                        required: true,
                        message: "Price is not in correct form",
                      },
                      {
                        pattern:
                          /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/,
                        message: "Price must be a positive number",
                      },
                      {
                        whitespace: true,
                        message: "Price cannot be empty",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      style={{ width: "100%" }}
                      name="price"
                      type="number"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onInput={(e) => {
                        setPreviewPrice(e.target.value);
                      }}
                      placeholder="Enter Price"
                    />
                  </Form.Item>
                </div>
              </div> */}

              {/* <div className="row flex align-items-start">
                <p className="col-2 p-0 m-0 px-3 pt-2">{"Discount (%):"}</p>
                <div className="col-10">
                  <Form.Item
                    name="discount"
                    label=""
                    rules={[
                      {
                        pattern: /^[1-9]?[0-9]{1}$|^100$/,
                        message: "Discount must be between 0 and 100",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      style={{ width: "100%" }}
                      name="discount"
                      // type="number"
                      value={formik.values.discount}
                      onChange={formik.handleChange}
                      onInput={(e) => {
                        if (e.target.value == "") {
                          setPreviewDiscount(0);
                        } else {
                          setPreviewDiscount(e.target.value);
                        }
                      }}
                      placeholder="Enter Discount (default = 0)"
                    />
                  </Form.Item>{" "}
                </div>
              </div> */}

              {/* <div className="row flex align-items-start justify-content-between">
                <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                  <span className="text-danger px-1">
                    <i
                      className="fa-solid fa-star-of-life"
                      style={{
                        fontSize: "6px",
                        verticalAlign: "middle",
                      }}
                    ></i>{" "}
                  </span>
                  Description:
                </p>
                <div className="col-10">
                  <Form.Item
                    name="description"
                    label=""
                    rules={[
                      {
                        required: true,
                        message: "Description cannot be blank",
                      },
                      {
                        min: 0,
                        max: 1000,
                        message: "Description must be from 0-1000 characters",
                      },
                      {
                        whitespace: true,
                        message: "Description cannot be empty",
                      },
                    ]}
                    hasFeedback
                  >
                    <TextArea
                      style={{
                        width: "100%",
                        height: "150px",
                        verticalAlign: "top",
                      }}
                      name="description"
                      className="create-course-level"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      placeholder="Enter Description"
                    />
                  </Form.Item>
                </div>
              </div> */}

              {/* <div className="row flex align-items-start justify-content-between">
                <p className="col-2 p-0 m-0 px-3 mt-2 flex">
                  <span className="text-danger px-1">
                    <i
                      className="fa-solid fa-star-of-life"
                      style={{
                        fontSize: "6px",
                        verticalAlign: "middle",
                      }}
                    ></i>{" "}
                  </span>
                  Image:
                </p>
                <div className="col-10">
                  <Form.Item name="img" label="" rules={[]} hasFeedback>
                    <Input
                      style={{ width: "100%" }}
                      name="img"
                      value={formik.values.img}
                      onChange={formik.handleChange}
                      onInput={(e) => {
                        setPreviewImg(e.target.value);
                      }}
                      placeholder="Enter Link Of Image"
                    />
                  </Form.Item>
                </div>
              </div> */}

              <button
                className="bg-green-500 text-gray-100 text-xl p-2 w-96 rounded-full tracking-wide
                          font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-green-600
                          shadow-lg mt-3"
                type="submit"
              >
                Create
              </button>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}
