import React, { useState } from "react";
import Calender from "../../components/Calender/Calender";
import "./Home.css";
import { useEffect } from "react";
import { dbService } from "../../fbase";
import PlanList from "../../components/PlanList/PlanList";

const Home = ({ userObj }) => {
  let today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [clickDay, setClickDay] = useState();
  const [isSideBar, setIsSideBar] = useState(false);

  const [curUserName, setCurUserName] = useState("");
  const [usersName, setUsersName] = useState([]);
  const [userGmail, setUserGmail] = useState("");

  const [planningDay, setPlanningDay] = useState([]);
  const [planningDayDocId, setPlanningDayDocId] = useState("");

  const onSetCurUserNum = (event) => {
    event.preventDefault();
    const name = event.target.value;
    setCurUserName(name);
  };
  const getUserListAndGmailFromFireStore = async () => {
    if (userObj === null) {
      return;
    }
    const docRef = dbService.doc(`${userObj.uid}/userInfo`);
    docRef
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          setUsersName([]);
          let cur_obj = doc.data();
          let userList = cur_obj["users"];
          setUserGmail(cur_obj["gmail"]);
          for (let i = 0; i < userList.length; i++) {
            setUsersName((prev) => [...prev, userList[i]]);
          }
          setCurUserName(userList[0]);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const getPlanDayFromFireStore = async () => {
    // var docDay;
    // if (clickDay == undefined) {
    //   docDay = today.getDate();
    // } else {
    //   docDay = clickDay;
    // }
    if (userGmail === undefined || curUserName === "") {
      return;
    }
    await dbService
      .collection(`127.0.0.1`)
      .doc(`${curUserName}`)
      .collection(`${year}`)
      .doc(`${month}`)
      .collection(`planningDay`)
      .onSnapshot((snapShot) => {
        const planningDayArr = snapShot.docs.map((doc) => {
          console.log(doc.id);
          setPlanningDayDocId(doc.id);
          return doc.data().day;
        });

        setPlanningDay(planningDayArr[0]);
      });
  };
  useEffect(() => {
    getUserListAndGmailFromFireStore();
  }, [userObj]);

  useEffect(() => {
    if (!clickDay) {
      setClickDay(today.getDate());
    }
    setPlanningDayDocId("");
    getPlanDayFromFireStore(curUserName);
  }, [userObj, curUserName, year, month, clickDay]);

  return (
    <div className="home-screen">
      {userObj && (
        <div className="home-screen-inner-border">
          <div className="home_wrapper">
            <div className="calender_img">
              <div className="calender_area">
                <Calender
                  year={year}
                  setYear={setYear}
                  month={month}
                  setMonth={setMonth}
                  clickDay={clickDay}
                  setClickDay={setClickDay}
                  planningDay={planningDay}
                  curUserName={curUserName}
                />
              </div>
            </div>
            <PlanList
              userObj={userObj}
              year={year}
              month={month}
              clickDay={clickDay}
              planningDay={planningDay}
              setPlanningDay={setPlanningDay}
              curUserName={curUserName}
              onSetCurUserNum={onSetCurUserNum}
              userGmail={userGmail}
              usersName={usersName}
              planningDayDocId={planningDayDocId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
