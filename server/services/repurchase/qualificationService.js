const User = require("../../models/User");

const normalizeRank = (value) => String(value || "").trim().toLowerCase();

const isActiveUser = (user) => Boolean(user?.activeStatus);

const isDiamondQualified = (user) => isActiveUser(user) && normalizeRank(user?.rank) === "diamond";

const resolveDirectSponsorUser = async (buyer, { session = null } = {}) => {
    if (!buyer) {
        return null;
    }

    if (buyer.parent) {
        const sponsorByParent = await User.findById(buyer.parent).session(session);
        if (sponsorByParent) {
            return sponsorByParent;
        }
    }

    if (!buyer.sponsorId) {
        return null;
    }

    return User.findOne({ memberId: String(buyer.sponsorId).trim().toUpperCase() }).session(session);
};

const getSponsorChain = async (buyer, { session = null, limit = 20 } = {}) => {
    const chain = [];
    let currentParentId = buyer?.parent || null;

    while (currentParentId && chain.length < limit) {
        const sponsor = await User.findById(currentParentId).session(session);
        if (!sponsor) {
            break;
        }

        chain.push(sponsor);
        currentParentId = sponsor.parent || null;
    }

    return chain;
};

module.exports = {
    normalizeRank,
    isActiveUser,
    isDiamondQualified,
    resolveDirectSponsorUser,
    getSponsorChain,
};
