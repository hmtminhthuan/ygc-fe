import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment/moment";

export default function AdminCourseClasses({
  courseClasses,
  courseFinishedClasses,
  ...restParams
}) {
  const styleDate = (date) => {
    return moment(new Date(`${date}`)).format("DD-MM-YYYY");
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const [available, setAvailable] = useState(false);
  const [markAvailable, setMarkAvailable] = useState(false);
  const [viewAllButton, setViewAllButton] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  useEffect(() => {
    if (courseClasses.length > 0) {
      for (let i = 0; i < courseClasses.length; i++) {
        // let current = moment(new Date()).format("DD-MM-YYYY");
        // let end = moment(new Date(`${courseClasses[i].endDate}`)).format(
        //   "DD-MM-YYYY"
        // );
        if (
          moment(new Date()) <= moment(new Date(`${courseClasses[i].endDate}`))
        ) {
          setAvailable(true);
          setMarkAvailable(true);
          break;
        }
      }
    }

    // if (courseClasses.length > 0) {
    //   for (i = 0; i < courseClasses.length; i++) {
    //     let current = moment(new Date()).format("DD-MM-YYYY");
    //     let end = styleDate(courseClasses[i].endDate);
    //     if (current > end) {
    //       setViewAllButton(true);
    //       break;
    //     }
    //   }
    // }
    setViewAllButton(true);
  }, []);

  let countNo = 1;

  return (
    <div className="row flex justify-content-start">
      <div className="course-detail-classes col-10">
        {courseClasses.length > 0 ? (
          <p className="text-black p-0 m-0 mb-2">
            Number of Current Classes:{" "}
            {
              courseClasses.filter((item) => {
                return (
                  moment(new Date(`${item.endDate}`)) >= moment(new Date())
                );
              }).length
            }{" "}
          </p>
        ) : (
          <></>
        )}
        <p className="text-black p-0 m-0 mb-3">
          Number of Total Classes:{" "}
          {[...courseClasses, ...courseFinishedClasses].length}{" "}
        </p>
        {[...courseClasses, ...courseFinishedClasses].length <= 0 ||
        !available ? (
          <p
            className="text-danger text-center p-0 m-0"
            style={{ fontSize: "18px", fontWeight: "600" }}
          >
            No available class till present!
          </p>
        ) : (
          <TableContainer
            component={Paper}
            style={{
              height: `${
                courseClasses.length >= 2 && viewAllButton ? "290px" : ""
              }
              ${
                [...courseClasses, ...courseFinishedClasses].length >= 2 &&
                !viewAllButton
                  ? "290px"
                  : ""
              }`,
            }}
          >
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow className=" bg-dark">
                  <StyledTableCell>No.</StyledTableCell>
                  <StyledTableCell align="left">Name</StyledTableCell>
                  <StyledTableCell align="left">Start Date</StyledTableCell>
                  <StyledTableCell align="left">End Date</StyledTableCell>
                  <StyledTableCell align="left">Trainer</StyledTableCell>
                  <StyledTableCell align="left">Room</StyledTableCell>
                  <StyledTableCell align="left">Schedule</StyledTableCell>
                  <StyledTableCell align="right">Trainees</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ height: "auto" }}>
                {viewAllButton ? (
                  <>
                    {courseClasses
                      .filter((item) => new Date(item.endDate) - new Date() > 0)
                      .sort((a, b) => {
                        return moment(new Date(`${b.endDate}`)) >
                          moment(new Date(`${a.endDate}`))
                          ? 1
                          : -1;
                      })
                      .map(
                        (
                          {
                            classId,
                            trainerId,
                            className,
                            startDate,
                            endDate,
                            firstname,
                            lastname,
                            schedule,
                            room,
                            numberTrainee,
                          },
                          index
                        ) => {
                          let current = moment(new Date()).format("DD-MM-YYYY");
                          let start = moment(new Date(`${startDate}`)).format(
                            "DD-MM-YYYY"
                          );
                          let end = moment(new Date(`${endDate}`)).format(
                            "DD-MM-YYYY"
                          );
                          return (
                            <StyledTableRow key={index}>
                              <StyledTableCell align="left">
                                {countNo++}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {className}
                              </StyledTableCell>
                              <StyledTableCell
                                align="left"
                                className={`${
                                  moment(new Date()) >
                                  moment(new Date(`${startDate}`))
                                    ? "bg-warning bg-opacity-10"
                                    : ""
                                }`}
                              >
                                {start}
                              </StyledTableCell>
                              <StyledTableCell
                                align="left"
                                className={`${
                                  moment(new Date()) >
                                  moment(new Date(`${endDate}`))
                                    ? "bg-warning bg-opacity-10"
                                    : ""
                                }`}
                              >
                                {end}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {firstname} {lastname}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {room}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {schedule.map(({ date, time }, index) => (
                                  <p className="p-0 m-0 py-1" key={index}>
                                    {date}, {time}
                                  </p>
                                ))}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {numberTrainee}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        }
                      )}
                  </>
                ) : (
                  <>
                    {[...courseClasses, ...courseFinishedClasses]
                      .filter((item) => new Date(item.endDate) - new Date() < 0)
                      .sort((a, b) => {
                        return moment(new Date(`${b.endDate}`)) >
                          moment(new Date(`${a.endDate}`))
                          ? 1
                          : -1;
                      })
                      .map(
                        (
                          {
                            classId,
                            trainerId,
                            className,
                            startDate,
                            endDate,
                            firstname,
                            lastname,
                            schedule,
                            room,
                            numberTrainee,
                          },
                          index
                        ) => {
                          let current = moment(new Date()).format("DD-MM-YYYY");
                          let start = moment(new Date(`${startDate}`)).format(
                            "DD-MM-YYYY"
                          );
                          let end = moment(new Date(`${endDate}`)).format(
                            "DD-MM-YYYY"
                          );
                          return (
                            <StyledTableRow key={index}>
                              <StyledTableCell align="left">
                                {countNo++}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {className}
                              </StyledTableCell>
                              <StyledTableCell
                                align="left"
                                className={`${
                                  moment(new Date()) >
                                  moment(new Date(`${startDate}`))
                                    ? "bg-warning bg-opacity-10"
                                    : ""
                                }`}
                              >
                                {start}
                              </StyledTableCell>
                              <StyledTableCell
                                align="left"
                                className={`${
                                  moment(new Date()) >
                                  moment(new Date(`${endDate}`))
                                    ? "bg-warning bg-opacity-10"
                                    : ""
                                }`}
                              >
                                {end}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {firstname} {lastname}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {room}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {schedule.map(({ date, time }, index) => (
                                  <p className="p-0 m-0 py-1" key={index}>
                                    {date}, {time}
                                  </p>
                                ))}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {numberTrainee}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        }
                      )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {viewAllButton &&
        [...courseClasses].filter(
          (item) => new Date(item.endDate) - new Date() < 0
        ).length > 0 ? (
          <div className="text-end">
            <button
              className="border-0 mt-2 mx-1 
                    text-light bg-black bg-opacity-75 py-1 px-2"
              style={{ borderRadius: "5px" }}
              onClick={() => {
                setViewAllButton(false);
                setHideButton(true);
                setAvailable(true);
              }}
            >
              View Finished Classes
            </button>
          </div>
        ) : (
          <></>
        )}
        {hideButton ? (
          <div className="text-end">
            <button
              className="border-0 mt-2 mx-1
                    text-light bg-black bg-opacity-75 py-1 px-2"
              style={{ borderRadius: "5px" }}
              onClick={() => {
                setViewAllButton(true);
                setHideButton(false);
                if (!markAvailable) {
                  setAvailable(false);
                }
              }}
            >
              Hide
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
