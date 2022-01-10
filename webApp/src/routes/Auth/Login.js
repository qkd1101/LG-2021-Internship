import { authService } from "../../fbase";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();

    await authService
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // Sign-out successful.
      })
      .catch((err) => {
        setError(err.message);
        console.log(err.message);
      });
  };
  const onChange = (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };
  return (
    <div className="auth_screen">
      <div className="auth_wrapper">
        <div className="auth_inner">
          <form onSubmit={onSubmit}>
            <h3 className="page-title">Sign In</h3>
            <div className="form-group">
              <label>Email address</label>
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
              <div className="custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>
            {error && <span className="error-code">{error}</span>}
            <button type="submit" className="btn-primary btn-block">
              Submit
            </button>
            <p className="sign-up_link text-right">
              Dont have an account? <Link to="/sign-up">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
