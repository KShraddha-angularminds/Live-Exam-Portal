import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleLogin from "react-google-login";
import "./Style.css";
function Login() {
  console.log(window.location.href);
  const [showPassword, setShowPassword] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [validate,setValidate] =  useState({
    email:'',
    password:''
  })
  const [googleData, setGoogleData] = useState({
    idToken: "",
    reCaptchaToken: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    reCaptchaToken: "",
  });
  const reRef = useRef();
  const navigate = useNavigate();

  const loginSubmit = async (e) => {
    e.preventDefault();
   
    const token = await reRef.current.executeAsync();
    console.log(token);
    setFormData({ ...formData, reCaptchaToken: token });

    setValidate(functValidate(formData))
    setSubmit(true);


  };
const functValidate=(values)=>{
  const regex = /^[\w%\+\-]+(\.[\w%\+\-]+)*@[\w%\+\-]+(\.[\w%\+\-]+)+$/;
  const passReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const errors = {};
  if (values.email == "")
  {errors.email = "Username is Required";}
  else
  if(values.email.length<6)
   { errors.email = "Username is invalid";}
   else if(!regex.test(values.email))
   {console.log("innnnnnn"); errors.email = "Username is invalid";}
  if (values.password == "") {errors.password = "password is Required";}
  else
  if(values.password.length<6 || !passReg.test(values.password))
  { errors.password = "password is invalid";}
  return errors;
}
  useEffect(() => {
    if (submit && formData.reCaptchaToken != "") {
      axios
        .post("http://admin.liveexamcenter.in/api/auth/login", formData, {
          headers: { Accept: "application/json" },
        })
        .then((response) => {
          localStorage.setItem(
            "_activeUser",
            JSON.stringify(response.data.user)
          );
          navigate("/questions");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [submit]);
console.log(validate)
  const responseGoogle = async (response) => {
    console.log(response);
    const token = await reRef.current.executeAsync();
    googleData.reCaptchaToken = token;
    googleData.idToken = response.tokenId;
    axios
      .post("http://admin.liveexamcenter.in/api/auth/google", googleData, {
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        // localStorage.setItem("_activeUser", JSON.stringify(response.data.user));
        localStorage.setItem(
          "_activeUser",
          JSON.stringify(response.data.googlePayload)
        );
        navigate("/questions");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("_activeUser")) navigate("/questions");
  }, []);
  return (
    <div className="login">
      <form onSubmit={loginSubmit}>
        <div className="container-login">
          <h1>Login to your account</h1>
          <div className="login-userName">
            <label>
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              style={{ display: "block", width: "100%" }}
              name="uname"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              } 
            />
           <span style={{ color: "red" }}>{validate.email}</span>
          </div>
          <div className="login-userName">
            <label>
              <b>Password</b>
            </label>
            <div style={{ position: "relative" }}>
              {showPassword == false ? (
                <>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    style={{ display: "block", width: "100%" }}
                    name="psw"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="pass-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter Password"
                    style={{ display: "block", width: "100%" }}
                    name="psw"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="pass-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className="fa fa-eye-slash"></i>
                  </button>
                </>
              )}
                              <span style={{ color: "red" }}>{validate.password}</span>
            </div>
            <div>
              <button
                type="button"
                className="option-btm-btn"
                style={{
                  backgroundColor: "white",
                  border: "none",
                  marginTop: "30px",
                }}
              >
                {" "}
                Forgot Password?
              </button>
              <ReCAPTCHA
                sitekey="6Ld3COIZAAAAAC3A_RbO1waRz6QhrhdObYOk7b_5"
                size="invisible"
                ref={reRef}
              />
              <button type="submit" className="btn btn-primary login-submit">
                Login
              </button>
            </div>
            <label
              style={{
                textAlign: "center",
                margin: "15px auto",
                display: "block",
              }}
            >
              OR
            </label>
            <center>
              <GoogleLogin
                clientId="971623344603-0qquan9pcdb9iu7oq9genvpnel77i7oa.apps.googleusercontent.com"
                buttonText="Log in With Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </center>
          </div>
        </div>

        {/* <div class="container" style="background-color:#f1f1f1">
                    <button type="button" class="cancelbtn">Cancel</button>
                    <span class="psw">Forgot <a href="#">password?</a></span>
                </div>   */}
      </form>
    </div>
  );
}

export default Login;
