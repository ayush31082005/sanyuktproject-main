const express = require("express");
const router = express.Router();
const {
    getSelfRepurchaseIncome,
    getRepurchaseLevelIncome,
    placeRepurchaseOrder,
} = require("../controllers/repurchaseController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/repurchase/level-income
router.get("/self-income", protect, getSelfRepurchaseIncome);
router.get("/level-income", protect, getRepurchaseLevelIncome);
router.post("/place", protect, placeRepurchaseOrder);

module.exports = router;
