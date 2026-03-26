import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fname: "",
    mname: "",
    lname: "",
    mobile: "",
    photo: null,
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const fullName = `${form.fname} ${form.mname} ${form.lname}`.trim();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG files are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Photo size must be under 1 MB");
      e.target.value = "";
      return;
    }

    setForm({ ...form, photo: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (submitting) return;

    if (
      !form.fname ||
      !form.mname ||
      !form.lname ||
      !form.mobile ||
      !form.photo ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("All fields are required");
      return;
    }

    if (form.mobile.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Password and Confirm Password must match");
      return;
    }

    const formData = new FormData();
    formData.append("fname", form.fname);
    formData.append("mname", form.mname);
    formData.append("lname", form.lname);
    formData.append("mobile", form.mobile);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("photo", form.photo);

    setSubmitting(true);
    setStatusMessage("Please wait... storing data");

    API.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        setStatusMessage("Registration Successful");
        setTimeout(() => {
          setSubmitting(false);
          setStatusMessage("");
          navigate("/login");
        }, 800);
      })
      .catch((err) => {
        console.error(err);
        const msg = err?.response?.data?.message || "Registration failed";
        setStatusMessage(msg);
        setSubmitting(false);
        setTimeout(() => setStatusMessage(""), 3000);
      });
  };

  return (
    <section className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="page-header text-center">
          <span className="page-kicker">Create Account</span>
          <h1 className="page-title">Registration</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <input className="form-control input-strong" name="fname" placeholder="First Name *" onChange={handleChange} disabled={submitting} />
            <input className="form-control input-strong" name="mname" placeholder="Middle Name *" onChange={handleChange} disabled={submitting} />
          </div>

          <input className="form-control input-strong" name="lname" placeholder="Last Name *" onChange={handleChange} disabled={submitting} />

          <input
            className="form-control input-strong"
            value={fullName}
            placeholder="Full Name *"
            disabled
          />

          <input
            className="form-control input-strong"
            name="mobile"
            placeholder="Mobile Number *"
            onChange={handleChange}
            disabled={submitting}
          />

          <div>
            <label className="field-label">Photo Upload *</label>
            <p className="file-note">JPG / JPEG / PNG, maximum 1 MB.</p>
          </div>
          <input
            type="file"
            className="form-control input-strong"
            onChange={handleFileChange}
            disabled={submitting}
          />

          <input
            type="email"
            className="form-control input-strong"
            name="email"
            placeholder="Email (Username) *"
            onChange={handleChange}
            disabled={submitting}
          />

          <input
            type="password"
            className="form-control input-strong"
            name="password"
            placeholder="Password *"
            onChange={handleChange}
            disabled={submitting}
          />

          <input
            type="password"
            className="form-control input-strong"
            name="confirmPassword"
            placeholder="Confirm Password *"
            onChange={handleChange}
            disabled={submitting}
          />

          <button className="app-btn app-btn--accent w-100" disabled={submitting}>
            {submitting ? (statusMessage || "Please wait...") : "Register"}
          </button>
        </form>

        <p className="form-meta">
          Already have an account? <Link to="/login" className="form-link">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
