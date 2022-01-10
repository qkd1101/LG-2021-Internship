import React, { useState, useEffect } from "react";
import { dbService } from "../../fbase";
import * as FaIcons from "react-icons/fa";
import SearchBox from "../SearchBox/SearchBox";
import GoogleMap from "google-map-react";
import "./PlanList.css";
const PlanList = ({
  userObj,
  year,
  month,
  clickDay,
  planningDay,
  setPlanningDay,
  curUserName,
  onSetCurUserNum,
  userGmail,
  usersName,
  planningDayDocId,
}) => {
  let today = new Date();

  const [isActiveAddInput, setIsActiveAddInput] = useState(false);
  const [isActiveDeleteCheckBox, setIsActiveDeleteCheckBox] = useState(false);
  const [ori, setOri] = useState({});
  const [dest, setDest] = useState({});
  const [userTodoList, setUserTodoList] = useState([]);
  //GOOGLE API
  const [apiReady, setApiReady] = useState(false);
  const [map, setMap] = useState(null);
  const [googlemaps, setGooglemaps] = useState(null);
  const [center, setCenter] = useState({ lat: 37.5, lng: 127 });
  let zoom = 10;

  if (window.screen.width >= 768) {
    zoom = 15;
  }
  const handleApiLoaded = (map, maps) => {
    if (map && maps) {
      setApiReady(true);
      setMap(map);
      setGooglemaps(maps);
    }
  };
  //GOOGLE API
  const getToDoListFromFireStore = async (curUserName) => {
    if (userGmail === undefined || curUserName === "") {
      return;
    }
    await dbService
      .collection(`127.0.0.1`)
      .doc(`${curUserName}`)
      .collection(`${year}`)
      .doc(`${month}`)
      .collection(`${clickDay}`)
      .orderBy("time")
      .onSnapshot((snapShot) => {
        const docDataList = snapShot.docs.map((doc) => {
          let docObj = {
            what: doc.data().what,
            time: doc.data().time,
            ori: doc.data().ori.name,
            dest: doc.data().dest.name,
            item: doc.data().item,
          };
          return {
            id: doc.id,
            ...docObj,
          };
        });
        setUserTodoList(docDataList);
      });
  };
  useEffect(() => {
    setIsActiveAddInput(false);
    setIsActiveDeleteCheckBox(false);
    getToDoListFromFireStore(curUserName);
  }, [userObj, curUserName, year, month, clickDay]);

  useEffect(() => {}, [apiReady, googlemaps]);

  const toggleDeleteListOnClick = () => {
    setIsActiveDeleteCheckBox((prev) => !prev);
  };
  const deleteListOnClick = async () => {
    const deleteListBox = document.getElementsByClassName("deleteCheckBox");
    let deleteListIndex = [];
    for (let i = 0; i < deleteListBox.length; i++) {
      if (deleteListBox[i].checked === true) {
        deleteListIndex.push(i);
      }
    }
    if (deleteListIndex.length === 0) {
      setIsActiveDeleteCheckBox(false);
      return;
    }
    if (deleteListBox.length === deleteListIndex.length) {
      setPlanningDay((prev) => prev.filter((x) => x !== clickDay));
      let newPlanningDay = planningDay.filter((x) => x !== clickDay);
      await dbService
        .collection(`127.0.0.1`)
        .doc(`${curUserName}`)
        .collection(`${year}`)
        .doc(`${month}`)
        .collection(`planningDay`)
        .doc(`${planningDayDocId}`)
        .update({ day: newPlanningDay });
    }
    setIsActiveDeleteCheckBox(false);
    for (let i = 0; i < deleteListIndex.length; i++) {
      const docId = userTodoList[deleteListIndex[i]].id;
      await dbService
        .collection(`127.0.0.1`)
        .doc(`${curUserName}`)
        .collection(`${year}`)
        .doc(`${month}`)
        .collection(`${clickDay}`)
        .doc(`${docId}`)
        .delete();
    }
  };
  const addListOnClick = () => {
    setIsActiveAddInput((prev) => !prev);
  };
  const onCancleIsActiveAddInput = () => {
    setIsActiveAddInput(false);
  };
  const onSubmitNewListInput = async () => {
    setIsActiveAddInput(false);

    const whatContainer = document.querySelector(`.what`);
    const timeContainer = document.querySelector(`.time`);
    const itemContainer = document.querySelector(`.item`);
    if (
      whatContainer.value === "" ||
      timeContainer.value === "" ||
      ori === undefined ||
      dest === undefined ||
      itemContainer.value === ""
    ) {
      return;
    }
    let targetObj = {
      what: whatContainer.value,
      time: timeContainer.value,
      ori: ori,
      dest: dest,
      item: itemContainer.value,
    };

    await dbService
      .collection(`127.0.0.1`)
      .doc(`${curUserName}`)
      .collection(`${year}`)
      .doc(`${month}`)
      .collection(`${clickDay}`)
      .add(targetObj)
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

    let isDocDayInPlan = false;
    if (planningDay) {
      for (let i = 0; i < planningDay.length; i++) {
        if (planningDay[i] === clickDay) {
          isDocDayInPlan = true;
          break;
        }
      }
    }

    if (!isDocDayInPlan) {
      let collectionRef = dbService.collection(
        `127.0.0.1/${curUserName}/${year}/${month}/planningDay`
      );
      if (planningDayDocId) {
        let newPlanningDay = [...planningDay, clickDay];
        let setObj = { day: newPlanningDay };
        await collectionRef.doc(`${planningDayDocId}`).set(setObj);
      } else {
        let setObj = { day: [clickDay] };
        await collectionRef.add(setObj);
      }
    }
  };

  return (
    <div className="user-plan">
      <div className="googleMap">
        <GoogleMap
          bootstrapURLKeys={{
            key: "AIzaSyBYrQ0_gCCY05C7LD6X_0KCI-1cwsAzm6U",
            libraries: "places",
          }}
          defaultCenter={center}
          defaultZoom={zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        ></GoogleMap>
      </div>
      <div className="user-name-input-area">
        <span>User Name : </span>
        {userObj ? (
          <select
            className="user_name_select"
            name="users"
            onChange={onSetCurUserNum}
          >
            (
            {usersName.map((name, index) => {
              return (
                <option key={index} value={name}>
                  {name}
                </option>
              );
            })}
            )
          </select>
        ) : undefined}
      </div>
      <div className="plan-list">
        <span className="plan-list-title">
          {curUserName}'s {month}/{clickDay} plans
        </span>
        <div className="plan-list_inner">
          <div className="list-area">
            <table className="add-table">
              <thead>
                <tr>
                  <th>What</th>
                  <th>Time</th>
                  <th>Ori</th>
                  <th>Dest</th>
                  <th>Item</th>
                </tr>
              </thead>
              <tbody>
                {userTodoList.map((list, index) => {
                  return (
                    <tr key={index}>
                      <td
                        className={
                          isActiveDeleteCheckBox ? "padding-left-6" : undefined
                        }
                      >
                        {isActiveDeleteCheckBox ? (
                          <input
                            className="deleteCheckBox"
                            type="checkbox"
                            name="wantToDelete"
                          />
                        ) : undefined}
                        {list.what}
                      </td>
                      <td>{list.time}</td>
                      <td>{list.ori}</td>
                      <td>{list.dest}</td>
                      <td>{list.item}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {isActiveAddInput ? (
          <div className="table-area add-input">
            <table className="add-table">
              <thead>
                <tr>
                  <th>What</th>
                  <th>Time</th>
                  <th>Ori</th>
                  <th>Dest</th>
                  <th>Item</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input className="what" type="text" placeholder="Enter.." />
                  </td>
                  <td>
                    <input className="time" type="time" />
                  </td>
                  <td>
                    {apiReady && googlemaps && (
                      <SearchBox mapApi={googlemaps} setState={setOri} />
                    )}
                  </td>
                  <td>
                    {apiReady && googlemaps && (
                      <SearchBox mapApi={googlemaps} setState={setDest} />
                    )}
                  </td>
                  <td>
                    <input className="item" type="text" placeholder="Enter.." />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="cancle-add-input-btn-area">
              <FaIcons.FaMinusSquare
                className="cancle-add-input-btn"
                onClick={onCancleIsActiveAddInput}
              />
            </div>
            <div className="submit-input-btn-area">
              <FaIcons.FaPlusSquare
                className="submit-input-btn"
                onClick={onSubmitNewListInput}
              />
            </div>
          </div>
        ) : undefined}
        {/* <div className="addListInput"></div> */}
        <div className="list-control-area">
          <div className="add-list-btn list-btn">
            <FaIcons.FaCalendarPlus onClick={addListOnClick} />
          </div>
          <div className="delte-list-btn list-btn">
            <FaIcons.FaCalendarMinus onClick={toggleDeleteListOnClick} />
          </div>
          {isActiveDeleteCheckBox && (
            <div className="move-to-trash list-btn">
              <FaIcons.FaTrash onClick={deleteListOnClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PlanList;
