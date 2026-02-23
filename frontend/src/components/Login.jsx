import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    setCaptcha(Math.random().toString(36).substring(2, 8));
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
      // store minimal info and token for app
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
    <div className="container mt-5">
      <div className="card p-4 shadow col-md-4 mx-auto">
        <h3 className="text-center mb-3">Login</h3>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="mb-2">
            <strong>Captcha:</strong>
            <span className="bg-light px-3 py-1 ms-2">{captcha}</span>
          </div>

          <input
            className="form-control mb-3"
            placeholder="Enter Captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <p className="text-center mt-3">
          New User? <a href="/register" className="fw-bold">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;