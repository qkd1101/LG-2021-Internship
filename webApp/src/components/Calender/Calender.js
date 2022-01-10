import React, { useState, useEffect } from "react";
import "./Calender.css";
import * as FsIcons from "react-icons/fa";
const Calender = ({
  year,
  setYear,
  month,
  setMonth,
  clickDay,
  setClickDay,
  planningDay,
  curUserName,
}) => {
  let today = new Date();

  const [cal, setCal] = useState([]);

  const [toggleCalChange, setToggleCalCahnge] = useState(true);

  const calDic = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };
  const weekDic = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weekDic2 = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATDAY",
  ];

  const leftHandleWeek = () => {
    if (month === 1) {
      setMonth((prev) => 13 - prev);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };
  const rightHandleWeek = () => {
    if (month === 12) {
      setMonth((prev) => 13 - prev);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };
  const getFirstDayIndex = () => {
    let fistDayIndex = new Date(`${year}-${month}-01`).getDay();
    return fistDayIndex;
  };
  const makeCalendar = () => {
    setClickDay();
    setCal([]);
    let arr = [];
    let fistDayIndex = getFirstDayIndex();
    let day = 1;
    for (let i = 0, cnt = 1; i < 7; i++) {
      if (i < fistDayIndex) {
        arr.push(".");
      } else {
        arr.push(`${cnt}`);
        cnt += 1;
        day = cnt;
      }
    }
    let m = calDic[month];
    for (let i = day; i <= m; i++) {
      arr.push(i);
    }
    setCal((prev) => [...prev, ...arr]);
    setToggleCalCahnge((prev) => !prev);
  };
  const getWeekDic2 = (d) => {
    return weekDic2[d];
  };

  const dayOnClick = (e) => {
    let parsedInt_clickDay = parseInt(e.target.innerText);
    const className = e.target.className;
    const arr = className.split(" ");
    for (var i in arr) {
      // dot 클릭시 sidebar 실행 x
      if (arr[i] === "dot") {
        return;
      }
    }
    setClickDay(parsedInt_clickDay);
    console.log(year, month, parsedInt_clickDay);
  };

  useEffect(() => {
    makeCalendar();
    return () => {};
  }, [year, month]);

  return (
    <>
      <div className="calender">
        <div id="container">
          <div className="year-month-container">
            <div className="year-month-container-inner">
              <div id="year">{year}</div>
              <span id="bar">/ </span>
              <div id="month"> {month}</div>
            </div>
            <div className="control-btn">
              <div className="each_btn" onClick={leftHandleWeek}>
                <FsIcons.FaChevronLeft />
              </div>
              <div className="each_btn" onClick={rightHandleWeek}>
                <FsIcons.FaChevronRight />
              </div>
            </div>
          </div>
          <div id="weekDic">
            {weekDic.map((dic, index) => {
              return (
                <div className="dic" id={dic} key={index}>
                  {dic}
                </div>
              );
            })}
          </div>
          <div id="calenda">
            {cal.map((day, index) => {
              return (
                <div
                  id={day}
                  className={
                    "day" +
                    (day === today.getDate() && month === today.getMonth() + 1
                      ? " today"
                      : "") +
                    (day !== "." ? ` day-num` : " dot") +
                    (planningDay === undefined ||
                    planningDay.indexOf(day) === -1
                      ? ""
                      : " plan")
                  }
                  key={index}
                  onClick={dayOnClick}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calender;
