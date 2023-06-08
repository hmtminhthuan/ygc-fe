import React, { useEffect, useState } from "react";
import { api } from "../../constants/api";

export default function ScheduleTrainee() {
  const [timeFrames, setTimeFrames] = useState([]);
  useEffect(() => {
    api
      .get("/Timeframe/GetTimeFrameList")
      .then((res) => {
        setTimeFrames(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="container">
      <div className="timetable-img text-center">
        <img src="img/content/timetable.png" alt />
      </div>
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead>
            <tr className="bg-light-gray">
              <th className="text-uppercase">Time</th>
              <th className="text-uppercase">Monday</th>
              <th className="text-uppercase">Tuesday</th>
              <th className="text-uppercase">Wednesday</th>
              <th className="text-uppercase">Thursday</th>
              <th className="text-uppercase">Friday</th>
              <th className="text-uppercase">Saturday</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* {" "}
              {timeFrames.map((timeFrame) => (
                <td className="align-middle" key={timeFrame.id}>
                  {timeFrame.timeFrame1}
                </td>
              ))}
              <td>
                <span className="bg-sky padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16 xs-font-size13">
                  Dance
                </span>
                <div className="margin-10px-top font-size14">9:00-10:00</div>
                <div className="font-size13 text-light-gray">Ivana Wong</div>
              </td>
              <td>
                <span className="bg-green padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16  xs-font-size13">
                  Yoga
                </span>
                <div className="margin-10px-top font-size14">9:00-10:00</div>
                <div className="font-size13 text-light-gray">Marta Healy</div>
              </td>
              <td>
                <span className="bg-yellow padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16  xs-font-size13">
                  Music
                </span>
                <div className="margin-10px-top font-size14">9:00-10:00</div>
                <div className="font-size13 text-light-gray">Ivana Wong</div>
              </td>
              <td>
                <span className="bg-sky padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16  xs-font-size13">
                  Dance
                </span>
                <div className="margin-10px-top font-size14">9:00-10:00</div>
                <div className="font-size13 text-light-gray">Ivana Wong</div>
              </td>
              <td>
                <span className="bg-purple padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16  xs-font-size13">
                  Art
                </span>
                <div className="margin-10px-top font-size14">9:00-10:00</div>
                <div className="font-size13 text-light-gray">Kate Alley</div>
              </td>
              <td>
                <span className="bg-pink padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16  xs-font-size13">
                  English
                </span>
                <div className="margin-10px-top font-size14">9:00-10:00</div>
                <div className="font-size13 text-light-gray">James Smith</div>
              </td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
