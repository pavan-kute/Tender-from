import { useState, useEffect } from "react";
import { saveTender, updateTender } from "../utils/storage";
import { useNavigate } from "react-router-dom";

function TenderForm({ editData, editIndex }) {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [form, setForm] = useState(
    editData || {
      type: "",
      fullName: "",
      address: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      mobile: "",
      email: "",
      license: "",
      gst: "",
      goodsType: "",
      goodsDemand: "",
      saleRate: "",
      passport: null,
      aadhar: null,
      pan: null,
      gstCert: null,
      licenseCert: null,
      remarks: "",
    }
  );

  // TEXT / RADIO CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // FILE CHANGE (1MB VALIDATION)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      alert("File size must be under 1 MB");
      e.target.value = "";
      return;
    }
    setForm({ ...form, [e.target.name]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent double submissions
    // require login
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.token) {
      alert("You must be logged in to submit or edit a tender.");
      navigate("/login");
      return;
    }

    // Mandatory field validation for non-file fields
    const requiredFields = [
      "type",
      "fullName",
      "address",
      "city",
      "district",
      "state",
      "pincode",
      "mobile",
      "email",
      "license",
      "gst",
      "goodsType",
      "goodsDemand",
      "saleRate",
    ];

    for (let key of requiredFields) {
      if (!form[key]) {
        alert("All * marked fields are required");
        return;
      }
    }

    // For file fields, require them only when creating a new tender (no existing URL in editData)
    const fileKeys = ["passport", "aadhar", "pan", "gstCert", "licenseCert"];
    for (let key of fileKeys) {
      const hasFile = form[key] instanceof File;
      const hasExistingUrl = editData && editData[key];
      if (!hasFile && !hasExistingUrl) {
        alert("All * marked fields are required");
        return;
      }
    }

    if (form.mobile.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage("Please wait... storing data");

      if (editData) {
        const idOrIndex = editData._id ?? editData.id ?? editIndex;
        await updateTender(idOrIndex, form);
      } else {
        await saveTender(form);
      }

      setStatusMessage("Data stored");
      // short pause so user sees the confirmation
      setTimeout(() => {
        setSubmitting(false);
        setStatusMessage("");
        navigate("/report");
      }, 800);
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to submit tender. See console.");
      setSubmitting(false);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const isAuthed = !!(JSON.parse(localStorage.getItem("user") || "null")?.token);
  const disabledWhile = !isAuthed || submitting;

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">Tender Filling Form</h3>

      {!isAuthed && <div className="alert alert-warning">Please login to fill or edit tender forms.</div>}

      <form className="card p-4 shadow" onSubmit={handleSubmit}>
        {/* TYPE */}
        <select className="form-select mb-2" name="type" value={form.type} onChange={handleChange} required disabled={disabledWhile}>
          <option value="">Type *</option>
          <option>Broker</option>
          <option>Purchaser</option>
          <option>Wholesaler</option>
        </select>

        {/* BASIC DETAILS */}
        <input className="form-control mb-2" name="fullName" placeholder="Full Name *" value={form.fullName} onChange={handleChange} required disabled={disabledWhile} />
        <textarea className="form-control mb-2" name="address" placeholder="Address *" value={form.address} onChange={handleChange} required disabled={disabledWhile} />

        <input className="form-control mb-2" name="city" placeholder="City / Village / Taluka *" value={form.city} onChange={handleChange} required disabled={disabledWhile} />
        <input className="form-control mb-2" name="district" placeholder="District *" value={form.district} onChange={handleChange} required disabled={disabledWhile} />
        <input className="form-control mb-2" name="state" placeholder="State *" value={form.state} onChange={handleChange} required disabled={disabledWhile} />
        <input className="form-control mb-2" name="pincode" placeholder="Pincode *" value={form.pincode} onChange={handleChange} required disabled={disabledWhile} />

        <input className="form-control mb-2" name="mobile" placeholder="Mobile Number *" value={form.mobile} onChange={handleChange} required disabled={disabledWhile} />
        <input className="form-control mb-2" type="email" name="email" placeholder="Email ID *" value={form.email} onChange={handleChange} required disabled={disabledWhile} />

        {/* RADIO BUTTONS */}
        <div className="mb-2">
          <label className="me-3">License Number *</label>
          <input type="radio" name="license" value="Yes" onChange={handleChange} required disabled={disabledWhile} /> Yes
          <input type="radio" name="license" value="No" onChange={handleChange} className="ms-3" disabled={disabledWhile} /> No
        </div>

        <div className="mb-2">
          <label className="me-3">GST Number *</label>
          <input type="radio" name="gst" value="Yes" onChange={handleChange} required disabled={disabledWhile} /> Yes
          <input type="radio" name="gst" value="No" onChange={handleChange} className="ms-3" disabled={disabledWhile} /> No
        </div>

        {/* GOODS */}
        <select className="form-select mb-2" name="goodsType" value={form.goodsType} onChange={handleChange} required disabled={disabledWhile}>
          <option value="">Goods Type *</option>
          <option>Ash</option>
          <option>Ethanol</option>
          <option>Fusel Oil</option>
          <option>Pressmud</option>
          <option>Sugar</option>
        </select>

        <input className="form-control mb-2" name="goodsDemand" placeholder="Goods Demand (1000 Ton / 1000 Liter) *" value={form.goodsDemand} onChange={handleChange} required disabled={disabledWhile} />
        <input className="form-control mb-2" name="saleRate" placeholder="Sale Rate Per Quantity (₹) *" value={form.saleRate} onChange={handleChange} required disabled={disabledWhile} />

        {/* FILE UPLOADS */}
        <label>Passport Size Photo (≤ 1MB) *</label>
        {editData && editData.passport && (
          <div className="mb-2">
            <a href={editData.passport} target="_blank" rel="noreferrer">View existing passport</a>
          </div>
        )}
        <input type="file" className="form-control mb-2" name="passport" onChange={handleFileChange} disabled={disabledWhile} />

        <label>Aadhar Copy (≤ 1MB) *</label>
        {editData && editData.aadhar && (
          <div className="mb-2">
            <a href={editData.aadhar} target="_blank" rel="noreferrer">View existing aadhar</a>
          </div>
        )}
        <input type="file" className="form-control mb-2" name="aadhar" onChange={handleFileChange} disabled={disabledWhile} />

        <label>PAN Copy (≤ 1MB) *</label>
        {editData && editData.pan && (
          <div className="mb-2">
            <a href={editData.pan} target="_blank" rel="noreferrer">View existing PAN</a>
          </div>
        )}
        <input type="file" className="form-control mb-2" name="pan" onChange={handleFileChange} disabled={disabledWhile} />

        <label>GST Certificate (≤ 1MB) *</label>
        {editData && editData.gstCert && (
          <div className="mb-2">
            <a href={editData.gstCert} target="_blank" rel="noreferrer">View existing GST certificate</a>
          </div>
        )}
        <input type="file" className="form-control mb-2" name="gstCert" onChange={handleFileChange} disabled={disabledWhile} />

        <label>License Certificate (≤ 1MB) *</label>
        {editData && editData.licenseCert && (
          <div className="mb-2">
            <a href={editData.licenseCert} target="_blank" rel="noreferrer">View existing license certificate</a>
          </div>
        )}
        <input type="file" className="form-control mb-2" name="licenseCert" onChange={handleFileChange} disabled={disabledWhile} />

        {/* REMARKS */}
        <textarea className="form-control mb-3" name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} disabled={disabledWhile} />

        <button className="btn btn-primary w-100" disabled={disabledWhile}>{submitting ? (statusMessage || "Please wait...") : "Submit Tender"}</button>
      </form>
    </div>
  );
}

export default TenderForm;