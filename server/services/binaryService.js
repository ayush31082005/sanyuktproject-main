const User = require("../models/User");
const BinaryTree = require("../models/BinaryTree");

const getLeftChildId = (user) => user?.leftChildId || user?.left || null;
const getRightChildId = (user) => user?.rightChildId || user?.right || null;

const resolveTotalLeftPV = (user) =>
    Number(user?.totalLeftPV != null ? user.totalLeftPV : user?.leftTeamPV || 0);

const resolveTotalRightPV = (user) =>
    Number(user?.totalRightPV != null ? user.totalRightPV : user?.rightTeamPV || 0);

const resolveUsedLeftPV = (user) => Number(user?.usedLeftPV || 0);
const resolveUsedRightPV = (user) => Number(user?.usedRightPV || 0);

const syncBinaryTreeSnapshot = async ({ user, userId, session = null }) => {
    const resolvedUser =
        user || (userId ? await User.findById(userId).session(session) : null);

    if (!resolvedUser) {
        return null;
    }

    const totalLeftPV = resolveTotalLeftPV(resolvedUser);
    const totalRightPV = resolveTotalRightPV(resolvedUser);
    const availableLeftPV = Math.max(0, totalLeftPV - resolveUsedLeftPV(resolvedUser));
    const availableRightPV = Math.max(0, totalRightPV - resolveUsedRightPV(resolvedUser));

    return BinaryTree.findOneAndUpdate(
        { userId: resolvedUser._id },
        {
            $set: {
                parentId: resolvedUser.parentId || null,
                position: resolvedUser.position || null,
                leftId: getLeftChildId(resolvedUser),
                rightId: getRightChildId(resolvedUser),
                leftPV: totalLeftPV,
                rightPV: totalRightPV,
                matchedPV: Number(resolvedUser.matchedPV || 0),
                leftCarryForward: Number(availableLeftPV.toFixed(2)),
                rightCarryForward: Number(availableRightPV.toFixed(2)),
                leftBV: Number((totalLeftPV * 1000).toFixed(2)),
                rightBV: Number((totalRightPV * 1000).toFixed(2)),
            },
        },
        {
            new: true,
            upsert: true,
            session,
            setDefaultsOnInsert: true,
        }
    );
};

const propagateBinaryVolume = async ({ sourceUserId, pv, bv, session = null }) => {
    const affectedUserIds = [];
    const numericPV = Number(pv || 0);
    const numericBV = Number(bv || 0);

    if (!sourceUserId || numericPV <= 0) {
        return affectedUserIds;
    }

    let childId = sourceUserId;
    let childNode = await User.findById(sourceUserId).select("_id parentId").session(session);
    let parentId = childNode?.parentId || null;

    while (parentId) {
        const parent = await User.findById(parentId).session(session);
        if (!parent) {
            break;
        }

        const leftChildId = getLeftChildId(parent);
        const rightChildId = getRightChildId(parent);

        const isLeft = leftChildId && leftChildId.toString() === childId.toString();
        const isRight = rightChildId && rightChildId.toString() === childId.toString();

        if (isLeft || isRight) {
            const totalField = isLeft ? "totalLeftPV" : "totalRightPV";
            const legacyField = isLeft ? "leftTeamPV" : "rightTeamPV";
            const colorField = isLeft ? "leftColor" : "rightColor";

            parent[totalField] = Number(
                (parent[totalField] != null ? parent[totalField] : parent[legacyField]) || 0
            ) + numericPV;
            parent[legacyField] = Number(parent[legacyField] || 0) + numericPV;
            parent[colorField] = {
                pv: Number(parent[colorField]?.pv || 0) + numericPV,
                bv: Number(parent[colorField]?.bv || 0) + numericBV,
            };

            await parent.save({ session });
            await syncBinaryTreeSnapshot({ user: parent, session });
            affectedUserIds.push(String(parent._id));
        }

        childId = parent._id;
        parentId = parent.parentId;
    }

    return affectedUserIds;
};

module.exports = {
    getLeftChildId,
    getRightChildId,
    resolveTotalLeftPV,
    resolveTotalRightPV,
    resolveUsedLeftPV,
    resolveUsedRightPV,
    syncBinaryTreeSnapshot,
    propagateBinaryVolume,
};
