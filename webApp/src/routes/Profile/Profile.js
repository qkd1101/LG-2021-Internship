import React, { useState, useEffect } from "react";
import { dbService } from "../../fbase";
import * as FaIcons from "react-icons/fa";
import "./Profile.css";
import axios from "axios";

const Profile = ({ userObj }) => {
  const [usersName, setUsersName] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userGmail, setUserGmail] = useState("");
  const [userInfoChange, setUserInfoChange] = useState(false);
  const [currentIp, setCurrentIp] = useState("");
  const [lastConnectedIp, setLastConnectedIp] = useState("");

  const getUserInfoFromFireStore = async () => {
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
          setUserEmail(cur_obj["email"]);
          setLastConnectedIp(cur_obj["lastConnectedIp"]);
          for (let i = 0; i < userList.length; i++) {
            setUsersName((prev) => [...prev, userList[i]]);
          }
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const getIP = async () => {
    axios
      .get(`https://ipinfo.io/json?token=72c34bedaa885f`)
      .then((response) => {
        setCurrentIp(response.data.ip);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getUserInfoFromFireStore();
    getIP();
  }, [userObj, userInfoChange]);
  const onChange = (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === "currentIp") {
      setCurrentIp(value);
    }
  };
  const onClick = async () => {
    setUserInfoChange((prev) => !prev);
  };

  const onClickSynchronize = async () => {
    const snapshot = await dbService.collection("ip_info").get();
    let isFirstConnection = true;
    let userDocId;
    snapshot.docs.map(async (doc) => {
      let userIpData = doc.data();
      if (userIpData.ip === lastConnectedIp) {
        userDocId = doc.id;
        isFirstConnection = false;
        await dbService.doc(`ip_info/${userDocId}`).update({ ip: currentIp });
      }
    });

    if (isFirstConnection) {
      let targetObj = {
        ip: currentIp,
        gmail: userGmail,
        userEmail: userEmail,
        usersName: usersName,
      };
      await dbService.collection("ip_info").add(targetObj);
    }
    await dbService
      .doc(`${userObj.uid}/userInfo`)
      .update({ lastConnectedIp: currentIp });

    setUserInfoChange((prev) => !prev);
  };
  return (
    <div className="profile-screen">
      Profile
      <div className="profile-screen-top-background"></div>
      <div className="profile-screen-bottom-background"></div>
      <div className="profile-wrapper">
        <div className="profile-inner-container">
          <div className="profile-title-area">
            <div>
              <FaIcons.FaUserAlt className="profile-title-icon" />
              <span className="profile-title">My Account</span>
            </div>
            <input
              type="button"
              className="profile-title-setting"
              value="UPDATE"
              onClick={onClick}
            />
          </div>
          <div className="profile-subtitile-area">
            <div className="profile-subtitile">USER INFORMATION</div>
            <div className="user-profile-img"></div>
            <span className="error-code profile-warning">
              If you really want to change user Info. conatct us XXX-XXXX{" "}
            </span>
          </div>
          <div className="profile-user-info-area">
            <div className="user-info-row">
              <div className="row-left row-side">
                <div className="row-left-label profile-row-label">
                  Email address
                </div>
                <input
                  className="row-left-input profile-email"
                  value={userEmail}
                  readOnly
                  type="text"
                />
              </div>
              <div className="row-right row-side">
                <div className="row-right-label profile-row-label">
                  User Gmail
                </div>
                <input
                  className="row-right-input profile-gmail"
                  value={userGmail}
                  readOnly
                  type="text"
                />
              </div>
            </div>

            <div className="user-info-row">
              {usersName.map((name, index) => {
                return (
                  <div className="row-side" key={index}>
                    <div className="profile-row-label">
                      User{index + 1} Name
                    </div>
                    <input
                      className="row-left-input"
                      value={usersName[index]}
                      readOnly
                      type="text"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="profile-subtitile ip-area">
            <span>My IP History</span>{" "}
            <input
              type="button"
              className="ip-synchronize-btn"
              value="synchronize"
              onClick={onClickSynchronize}
            />
          </div>
          <div className="profile-user-info-area">
            <div className="user-info-row">
              <div className="row-left row-side">
                <div className="row-left-label profile-row-label ip-row">
                  <span> Current IP</span>
                </div>
                <input
                  className="row-right-input profile-gmail currentIp"
                  name="currentIp"
                  value={currentIp}
                  onChange={onChange}
                  type="text"
                />
              </div>
              <div className="row-right row-side">
                <div className="row-right-label profile-row-label">
                  <span>Connected IP with Gmail</span>
                </div>
                <input
                  className="row-right-input profile-gmail"
                  value={lastConnectedIp}
                  readOnly
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
