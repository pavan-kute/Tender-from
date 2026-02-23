const mongoose = require("mongoose");

const TenderSchema = new mongoose.Schema(
  {
    type: String,
    fullName: String,
    address: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
    mobile: String,
    email: String,
    license: String,
    gst: String,
    goodsType: String,
    goodsDemand: String,
    saleRate: String,
    passport: String,
    passportId: String,
    aadhar: String,
    aadharId: String,
    pan: String,
    panId: String,
    gstCert: String,
    gstCertId: String,
    licenseCert: String,
    licenseCertId: String,
    remarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tender", TenderSchema);
