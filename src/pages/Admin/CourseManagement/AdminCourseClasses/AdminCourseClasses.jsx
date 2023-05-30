import React from "react";
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

    return (
        <div className="row flex justify-content-start">
            <div className="course-detail-classes col-10">
                {courseClasses.length <= 0 ? (
                    <p
                        className="text-danger text-center p-0 m-0"
                        style={{ fontSize: "18px", fontWeight: "600" }}
                    >
                        No available class till present!
                    </p>
                ) : (
                    <TableContainer component={Paper}>
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
                                {courseClasses.map(
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
                                        return (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">
                                                    {index + 1}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {moment(new Date(`${startDate}`)).format(
                                                        "DD-MM-YYYY"
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {moment(new Date(`${endDate}`)).format("DD-MM-YYYY")}
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
                                                            {date},{" "}{time}
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
            </div>
        </div>
    );
}
