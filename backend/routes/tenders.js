const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadBuffer, configure, destroyPublicId } = require("../config/cloudinary");
const auth = require("../middleware/auth");

const Tender = require("../models/Tender");

configure();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Accept files for known field names
const cpUpload = upload.fields([
  { name: "passport", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "gstCert", maxCount: 1 },
  { name: "licenseCert", maxCount: 1 },
]);

// GET /api/tenders
router.get("/", async (req, res) => {
  try {
    const tenders = await Tender.find().sort({ createdAt: -1 });
    res.json(tenders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tenders (protected)
router.post("/", auth, cpUpload, async (req, res) => {
  try {
    const body = req.body || {};
    const fileFields = req.files || {};

    const record = { ...body };

    // upload each file if present and store secure_url + public_id
    const fileKeys = ["passport", "aadhar", "pan", "gstCert", "licenseCert"];
    for (const key of fileKeys) {
      if (fileFields[key] && fileFields[key][0]) {
        const file = fileFields[key][0];
        const result = await uploadBuffer(file.buffer, file.originalname);
        if (result) {
          record[key] = result.secure_url;
          record[`${key}Id`] = result.public_id;
        }
      }
    }

    const tender = new Tender(record);
    await tender.save();
    res.status(201).json(tender);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tenders/:id (protected)
router.put("/:id", auth, cpUpload, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const fileFields = req.files || {};

    const tender = await Tender.findById(id);
    if (!tender) return res.status(404).json({ message: "Not found" });

    // update simple fields
    Object.keys(body).forEach((k) => {
      tender[k] = body[k];
    });

    // upload new files if provided and replace urls; delete old files when replaced
    const fileKeys = ["passport", "aadhar", "pan", "gstCert", "licenseCert"];
    for (const key of fileKeys) {
      if (fileFields[key] && fileFields[key][0]) {
        const file = fileFields[key][0];
        const result = await uploadBuffer(file.buffer, file.originalname);
        if (result) {
          const oldId = tender[`${key}Id`];
          tender[key] = result.secure_url;
          tender[`${key}Id`] = result.public_id;
          // delete old asset (best-effort)
          if (oldId && oldId !== result.public_id) {
            try {
              await destroyPublicId(oldId);
            } catch (e) {
              console.warn("Failed to delete old Cloudinary asset", oldId, e.message || e);
            }
          }
        }
      }
    }

    await tender.save();
    res.json(tender);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tenders/:id (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    console.log("DELETE /api/tenders/ called with id:", id);

    const tender = await Tender.findById(id);
    if (!tender) return res.status(404).json({ message: "Not found" });

    // prepare cloudinary deletion promises (best-effort). do not block DB deletion on failures
    const fileIdKeys = ["passportId", "aadharId", "panId", "gstCertId", "licenseCertId"];
    const deletePromises = [];
    for (const idKey of fileIdKeys) {
      const publicId = tender[idKey];
      if (publicId) {
        deletePromises.push(
          destroyPublicId(publicId).catch((e) => {
            console.warn("Failed to delete Cloudinary asset on tender delete", publicId, e && e.message ? e.message : e);
            return null;
          })
        );
      }
    }

    // delete DB record first
    const deleted = await Tender.findByIdAndDelete(id);

    // attempt Cloudinary deletion in background but await so we log any issues
    try {
      await Promise.all(deletePromises);
    } catch (e) {
      console.warn("One or more Cloudinary deletions failed during tender delete", e && e.message ? e.message : e);
    }

    res.json({ message: "Deleted", deleted: !!deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
