import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const value = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setCaptcha(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password || !captchaInput) {
      alert("All fields are required");
      return;
    }

    if (captchaInput !== captcha) {
      alert("Invalid Captcha");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    try {
      const res = await API.post("/users/login", { email: username, password });
      const user = res.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ username: user.email, fullName: user.fullName, id: user.id, photoUrl: user.photoUrl, token: user.token })
      );
      alert("Login Successful");
      navigate("/tender");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Login failed";
      alert(msg);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="page-header text-center">
          <span className="page-kicker">Account Access</span>
          <h1 className="page-title">Login</h1>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control input-strong"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="form-control input-strong"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="captcha-box">
            <div>
              <span className="field-label">Captcha</span>
              <div className="file-note">Enter the exact code shown below.</div>
            </div>
            <span className="captcha-chip">{captcha}</span>
          </div>

          <input
            className="form-control input-strong"
            placeholder="Enter Captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />

          <button className="app-btn app-btn--primary w-100">Login</button>
        </form>

        <p className="form-meta">
          New user? <Link to="/register" className="form-link">Create account</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
