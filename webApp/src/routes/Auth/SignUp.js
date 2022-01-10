import { authService } from "../../fbase";
import React, { useState } from "react";
import "./SignUp.css";
import { Link, useHistory } from "react-router-dom";
import { dbService } from "../../fbase";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gmail, setGmail] = useState("");
  const [error, setError] = useState("");
  const [userNum, setUserNum] = useState(0);
  const history = useHistory();
  const onSubmit = async (event) => {
    event.preventDefault();

    let users = [];
    console.log(event.target);
    console.log(email, password);
    for (let i = 0; i < userNum; i++) {
      const container = document.querySelector(`.userName${i}`);
      users.push(container.value);
    }
    let userObj = {
      email: email,
      gmail: gmail,
      userNum: userNum,
      users: users,
      lastConnectedIp: "None",
    };
    authService
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        let user = userCredential.user;
        console.log(user.uid);
        await dbService.doc(`${user.uid}/userInfo`).set(userObj);
        history.push("/");
      })
      .catch((err) => {
        setError(err.message);
        console.log(err.message);
      });
  };
  const onSetUserNum = (event) => {
    event.preventDefault();
    const num = parseInt(event.target.value);
    setUserNum(num);
  };
  const onChange = (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else {
      setGmail(value);
    }
  };

  const usersFormRendering = () => {
    const result = [];
    for (let i = 0; i < userNum; i++) {
      result.push(
        <div className="form-group" key={i}>
          <label>User{i + 1} : </label>
          <input
            type="text"
            name={i}
            className={"form-control " + "userName" + i}
            placeholder="Enter user name"
          />
        </div>
      );
    }
    return result;
  };

  return (
    <div className="auth_screen">
      <div className="auth_wrapper">
        {/* <div className="AppTitle AuthTitle"></div> */}
        <div className="auth_inner">
          <form onSubmit={onSubmit}>
            <h3 className="page-title">Sign Up</h3>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="form-control"
                placeholder="Enter password"
              />
            </div>
            <div className="form-group">
              <label>Google ID connected to Google Assistant </label>
              <input
                type="email"
                name="gmail"
                value={gmail}
                onChange={onChange}
                className="form-control"
                placeholder="Enter Gmail"
              />
            </div>

            {userNum !== 0 ? (
              <>{usersFormRendering()}</>
            ) : (
              <div className="form-group">
                <label>Users</label>
                <div className="users_num">
                  How many user use this account
                  <select
                    className="user_num_select"
                    name="users"
                    onChange={onSetUserNum}
                  >
                    <option value="0">Click</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
              </div>
            )}
            {error && <span className="error-code">{error}</span>}
            <button type="submit" className="btn-primary btn-block">
              Submit
            </button>
            <p className="sign-up_link text-right">
              Already have an account? <Link to="/">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
