const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());

// body parser for JSON (non-file requests)
app.use(express.json());

// connect DB
connectDB();

// configure cloudinary (for file uploads)
const { configure: configureCloudinary } = require("./config/cloudinary");
configureCloudinary();

// routes
app.use("/api/tenders", require("./routes/tenders"));
app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
