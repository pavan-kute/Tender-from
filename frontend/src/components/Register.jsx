import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    if (submitting) return; // prevent double click

    // Validation
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

    // submit to backend
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
      .then((res) => {
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
    <div className="container mt-5">
      <div className="card p-4 shadow col-md-5 mx-auto">
        <h3 className="text-center mb-3">Registration</h3>

        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" name="fname" placeholder="First Name *" onChange={handleChange} disabled={submitting} />
          <input className="form-control mb-2" name="mname" placeholder="Middle Name *" onChange={handleChange} disabled={submitting} />
          <input className="form-control mb-2" name="lname" placeholder="Last Name *" onChange={handleChange} disabled={submitting} />

          <input
            className="form-control mb-2"
            value={fullName}
            placeholder="Full Name *"
            disabled
          />

          <input
            className="form-control mb-2"
            name="mobile"
            placeholder="Mobile Number *"
            onChange={handleChange}
            disabled={submitting}
          />

          <label>Photo (JPG / JPEG / PNG ≤ 1MB) *</label>
          <input
            type="file"
            className="form-control mb-2"
            onChange={handleFileChange}
            disabled={submitting}
          />

          <input
            type="email"
            className="form-control mb-2"
            name="email"
            placeholder="Email (Username) *"
            onChange={handleChange}
            disabled={submitting}
          />

          <input
            type="password"
            className="form-control mb-2"
            name="password"
            placeholder="Password *"
            onChange={handleChange}
            disabled={submitting}
          />

          <input
            type="password"
            className="form-control mb-3"
            name="confirmPassword"
            placeholder="Confirm Password *"
            onChange={handleChange}
            disabled={submitting}
          />

          <button className="btn btn-success w-100" disabled={submitting}>{submitting ? (statusMessage || "Please wait...") : "Register"}</button>
        </form>
        <p className="text-center mt-3">
  Already have an account?{" "}
  <a href="/login" className="text-primary fw-bold">
    Login
  </a>
</p>
      </div>
    </div>
  );

}

export default Register;