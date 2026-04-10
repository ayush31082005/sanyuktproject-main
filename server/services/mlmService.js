const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const BinaryTree = require("../models/BinaryTree");

class MlmServiceError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.name = "MlmServiceError";
        this.statusCode = statusCode;
        this.details = details;
    }
}

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const USER_TREE_SELECT = "_id userName memberId sponsorId sponsorName parent parentId position left right leftChildId rightChildId";
const USER_LIST_SELECT = "_id userName memberId sponsorId sponsorName parentId position joinDate createdAt activeStatus packageType rank";
const PACKAGE_DATA = {
    "599": { bv: 250, pv: 0.25, capping: 2000 },
    "1299": { bv: 500, pv: 0.5, capping: 4000 },
    "2699": { bv: 1000, pv: 1, capping: 10000 }
};

const createError = (statusCode, message, details) => new MlmServiceError(statusCode, message, details);

const normalizeMemberId = (value) => String(value || "").trim().toUpperCase();

const normalizePosition = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized === "right" ? "right" : "left";
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const getChildId = (user, side) => {
    if (!user) return null;
    return user[`${side}ChildId`] || user[side] || null;
};

const setChildId = (user, side, childId) => {
    user[side] = childId;
    user[`${side}ChildId`] = childId;
};

const buildIdentifierQuery = (identifier) => {
    const normalized = String(identifier || "").trim();

    if (!normalized) {
        throw createError(400, "User identifier is required.");
    }

    const normalizedMemberId = normalizeMemberId(normalized);

    if (mongoose.Types.ObjectId.isValid(normalized)) {
        return {
            $or: [
                { _id: new mongoose.Types.ObjectId(normalized) },
                { memberId: normalizedMemberId }
            ]
        };
    }

    return { memberId: normalizedMemberId };
};

const applySession = (query, session) => (session ? query.session(session) : query);

async function findUserByIdentifier(identifier, { session, select = USER_TREE_SELECT, lean = false } = {}) {
    const query = applySession(User.findOne(buildIdentifierQuery(identifier)).select(select), session);
    return lean ? query.lean() : query;
}

async function findUserById(userId, { session, select = USER_TREE_SELECT, lean = false } = {}) {
    const query = applySession(User.findById(userId).select(select), session);
    return lean ? query.lean() : query;
}

async function validateSponsorId(sponsorId, { session } = {}) {
    const sponsor = await findUserByIdentifier(sponsorId, {
        session,
        select: "_id userName memberId sponsorId parentId position left right leftChildId rightChildId",
        lean: true
    });

    if (!sponsor) {
        throw createError(404, "Invalid sponsorId. Sponsor not found.");
    }

    return sponsor;
}

async function generateUniqueMemberId(session) {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const memberId = `SPRL${Math.floor(100000 + Math.random() * 900000)}`;
        const existing = await applySession(
            User.exists({ memberId }),
            session
        );

        if (!existing) {
            return memberId;
        }
    }

    throw createError(500, "Unable to generate a unique member ID. Please retry.");
}

async function resolvePlacementForSponsor(sponsorId, { session, preferredPosition } = {}) {
    const sponsor = await validateSponsorId(sponsorId, { session });
    const sponsorLeftChildId = getChildId(sponsor, "left");
    const sponsorRightChildId = getChildId(sponsor, "right");

    if (!sponsorLeftChildId) {
        return {
            sponsor,
            parentId: sponsor._id,
            position: "left"
        };
    }

    if (!sponsorRightChildId) {
        return {
            sponsor,
            parentId: sponsor._id,
            position: "right"
        };
    }

    const orderedSides = normalizePosition(preferredPosition) === "right"
        ? ["right", "left"]
        : ["left", "right"];

    let queue = orderedSides
        .map((side) => getChildId(sponsor, side))
        .filter(Boolean)
        .map((value) => String(value));

    while (queue.length > 0) {
        const currentIds = queue.splice(0, 50);
        const objectIds = currentIds.map((id) => new mongoose.Types.ObjectId(id));
        const users = await applySession(
            User.find({ _id: { $in: objectIds } }).select("_id left right leftChildId rightChildId"),
            session
        ).lean();

        const userMap = new Map(users.map((user) => [String(user._id), user]));

        for (const currentId of currentIds) {
            const currentUser = userMap.get(currentId);
            if (!currentUser) continue;

            const leftChildId = getChildId(currentUser, "left");
            if (!leftChildId) {
                return {
                    sponsor,
                    parentId: currentUser._id,
                    position: "left"
                };
            }

            const rightChildId = getChildId(currentUser, "right");
            if (!rightChildId) {
                return {
                    sponsor,
                    parentId: currentUser._id,
                    position: "right"
                };
            }

            for (const side of orderedSides) {
                const childId = getChildId(currentUser, side);
                if (childId) {
                    queue.push(String(childId));
                }
            }
        }
    }

    throw createError(409, "Unable to find the next available position for this sponsor.");
}

async function syncBinaryTreeRecords({ user, sponsorObjectId, parentId, position, session }) {
    const normalizedPosition = position ? normalizePosition(position) : null;

    await BinaryTree.findOneAndUpdate(
        { userId: user._id },
        {
            $setOnInsert: {
                userId: user._id,
                leftId: null,
                rightId: null
            },
            $set: {
                sponsorId: sponsorObjectId || null,
                parentId: parentId || null,
                position: normalizedPosition
            }
        },
        {
            new: true,
            upsert: true,
            session
        }
    );

    if (!parentId || !normalizedPosition) {
        return;
    }

    const parentTreeUpdate = normalizedPosition === "left"
        ? { leftId: user._id }
        : { rightId: user._id };

    await BinaryTree.findOneAndUpdate(
        { userId: parentId },
        {
            $setOnInsert: {
                userId: parentId
            },
            $set: parentTreeUpdate
        },
        {
            new: true,
            upsert: true,
            session
        }
    );
}

async function ensurePlacementLinked(user, { sponsorObjectId, session } = {}) {
    if (!user?.parentId || !user?.position) {
        await syncBinaryTreeRecords({
            user,
            sponsorObjectId,
            parentId: user?.parentId || null,
            position: user?.position || null,
            session
        });
        return;
    }

    const normalizedPosition = normalizePosition(user.position);
    const parent = await findUserById(user.parentId, {
        session,
        select: "_id left right leftChildId rightChildId"
    });

    if (!parent) {
        throw createError(409, "Parent user not found for the current tree placement.");
    }

    const existingChildId = getChildId(parent, normalizedPosition);
    if (existingChildId && String(existingChildId) !== String(user._id)) {
        throw createError(409, `The ${normalizedPosition} position under the selected parent is already occupied.`);
    }

    if (!existingChildId) {
        setChildId(parent, normalizedPosition, user._id);
        await parent.save({ session });
    }

    await syncBinaryTreeRecords({
        user,
        sponsorObjectId,
        parentId: parent._id,
        position: normalizedPosition,
        session
    });
}

async function registerUserUnderSponsor(payload) {
    const sponsorId = normalizeMemberId(payload?.sponsorId);
    const email = String(payload?.email || "").trim().toLowerCase();
    const password = String(payload?.password || "");

    if (!sponsorId) {
        throw createError(400, "sponsorId is required.");
    }

    if (!email) {
        throw createError(400, "Email is required.");
    }

    if (!password) {
        throw createError(400, "Password is required.");
    }

    if (!PASSWORD_REGEX.test(password)) {
        throw createError(400, "Password must be at least 8 characters and contain at least one letter, one number, and one special symbol.");
    }

    const session = await mongoose.startSession();

    try {
        let result;
        const packageDetails = PACKAGE_DATA[payload?.packageType] || { bv: 0, pv: 0, capping: 0 };

        await session.withTransaction(async () => {
            const sponsor = await validateSponsorId(sponsorId, { session });
            const existingUser = await applySession(
                User.findOne({ email }),
                session
            );

            if (existingUser?.isVerified) {
                throw createError(409, "Email already exists.");
            }

            if (existingUser?.memberId && normalizeMemberId(existingUser.memberId) === sponsor.memberId) {
                throw createError(400, "User cannot be their own sponsor.");
            }

            if (existingUser?.sponsorId && normalizeMemberId(existingUser.sponsorId) && normalizeMemberId(existingUser.sponsorId) !== sponsor.memberId) {
                throw createError(409, "A pending registration already exists for this email. Verify or resend OTP for the existing account.");
            }

            const otp = generateOtp();
            const hashedPassword = await bcrypt.hash(password, 10);

            let user = existingUser;
            let placement = null;

            if (!user) {
                placement = await resolvePlacementForSponsor(sponsor.memberId, {
                    session,
                    preferredPosition: payload?.position
                });

                user = new User({
                    ...payload,
                    email,
                    memberId: await generateUniqueMemberId(session),
                    sponsorId: sponsor.memberId,
                    sponsorName: sponsor.userName,
                    parent: sponsor._id,
                    parentId: placement.parentId,
                    position: placement.position,
                    password: hashedPassword,
                    bv: packageDetails.bv,
                    pv: packageDetails.pv,
                    dailyCapping: packageDetails.capping,
                    otp,
                    otpExpire: Date.now() + 5 * 60 * 1000
                });

                await user.save({ session });
                await ensurePlacementLinked(user, { sponsorObjectId: sponsor._id, session });
            } else {
                if (!user.parentId) {
                    placement = await resolvePlacementForSponsor(sponsor.memberId, {
                        session,
                        preferredPosition: payload?.position
                    });

                    user.parent = sponsor._id;
                    user.parentId = placement.parentId;
                    user.position = placement.position;
                } else {
                    placement = {
                        parentId: user.parentId,
                        position: normalizePosition(user.position)
                    };
                }

                Object.assign(user, {
                    ...payload,
                    email,
                    sponsorId: sponsor.memberId,
                    sponsorName: sponsor.userName,
                    parent: sponsor._id,
                    password: hashedPassword,
                    bv: packageDetails.bv,
                    pv: packageDetails.pv,
                    dailyCapping: packageDetails.capping,
                    otp,
                    otpExpire: Date.now() + 5 * 60 * 1000
                });

                if (!user.memberId) {
                    user.memberId = await generateUniqueMemberId(session);
                }

                await user.save({ session });
                await ensurePlacementLinked(user, { sponsorObjectId: sponsor._id, session });
            }

            result = {
                user,
                sponsor,
                placement: {
                    parentId: placement.parentId,
                    position: placement.position
                },
                otp
            };
        });

        return result;
    } finally {
        await session.endSession();
    }
}

async function ensureUserPlacementConsistency(userId, { session } = {}) {
    const user = await findUserById(userId, {
        session,
        select: USER_TREE_SELECT
    });

    if (!user) {
        throw createError(404, "User not found.");
    }

    let sponsorObjectId = null;
    if (user.sponsorId) {
        const sponsor = await findUserByIdentifier(user.sponsorId, {
            session,
            select: "_id memberId"
        });
        sponsorObjectId = sponsor?._id || null;
    }

    await ensurePlacementLinked(user, { sponsorObjectId, session });
    return user;
}

async function getBinaryTree(userIdentifier) {
    const rootUser = await findUserByIdentifier(userIdentifier, {
        select: "_id userName memberId parentId position left right leftChildId rightChildId",
        lean: true
    });

    if (!rootUser) {
        throw createError(404, "User not found.");
    }

    const descendantsResult = await User.aggregate([
        { $match: { _id: rootUser._id } },
        {
            $graphLookup: {
                from: User.collection.name,
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parentId",
                as: "descendants"
            }
        },
        {
            $project: {
                descendants: {
                    $map: {
                        input: "$descendants",
                        as: "user",
                        in: {
                            _id: "$$user._id",
                            userName: "$$user.userName",
                            memberId: "$$user.memberId",
                            parentId: "$$user.parentId",
                            position: "$$user.position",
                            left: "$$user.left",
                            right: "$$user.right",
                            leftChildId: "$$user.leftChildId",
                            rightChildId: "$$user.rightChildId"
                        }
                    }
                }
            }
        }
    ]);

    const descendants = descendantsResult[0]?.descendants || [];
    const users = [rootUser, ...descendants];
    const userMap = new Map(users.map((user) => [String(user._id), user]));
    const fallbackChildren = new Map();

    for (const user of users) {
        if (!user.parentId) continue;

        const parentKey = String(user.parentId);
        const existing = fallbackChildren.get(parentKey) || { left: null, right: null };
        const position = normalizePosition(user.position);

        if (!existing[position]) {
            existing[position] = user._id;
        }

        fallbackChildren.set(parentKey, existing);
    }

    const visited = new Set();

    const buildNode = (currentId) => {
        if (!currentId) return null;

        const nodeKey = String(currentId);
        if (visited.has(nodeKey)) return null;

        const currentUser = userMap.get(nodeKey);
        if (!currentUser) return null;

        visited.add(nodeKey);

        const inferredChildren = fallbackChildren.get(nodeKey) || {};
        const leftChildId = getChildId(currentUser, "left") || inferredChildren.left || null;
        const rightChildId = getChildId(currentUser, "right") || inferredChildren.right || null;

        return {
            userId: nodeKey,
            name: currentUser.userName || currentUser.memberId || "Unnamed User",
            memberId: currentUser.memberId || null,
            left: buildNode(leftChildId),
            right: buildNode(rightChildId)
        };
    };

    return buildNode(rootUser._id);
}

async function getDirectReferrals(userIdentifier) {
    const user = await findUserByIdentifier(userIdentifier, {
        select: "_id userName memberId",
        lean: true
    });

    if (!user) {
        throw createError(404, "User not found.");
    }

    const directs = await User.find({ sponsorId: user.memberId })
        .select(USER_LIST_SELECT)
        .sort({ createdAt: 1 })
        .lean();

    return directs.map((direct) => ({
        userId: String(direct._id),
        memberId: direct.memberId,
        name: direct.userName || "",
        userName: direct.userName || "",
        sponsorId: direct.sponsorId || null,
        parentId: direct.parentId ? String(direct.parentId) : null,
        position: direct.position ? normalizePosition(direct.position) : null,
        activeStatus: Boolean(direct.activeStatus),
        packageType: direct.packageType || "none",
        rank: direct.rank || "Member",
        joinedAt: direct.joinDate || direct.createdAt || null
    }));
}

async function getTeamMembersByType(userIdentifier, type) {
    const user = await findUserByIdentifier(userIdentifier, {
        select: "_id memberId",
        lean: true
    });

    if (!user) {
        throw createError(404, "User not found.");
    }

    const normalizedType = String(type || "all").trim().toLowerCase();
    const positionFilter = normalizedType === "left"
        ? ["left", "Left"]
        : normalizedType === "right"
            ? ["right", "Right"]
            : ["left", "Left", "right", "Right"];

    const rootNodes = await User.find({
        parentId: user._id,
        position: { $in: positionFilter }
    })
        .select(USER_LIST_SELECT)
        .sort({ createdAt: 1 })
        .lean();

    if (rootNodes.length === 0) {
        return [];
    }

    const team = [];
    const queue = rootNodes.map((member) => member);
    const visited = new Set();

    while (queue.length > 0) {
        const currentBatch = queue.splice(0, 50);
        const currentIds = currentBatch.map((member) => member._id);

        for (const member of currentBatch) {
            const memberKey = String(member._id);
            if (visited.has(memberKey)) continue;
            visited.add(memberKey);
            team.push({
                userId: memberKey,
                memberId: member.memberId,
                name: member.userName || "",
                userName: member.userName || "",
                sponsorId: member.sponsorId || null,
                parentId: member.parentId ? String(member.parentId) : null,
                position: member.position ? normalizePosition(member.position) : null,
                activeStatus: Boolean(member.activeStatus),
                packageType: member.packageType || "none",
                rank: member.rank || "Member",
                joinedAt: member.joinDate || member.createdAt || null
            });
        }

        const children = await User.find({ parentId: { $in: currentIds } })
            .select(USER_LIST_SELECT)
            .sort({ createdAt: 1 })
            .lean();

        for (const child of children) {
            if (!visited.has(String(child._id))) {
                queue.push(child);
            }
        }
    }

    return team;
}

module.exports = {
    MlmServiceError,
    USER_LIST_SELECT,
    USER_TREE_SELECT,
    ensureUserPlacementConsistency,
    findUserByIdentifier,
    getBinaryTree,
    getDirectReferrals,
    getTeamMembersByType,
    normalizeMemberId,
    normalizePosition,
    registerUserUnderSponsor,
    resolvePlacementForSponsor,
    validateSponsorId
};
