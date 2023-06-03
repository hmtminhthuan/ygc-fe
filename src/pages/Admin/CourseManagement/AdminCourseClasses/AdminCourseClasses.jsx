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

export default function AdminCourseClasses({ courseClasses, ...restParams }) {
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
            for (i = 0; i < courseClasses.length; i++) {
                let current = moment(new Date()).format("DD-MM-YYYY");
                let end = moment(new Date(`${courseClasses[i].endDate}`)).format(
                    "DD-MM-YYYY"
                );
                if (current <= end) {
                    setAvailable(true);
                    setMarkAvailable(true);
                    break;
                }
            }
        }

        if (courseClasses.length > 0) {
            for (i = 0; i < courseClasses.length; i++) {
                let current = moment(new Date()).format("DD-MM-YYYY");
                let end = moment(new Date(`${courseClasses[i].endDate}`)).format(
                    "DD-MM-YYYY"
                );
                if (current > end) {
                    setViewAllButton(true);
                    break;
                }
            }
        }

    }, []);

    let countNo = 1;
    console.log('list', courseClasses);
    return (
        <div className="row flex justify-content-start">
            <div className="course-detail-classes col-10">
                {courseClasses.length > 0 ?
                    <p className="text-black p-0 m-0 mx-2 mb-2"
                        style={{ fontWeight: "bold" }}>Number of Current Classes:{" "}
                        {courseClasses.filter(item => {
                            return moment(new Date(`${item.endDate}`)).format(
                                "DD-MM-YYYY"
                            ) >= moment(new Date()).format(
                                "DD-MM-YYYY"
                            )
                        }).length} </p>
                    : <></>}
                <p className="text-black p-0 m-0 mx-2 mb-3"
                    style={{ fontWeight: "bold" }}>Number of Total Classes: {courseClasses.length} </p>
                {courseClasses.length <= 0 || !available ? (
                    <p
                        className="text-danger text-center p-0 m-0"
                        style={{ fontSize: "18px", fontWeight: "600" }}
                    >
                        No available class till present!
                    </p>
                ) : (
                    <TableContainer component={Paper} style={{ height: "360px" }}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow className=" bg-dark">
                                    <StyledTableCell>No.</StyledTableCell>
                                    <StyledTableCell align="left">Start Date</StyledTableCell>
                                    <StyledTableCell align="left">End Date</StyledTableCell>
                                    <StyledTableCell align="left">Trainer</StyledTableCell>
                                    <StyledTableCell align="left">Room</StyledTableCell>
                                    <StyledTableCell align="left">Schedule</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courseClasses
                                    .sort((a, b) => {
                                        return moment(new Date(`${b.endDate}`)).format(
                                            "DD-MM-YYYY"
                                        ) > moment(new Date(`${a.endDate}`)).format("DD-MM-YYYY")
                                            ? 1
                                            : -1;
                                    })
                                    .map(
                                        (
                                            {
                                                classId,
                                                trainerId,
                                                startDate,
                                                endDate,
                                                firstname,
                                                lastname,
                                                schedule,
                                                room,
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
                                            if (current > end && viewAllButton) {
                                                return <></>;
                                            }
                                            return (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell align="left">
                                                        {countNo++}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left"
                                                        className={`${current > start ? "bg-warning bg-opacity-10" : ""}`}>
                                                        {start}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left"
                                                        className={`${current > end ? "bg-warning bg-opacity-10" : ""}`}>
                                                        {end}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {firstname} {lastname}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">{room}</StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {schedule.map(({ date, time }, index) => (
                                                            <p className="p-0 m-0 py-1" key={index}>
                                                                {date}, {time}
                                                            </p>
                                                        ))}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            );
                                        }
                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {viewAllButton && courseClasses.length > 0 ? (
                    <div className="text-end">
                        <button
                            className="border-0 mt-2 mx-1
                    text-black bg-info bg-opacity-75 py-1 px-2"
                            style={{ borderRadius: "5px" }}
                            onClick={() => {
                                setViewAllButton(false);
                                setHideButton(true);
                                setAvailable(true);
                            }}
                        >
                            View All Classes
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
