const REPURCHASE_WALLET_TYPE = "generation-wallet";
const ENABLE_SELF_REPURCHASE_INCOME = true;
const SELF_INCOME_PERCENT = 5;

const REPURCHASE_INCOME_TYPES = Object.freeze([
    "self_repurchase",
    "repurchase_level",
    "sponsor_income",
    "royalty_bonus",
    "house_fund",
    "leadership_fund",
    "car_fund",
    "travel_fund",
    "bike_fund",
]);

const REPURCHASE_FUND_TYPES = Object.freeze([
    "royalty_bonus",
    "house_fund",
    "leadership_fund",
    "car_fund",
    "travel_fund",
    "bike_fund",
]);

const REPURCHASE_LEVEL_CONFIG = Object.freeze([
    { level: 1, mode: "percent", value: 15 },
    { level: 2, mode: "percent", value: 10 },
    { level: 3, mode: "percent", value: 5 },
    { level: 4, mode: "percent", value: 2.5 },
    { level: 5, mode: "percent", value: 2.5 },
    { level: 6, mode: "percent", value: 2.5 },
    { level: 7, mode: "percent", value: 2.5 },
    { level: 8, mode: "percent", value: 1.25 },
    { level: 9, mode: "percent", value: 1.25 },
    { level: 10, mode: "percent", value: 1.25 },
    { level: 11, mode: "percent", value: 1.25 },
    { level: 12, mode: "percent", value: 1.25 },
    { level: 13, mode: "percent", value: 0.75 },
    { level: 14, mode: "percent", value: 0.75 },
    { level: 15, mode: "percent", value: 0.75 },
    { level: 16, mode: "percent", value: 0.75 },
    { level: 17, mode: "percent", value: 0.75 },
    { level: 18, mode: "percent", value: 0.75 },
    { level: 19, mode: "percent", value: 0.75 },
    { level: 20, mode: "percent", value: 0.75 },
]);

const FUND_SPLIT_RATIO = Object.freeze(
    REPURCHASE_FUND_TYPES.reduce((acc, incomeType) => {
        acc[incomeType] = 1;
        return acc;
    }, {})
);

const REPURCHASE_BONUS_CONFIG = Object.freeze({
    enableSelfRepurchaseIncome: ENABLE_SELF_REPURCHASE_INCOME,
    selfIncomePercent: SELF_INCOME_PERCENT,
    selfRepurchase: {
        enabled: ENABLE_SELF_REPURCHASE_INCOME,
        incomeType: "self_repurchase",
        base: "bv",
        mode: "percent",
        value: SELF_INCOME_PERCENT,
    },
    sponsorIncome: {
        enabled: true,
        incomeType: "sponsor_income",
        base: "bv",
        mode: "percent",
        value: 10,
    },
    repurchaseLevel: REPURCHASE_LEVEL_CONFIG,
    pool: {
        percent: 4,
        supportedPeriods: ["weekly", "monthly"],
        fundSplitRatio: FUND_SPLIT_RATIO,
    },
});

const QUALIFYING_REPURCHASE_ORDER_STATUSES = Object.freeze([
    "paid",
    "processing",
    "shipped",
    "reached_store",
    "out_for_delivery",
    "delivered",
]);

module.exports = {
    REPURCHASE_WALLET_TYPE,
    REPURCHASE_INCOME_TYPES,
    REPURCHASE_FUND_TYPES,
    REPURCHASE_LEVEL_CONFIG,
    REPURCHASE_BONUS_CONFIG,
    QUALIFYING_REPURCHASE_ORDER_STATUSES,
};
