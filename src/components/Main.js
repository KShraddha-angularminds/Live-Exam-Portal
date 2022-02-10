import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  const logout = () => {
    const tokenKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRkMjgwYWU2ZDdkNzdjOGU0ZjY4ZjYiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQ0NDY5NjY4LCJleHAiOjE2NDQ1MTI4Njh9.xcE84Ciu1W-lKBVdhg00xxyVvVhynYwjOJ6kkaXZ7SA";
    axios
      .get(`http://admin.liveexamcenter.in/api/auth/logout`, {
        headers: { authorization: tokenKey },
      })
      .then((response) => {
        localStorage.removeItem("_activeUser");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (!localStorage.getItem("_activeUser")) navigate("/");
  }, []);
  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-light bg-dark fixed-top">
        <div
          className="collapse navbar-collapse justify-content-between"
          id="nav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                id="RouterNavLink"
                className="nav-link text-light font-weight-light"
                to="/questions"
              >
                Questions
              </Link>
            </li>

            <li className="nav-item">
              <Link
                id="RouterNavLink"
                className="nav-link text-light font-weight-light"
                to="/subjects"
              >
                Subjects
              </Link>
            </li>
            <li className="nav-item">
              <Link
                id="RouterNavLink"
                className="nav-link text-light font-weight-light"
                to="/topics"
              >
                Topics
              </Link>
            </li>
          </ul>

          <button type="button" onClick={logout} style={{ float: "right" }}>
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Main;
