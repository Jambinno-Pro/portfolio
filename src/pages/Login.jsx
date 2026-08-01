import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";

import "../styles/Login.css";

function Login() {

  const [showPassword, setShowPassword] = useState(false);

  return (

    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">

          <h1>
            IJ<span>.</span>
          </h1>

          <p>
            Portfolio Administration
          </p>

        </div>

        <form>

          <div className="input-group">

            <FaEnvelope className="input-icon"/>

            <input
              type="email"
              placeholder="Email Address"
            />

          </div>

          <div className="input-group">

            <FaLock className="input-icon"/>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >

              {showPassword ? <FaEyeSlash/> : <FaEye/>}

            </button>

          </div>

          <div className="login-options">

            <label>

              <input type="checkbox"/>

              Remember Me

            </label>

            <a href="#">
              Forgot Password?
            </a>

          </div>

          <button
            className="login-btn"
            type="submit"
          >

            Login

          </button>

        </form>

      </div>

    </div>

  );

}

export default Login;