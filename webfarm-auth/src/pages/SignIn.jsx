import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import "../styles/style.css";

const SignIn = () => {
  return (
    <div className="signin-container">
      {/* Left Section - Branding */}
      <div className="branding-section">
        <h1>Webfarm Technology</h1>
        <p>Where Innovation Meets Technology</p>
      </div>

      {/* Right Section - Sign-in Form */}
      <div className="form-section">
        <form className="signin-form">
          <h2>Sign In</h2>
          <input type="email" placeholder="Email or mobile number" required />
          <input type="password" placeholder="Password" required />
          <button className="signin-btn">Sign In</button>

          {/* Additional options */}
          <div className="options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          {/* OAuth Login */}
          <div className="oauth-container">
            <FaGoogle className="oauth-icon" />
            <FaFacebook className="oauth-icon" />
          </div>

          {/* Sign Up Link */}
          <p className="signup-text">
            New to Webfarm? <a href="#">Sign up now.</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
