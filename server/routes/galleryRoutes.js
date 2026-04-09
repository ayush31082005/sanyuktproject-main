const express = require("express");
const router = express.Router();
const { getAllImages, addImage, deleteImage, updateImage, getGallery } = require("../controllers/galleryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: "uploads/gallery",
    filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname) }
});
const upload = multer({ storage });

router.get("/all", getAllImages);
router.post("/add", protect, adminOnly, upload.single("image"), addImage);
router.delete("/:id", protect, adminOnly, deleteImage);
// Adding aliases and extra routes for compatibility
router.delete("/delete/:id", protect, adminOnly, deleteImage);
router.put("/update/:id", protect, adminOnly, upload.single("image"), updateImage);

module.exports = router;
