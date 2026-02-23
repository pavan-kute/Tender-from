const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { uploadBuffer } = require("../config/cloudinary");

// POST /api/users/register
router.post("/register", upload.single("photo"), async (req, res) => {
  try {
    const { fname, mname, lname, mobile, email, password } = req.body;

    if (!fname || !lname || !mobile || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    let photoUrl = null;
    let photoId = null;

    if (req.file && req.file.buffer) {
      try {
        const result = await uploadBuffer(req.file.buffer, req.file.originalname, "users");
        photoUrl = result.secure_url || null;
        photoId = result.public_id || null;
      } catch (err) {
        console.warn("Cloudinary upload failed:", err.message || err);
        // continue without photo
      }
    }

    const fullName = `${fname} ${mname || ""} ${lname}`.trim();

    const user = new User({
      fname,
      mname,
      lname,
      fullName,
      mobile,
      photoUrl,
      photoId,
      email,
      password: hashed,
    });

    await user.save();

    res.status(201).json({ message: "User registered", user: { id: user._id, email: user.email, fullName: user.fullName, photoUrl: user.photoUrl } });
  } catch (err) {
    // handle Mongo duplicate key error (race condition)
    if (err && err.code === 11000) {
      console.warn("Register duplicate key:", err.keyValue);
      return res.status(400).json({ message: "Email already registered" });
    }
    console.error("Register error:", err.message || err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // sign JWT and return basic user info + token
    const jwt = require("jsonwebtoken");
    const secret = process.env.JWT_SECRET || "change_this_secret";
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "7d" });

    res.json({ id: user._id, email: user.email, fullName: user.fullName, photoUrl: user.photoUrl, token });
  } catch (err) {
    console.error("Login error:", err.message || err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
