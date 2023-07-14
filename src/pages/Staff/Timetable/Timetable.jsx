import React, { useEffect, useState } from "react";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import { api } from "../../../constants/api";
import moment from "moment/moment";
import { AutoComplete, Button, Select } from "antd";

export default function Timetable() {
  const listOfRoom = ["YG1", "YG2", "YG3"];
  const [listOfTimeFrame, setListOfTimeFrame] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [courseRoom, setCourseRoom] = useState("");
  const [navigation, setNavigation] = useState(1);
  const [listOfTrainer, setListOfTrainer] = useState([]);
  const [trainerOptions, setTrainerOptions] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [viewDetailClassId, setViewDetailClassId] = useState(-1);
  const [viewDetailTrainerId, setViewDetailTrainerId] = useState(-1);
  const [classDetail, setClassDetail] = useState({});
  const [trainees, setTrainees] = useState([]);
  const [available, setAvailable] = useState(false);
  const currentDate = new Date();
  const listOfDay = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
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
            if (new Date(classItem.endDate) < new Date()) {
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

    let listTrainer = [];
    api
      .get(`Account/AccountListByRole?id=3`)
      .then((res) => {
        listTrainer = res.data;
        listTrainer.forEach((item) => {
          item.fullname = `${item.firstName} ${item.lastName}`;
        });
      })
      .catch((err) => {})
      .finally(() => {
        setListOfTrainer([...listTrainer].filter((item) => !item.deleted));
        [...listTrainer]
          .filter((item) => !item.deleted)
          .forEach((account) => {
            setTrainerOptions((prev) => [
              ...prev,
              {
                value:
                  account.firstName +
                  " " +
                  account.lastName +
                  " - ID: " +
                  account.accountID,
              },
            ]);
          });
      });
  }, []);

  useEffect(() => {
    if (
      selectedTrainer != null &&
      selectedTrainer.accountID != null &&
      selectedTrainer.accountID != undefined
    ) {
      api
        .get("/Trainer/getListClassForTrainer", {
          params: { id: selectedTrainer.accountID },
        })
        .then((res) => {
          setSelectedSchedule(res.data);
        })
        .catch((err) => {})
        .finally(() => {});
    }
  }, [selectedTrainer]);

  useEffect(() => {
    if (navigation == 1) {
      setSelectedTrainer(null);
      setSelectedSchedule([]);
    } else if (navigation == 2) {
      setCourseRoom("");
    }
  }, [navigation]);

  useEffect(() => {
    if (viewDetailClassId >= 0) {
      Swal.fire({
        title: "Loading...",
        timer: 800,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {},
      });
      api
        .get("/Trainer/getListClassForTrainer", {
          params: {
            id: viewDetailTrainerId,
          },
        })
        .then((res) => {
          let list = [];
          list = res.data;
          list = [...list].filter((item) => item.classId == viewDetailClassId);
          setClassDetail(list[0]);
          if (list[0].trainerId == viewDetailTrainerId) {
            setAvailable(true);
          }
        })
        .catch((err) => {});

      api
        .get("/Trainer/GetTraineesListOfClass", {
          params: { classId: viewDetailClassId },
        })
        .then((res) => {
          setTrainees(res.data);
        })
        .catch((err) => {});
    }
  }, [viewDetailClassId]);

  const styleViewDate = (date) => {
    return moment(new Date(`${date}`)).format("DD-MM-YYYY");
  };
  const styleInputDate = (date) => {
    return moment(new Date(`${date}`)).format("YYYY-MM-DD");
  };
  const styleRealDate = (date) => {
    return moment(new Date(`${date}`));
  };
  const styleRealDateWithDay = (date) => {
    return moment(new Date(`${date}`)).format("DD-MM-YYYY, dddd");
  };
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const handleChangeRoom = (value) => {
    setCourseRoom(value);
  };
  const handleChangeTrainer = (value) => {
    setSelectedTrainer(
      listOfTrainer[listOfTrainer.findIndex((item) => item.accountID == value)]
    );
  };
  const options = trainerOptions;

  return (
    <>
      <>
        {!available ? (
          <>
            <HeaderStaff />
            <section className="main bg-white" id="">
              <MenuStaff />
              <div className="main--content bg-white">
                <section className="staff-list-area pt-3 pb-3">
                  <div className="row flex trainer-containe mt-2 mx-5 mb-5">
                    <div className="mb-3">
                      <div className="flex">
                        <p
                          className=" py-1 px-3 text-light"
                          style={{
                            borderRadius: "50px",
                            cursor: "pointer",
                            backgroundColor: `${
                              navigation == 1 ? "#000" : "gray"
                            }`,
                          }}
                          onClick={() => {
                            setNavigation(1);
                          }}
                        >
                          Timetable Of Room
                        </p>
                        <p
                          className=" py-1 px-3 text-light ms-2"
                          style={{
                            borderRadius: "50px",
                            cursor: "pointer",
                            backgroundColor: `${
                              navigation == 2 ? "#000" : "gray"
                            }`,
                          }}
                          onClick={() => {
                            setNavigation(2);
                          }}
                        >
                          Timetable Of Trainer
                        </p>
                      </div>
                      {navigation == 1 ? (
                        <div className=" flex align-items-center justify-content-center">
                          <div className="" style={{ width: "3%" }}>
                            <h5 className="m-0 p-0">Room:</h5>
                          </div>
                          <div
                            className="flex justify-content-end"
                            style={{ width: "90%" }}
                          >
                            <Select
                              style={{ width: "95%" }}
                              placeholder="Select Room"
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
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}

                      {navigation == 2 ? (
                        <div className=" flex align-items-center justify-content-center">
                          <div className="" style={{ width: "3%" }}>
                            <h5 className="m-0 p-0">Trainer:</h5>
                          </div>
                          <div
                            className="flex justify-content-end"
                            style={{ width: "90%" }}
                          >
                            <AutoComplete
                              style={{ width: "95%" }}
                              options={options}
                              onSelect={(value) => {
                                handleChangeTrainer(
                                  parseInt(value.split("ID:")[1].trim())
                                );
                              }}
                              placeholder="Select Trainer"
                              filterOption={(inputValue, option) =>
                                option.value
                                  .toUpperCase()
                                  .indexOf(inputValue.toUpperCase()) !== -1
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <hr />
                    {navigation == 1 ? (
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
                          {listOfTimeFrame.map((timeFrame, index) => (
                            <tr
                              key={timeFrame.id}
                              style={{
                                backgroundColor: `${
                                  index % 2 == 1 ? "#ebebeb" : ""
                                }`,
                              }}
                            >
                              <td
                                className="align-middle"
                                style={{ fontWeight: "700" }}
                              >
                                {timeFrame.timeFrame1}
                              </td>
                              {listOfDay.map((dayOfTheWeek, index) => {
                                return (
                                  <td
                                    key={dayOfTheWeek}
                                    className={`m-0 p-0 py-1 bg-opacity-25`}
                                    style={{
                                      position: "relative",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    {timetable
                                      .filter((s) => {
                                        if (courseRoom == "") {
                                          return false;
                                        }
                                        return (
                                          s.schedule.date
                                            .trim()
                                            .toLowerCase()
                                            .includes(
                                              `${dayOfTheWeek}`
                                                .trim()
                                                .toLowerCase()
                                            ) &&
                                          s.schedule.timeframeId == timeFrame.id
                                        );
                                      })
                                      .filter((item) =>
                                        item.room
                                          .trim()
                                          .toLowerCase()
                                          .includes(
                                            `${courseRoom}`.trim().toLowerCase()
                                          )
                                      )
                                      .map((filteredItem, index) => (
                                        <div
                                          className="content py-1"
                                          key={`${dayOfTheWeek}+${timeFrame.id}+${filteredItem.startDate}`}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            setViewDetailClassId(
                                              filteredItem.id
                                            );
                                            setViewDetailTrainerId(
                                              filteredItem.trainerId
                                            );
                                          }}
                                        >
                                          {index != 0 ? (
                                            <hr className="my-1 mt-2" />
                                          ) : (
                                            <></>
                                          )}
                                          <p
                                            className="p-0 m-0"
                                            style={{
                                              fontWeight: "bold",
                                              cursor: "pointer",
                                              color: "#ec88ad",
                                            }}
                                          >
                                            {filteredItem.courseName}
                                          </p>
                                          <p className="p-0 m-0">
                                            Class: {filteredItem.className}
                                          </p>
                                          <p className="p-0 m-0">
                                            Start:{" "}
                                            {styleViewDate(
                                              filteredItem.startDate
                                            )}
                                          </p>
                                          <p className="p-0 m-0">
                                            End:{" "}
                                            {styleViewDate(
                                              filteredItem.endDate
                                            )}
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
                    ) : (
                      <></>
                    )}
                    {navigation == 2 ? (
                      <table className="table-bordered text-center ">
                        <thead>
                          <tr className="bg-light-gray">
                            <th
                              className="text-uppercase text-dark"
                              style={{ background: "#ec88ad" }}
                            >
                              Time
                            </th>
                            {listOfDay.map((item) => {
                              return (
                                <th
                                  key={item}
                                  className="text-uppercase text-dark"
                                  style={{ background: "#ec88ad" }}
                                >
                                  {item}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {listOfTimeFrame.map((timeFrame, index) => (
                            <tr
                              key={timeFrame.id}
                              style={{
                                backgroundColor: `${
                                  index % 2 == 1 ? "#ebebeb" : ""
                                }`,
                              }}
                            >
                              <td
                                className="align-middle"
                                style={{ fontWeight: "700" }}
                              >
                                {timeFrame.timeFrame1}
                              </td>
                              {listOfDay.map((theDay, index) => {
                                return (
                                  <td
                                    key={theDay + index}
                                    className={`p-0 m-0 bg-opacity-25`}
                                  >
                                    {selectedSchedule
                                      .filter(
                                        (item) =>
                                          (styleInputDate(item.endDate) ==
                                            styleInputDate(currentDate) ||
                                            styleRealDate(item.endDate) >=
                                              styleRealDate(currentDate)) &&
                                          item.schedule.some(
                                            (s) =>
                                              s.date == `${theDay}` &&
                                              s.timeframeId === timeFrame.id
                                          )
                                      )
                                      .map((filteredItem) => (
                                        <div
                                          className="content m-0 p-0 py-1"
                                          key={filteredItem.courseId}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            setViewDetailClassId(
                                              filteredItem.classId
                                            );
                                            setViewDetailTrainerId(
                                              filteredItem.trainerId
                                            );
                                          }}
                                        >
                                          <p
                                            className="p-0 m-0"
                                            style={{
                                              fontWeight: "800",
                                              color: "#ec88ad",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {filteredItem.courseName}
                                          </p>

                                          <p className="p-0 m-0">
                                            Class: {filteredItem.className}
                                          </p>
                                          <p className="p-0 m-0">
                                            Room: {filteredItem.room}
                                          </p>
                                          <p className="p-0 m-0">
                                            Start:{" "}
                                            {styleViewDate(
                                              filteredItem.startDate
                                            )}
                                          </p>
                                          <p className="p-0 m-0">
                                            End:{" "}
                                            {styleViewDate(
                                              filteredItem.endDate
                                            )}
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
                    ) : (
                      <></>
                    )}
                  </div>
                </section>
              </div>
            </section>
          </>
        ) : (
          //   <section className="main bg-white">
          <div
            className="main--content bg-danger"
            // style={{ zIndex: "99999", position: "fixed" }}
          >
            <section
              className="trainer-area pt-3 pb-3"
              style={{ height: "100vh", overflowY: "scroll" }}
            >
              <div className="row flex trainer mt-2 mx-5 my-0">
                <div className="container bootstrap snippets bootdey">
                  <div className="col-md-12 ">
                    <div className="profile-container mx-5">
                      <div className="profile-header row">
                        <div className="">
                          <Button
                            className="border-0 mx-4 mt-4 course-detail-come-back text-dark text-center text-decoration-none flex align-items-center"
                            style={{ fontSize: "18px", fontWeight: "500" }}
                            onClick={() => {
                              setAvailable(false);
                              setViewDetailClassId(-1);
                              setViewDetailTrainerId(-1);
                              setTrainees([]);
                            }}
                          >
                            <i className="fa-solid fa-arrow-left"></i>
                            <span className="mx-2">Back</span>
                          </Button>
                        </div>
                        <div className="col-lg-4 col-md-12 col-sm-12 text-center mt-5">
                          <img
                            src={classDetail.courseImg}
                            alt={classDetail.courseName}
                            className="header-avatar"
                          />
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12 profile-info text-center my-0 py-0">
                          <div
                            className="header-fullname"
                            style={{ fontSize: "24px", fontWeight: "bold" }}
                          >
                            Class: {classDetail.className}
                          </div>
                          <div
                            className="header-information"
                            style={{ fontSize: "20px" }}
                          >
                            <p className="m-0 p-0 my-0 text-center">
                              Course name: {classDetail.courseName}
                            </p>
                            <p className="m-0 p-0 my-2 text-center">
                              Room: {classDetail.room}
                            </p>
                            <p className="m-0 p-0 my-2 text-center">
                              Trainer: {classDetail.firstName}{" "}
                              {classDetail.lastName}
                            </p>
                            <p className="m-0 p-0 my-2 text-center">
                              Level:{" "}
                              {classDetail.level
                                ? classDetail.level.levelName
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-xs-12 profile-stats">
                          <div className="row">
                            <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                              <div className="stats-value pink">
                                {trainees.length}
                              </div>
                              <div className="stats-title">TRAINEES</div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                              <div className="stats-value pink">
                                {formatDate(classDetail.startDate)}
                              </div>
                              <div className="stats-title">START DATE</div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12 stats-col">
                              <div className="stats-value pink">
                                {formatDate(classDetail.endDate)}
                              </div>
                              <div className="stats-title">END DATE</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 mt-5 list-container">
                    <div className="card-container mx-5">
                      <div className="card-header">
                        <h4>Trainee List</h4>
                      </div>
                      <div className="card-body">
                        <div
                          className="table-responsive"
                          id="proTeamScroll"
                          tabIndex={2}
                          style={{
                            // height: 400,
                            overflow: "hidden",
                            outline: "none",
                          }}
                        >
                          <table
                            className="table table-striped"
                            style={{ verticalAlign: "middle" }}
                          >
                            <thead>
                              <tr>
                                <th>Image</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Gender</th>
                                <th>Phone</th>
                              </tr>
                            </thead>
                            <tbody style={{ height: "auto" }}>
                              {trainees.map((trainee) => (
                                <tr key={trainee.id}>
                                  <td className="table-img">
                                    {/* <img
                               src={trainee.img}
                               alt={`${trainee.firstName} ${trainee.lastName}`}
                               className="trainee-image"
                             /> */}
                                    {trainee.img == "male" ? (
                                      <img
                                        src={maleImg}
                                        alt="Image"
                                        className="shadow img-user-profile"
                                      />
                                    ) : (
                                      <></>
                                    )}
                                    {trainee.img == "female" ? (
                                      <img
                                        src={femaleImg}
                                        alt="Image"
                                        className="shadow img-user-profile"
                                      />
                                    ) : (
                                      <></>
                                    )}
                                    {trainee.img != "" &&
                                    trainee.img != "male" &&
                                    trainee.img != "female" ? (
                                      <img
                                        src={trainee.img}
                                        alt="Image"
                                        className="shadow img-user-profile"
                                      />
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                  <td>
                                    <h6 className="mb-0 font-13">
                                      {trainee.firstName}
                                    </h6>
                                  </td>
                                  <td>{trainee.lastName}</td>
                                  <td>{trainee.gender ? "Male" : "Female"}</td>
                                  <td>
                                    <div className="badge-outline col-red">
                                      {trainee.phone}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          //   </section>
        )}
      </>
    </>
  );
}
