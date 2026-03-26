import { useState } from "react";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    if (submitting) return;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.token) {
      alert("You must be logged in to submit or edit a tender.");
      navigate("/login");
      return;
    }

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

    for (const key of requiredFields) {
      if (!form[key]) {
        alert("All * marked fields are required");
        return;
      }
    }

    const fileKeys = ["passport", "aadhar", "pan", "gstCert", "licenseCert"];
    for (const key of fileKeys) {
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
      setTimeout(() => {
        setSubmitting(false);
        setStatusMessage("");
        navigate("/report");
      }, 800);
    } catch (err) {
      console.error(err);
      setStatusMessage(err.message || "Failed to submit tender.");
      setSubmitting(false);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const isAuthed = !!(JSON.parse(localStorage.getItem("user") || "null")?.token);
  const disabledWhile = !isAuthed || submitting;

  return (
    <section className="page-panel">
      <div className="page-header text-center">
        <span className="page-kicker">Tender Workflow</span>
        <h1 className="page-title">Tender Filling Form</h1>
      </div>

      {!isAuthed && <div className="alert alert-warning">Please login to fill or edit tender forms.</div>}

      <form className="form-card form-stack" onSubmit={handleSubmit}>
        <div className="section-card">
          <h2 className="section-title">Business Details</h2>

          <div className="form-grid form-grid--two">
            <select className="form-select select-strong" name="type" value={form.type} onChange={handleChange} required disabled={disabledWhile}>
              <option value="">Type *</option>
              <option>Broker</option>
              <option>Purchaser</option>
              <option>Wholesaler</option>
            </select>
            <input className="form-control input-strong" name="fullName" placeholder="Full Name *" value={form.fullName} onChange={handleChange} required disabled={disabledWhile} />
          </div>

          <textarea className="form-control textarea-strong mt-3" name="address" placeholder="Address *" value={form.address} onChange={handleChange} required disabled={disabledWhile} />

          <div className="form-grid form-grid--two mt-3">
            <input className="form-control input-strong" name="city" placeholder="City / Village / Taluka *" value={form.city} onChange={handleChange} required disabled={disabledWhile} />
            <input className="form-control input-strong" name="district" placeholder="District *" value={form.district} onChange={handleChange} required disabled={disabledWhile} />
            <input className="form-control input-strong" name="state" placeholder="State *" value={form.state} onChange={handleChange} required disabled={disabledWhile} />
            <input className="form-control input-strong" name="pincode" placeholder="Pincode *" value={form.pincode} onChange={handleChange} required disabled={disabledWhile} />
            <input className="form-control input-strong" name="mobile" placeholder="Mobile Number *" value={form.mobile} onChange={handleChange} required disabled={disabledWhile} />
            <input className="form-control input-strong" type="email" name="email" placeholder="Email ID *" value={form.email} onChange={handleChange} required disabled={disabledWhile} />
          </div>
        </div>

        <div className="section-card">
          <h2 className="section-title">Compliance and Goods</h2>

          <div className="mb-3">
            <span className="inline-label">License Number *</span>
            <div className="choice-row">
              <label className="choice-pill">
                <input type="radio" name="license" value="Yes" checked={form.license === "Yes"} onChange={handleChange} required disabled={disabledWhile} />
                <span>Yes</span>
              </label>
              <label className="choice-pill">
                <input type="radio" name="license" value="No" checked={form.license === "No"} onChange={handleChange} disabled={disabledWhile} />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="mb-3">
            <span className="inline-label">GST Number *</span>
            <div className="choice-row">
              <label className="choice-pill">
                <input type="radio" name="gst" value="Yes" checked={form.gst === "Yes"} onChange={handleChange} required disabled={disabledWhile} />
                <span>Yes</span>
              </label>
              <label className="choice-pill">
                <input type="radio" name="gst" value="No" checked={form.gst === "No"} onChange={handleChange} disabled={disabledWhile} />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="form-grid form-grid--two">
            <select className="form-select select-strong" name="goodsType" value={form.goodsType} onChange={handleChange} required disabled={disabledWhile}>
              <option value="">Goods Type *</option>
              <option>Ash</option>
              <option>Ethanol</option>
              <option>Fusel Oil</option>
              <option>Pressmud</option>
              <option>Sugar</option>
            </select>
            <input className="form-control input-strong" name="goodsDemand" placeholder="Goods Demand (1000 Ton / 1000 Liter) *" value={form.goodsDemand} onChange={handleChange} required disabled={disabledWhile} />
          </div>

          <input className="form-control input-strong mt-3" name="saleRate" placeholder="Sale Rate Per Quantity (INR) *" value={form.saleRate} onChange={handleChange} required disabled={disabledWhile} />
        </div>

        <div className="section-card">
          <h2 className="section-title">Document Uploads</h2>

          <div className="form-grid form-grid--two">
            <div>
              <label className="field-label">Passport Size Photo *</label>
              <p className="file-note">Maximum file size 1 MB.</p>
              {editData && editData.passport && (
                <a className="existing-link" href={editData.passport} target="_blank" rel="noreferrer">View existing passport</a>
              )}
              <input type="file" className="form-control input-strong" name="passport" onChange={handleFileChange} disabled={disabledWhile} />
            </div>

            <div>
              <label className="field-label">Aadhar Copy *</label>
              <p className="file-note">Maximum file size 1 MB.</p>
              {editData && editData.aadhar && (
                <a className="existing-link" href={editData.aadhar} target="_blank" rel="noreferrer">View existing aadhar</a>
              )}
              <input type="file" className="form-control input-strong" name="aadhar" onChange={handleFileChange} disabled={disabledWhile} />
            </div>

            <div>
              <label className="field-label">PAN Copy *</label>
              <p className="file-note">Maximum file size 1 MB.</p>
              {editData && editData.pan && (
                <a className="existing-link" href={editData.pan} target="_blank" rel="noreferrer">View existing PAN</a>
              )}
              <input type="file" className="form-control input-strong" name="pan" onChange={handleFileChange} disabled={disabledWhile} />
            </div>

            <div>
              <label className="field-label">GST Certificate *</label>
              <p className="file-note">Maximum file size 1 MB.</p>
              {editData && editData.gstCert && (
                <a className="existing-link" href={editData.gstCert} target="_blank" rel="noreferrer">View existing GST certificate</a>
              )}
              <input type="file" className="form-control input-strong" name="gstCert" onChange={handleFileChange} disabled={disabledWhile} />
            </div>

            <div>
              <label className="field-label">License Certificate *</label>
              <p className="file-note">Maximum file size 1 MB.</p>
              {editData && editData.licenseCert && (
                <a className="existing-link" href={editData.licenseCert} target="_blank" rel="noreferrer">View existing license certificate</a>
              )}
              <input type="file" className="form-control input-strong" name="licenseCert" onChange={handleFileChange} disabled={disabledWhile} />
            </div>
          </div>
        </div>

        <div className="section-card">
          <h2 className="section-title">Additional Notes</h2>
          <textarea className="form-control textarea-strong" name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} disabled={disabledWhile} />
        </div>

        <button className="app-btn app-btn--primary w-100" disabled={disabledWhile}>
          {submitting ? (statusMessage || "Please wait...") : "Submit Tender"}
        </button>
      </form>
    </section>
  );
}

export default TenderForm;
