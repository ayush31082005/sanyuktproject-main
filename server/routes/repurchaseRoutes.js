const express = require("express");
const router = express.Router();
const {
    getSelfRepurchaseIncome,
    getRepurchaseLevelIncome,
    getIncomeReport,
    getSponsorIncomeReport,
    getRoyaltyBonusReport,
    getHouseFundReport,
    getLeadershipFundReport,
    getCarFundReport,
    getTravelFundReport,
    getBikeFundReport,
    processPoolClosing,
    getPoolClosingList,
    placeRepurchaseOrder,
} = require("../controllers/repurchaseController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET /api/repurchase/level-income
router.get("/self-income", protect, getSelfRepurchaseIncome);
router.get("/level-income", protect, getRepurchaseLevelIncome);
router.get("/sponsor-income", protect, getSponsorIncomeReport);
router.get("/royalty-bonus", protect, getRoyaltyBonusReport);
router.get("/house-fund", protect, getHouseFundReport);
router.get("/leadership-fund", protect, getLeadershipFundReport);
router.get("/car-fund", protect, getCarFundReport);
router.get("/travel-fund", protect, getTravelFundReport);
router.get("/bike-fund", protect, getBikeFundReport);
router.get("/report/:incomeType", protect, getIncomeReport);
router.post("/place", protect, placeRepurchaseOrder);
router.post("/pool/close", protect, adminOnly, processPoolClosing);
router.get("/pool/closings", protect, adminOnly, getPoolClosingList);

module.exports = router;
