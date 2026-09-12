import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

import { login } from "../services/authService";

import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================
  // INPUT CHANGE
  // ==========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // ==========================
  // LOGIN
  // ==========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data = await login(
        formData.email,
        formData.password
      );

      // Save JWT token
      localStorage.setItem(
        "token",
        data.token
      );

      // Go to admin dashboard
      navigate("/admin", {
        replace: true,
      });

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );

    } finally {

      setLoading(false);

    }

  };


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


        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="input-group">

            <FaEnvelope
              className="input-icon"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="input-group">

            <FaLock
              className="input-icon"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >

              {showPassword
                ? <FaEyeSlash />
                : <FaEye />
              }

            </button>

          </div>


          {/* LOGIN BUTTON */}

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>

      </div>

    </div>

  );

}

export default Login;