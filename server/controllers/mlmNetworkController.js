const sendEmail = require("../utils/sendEmail");
const {
    MlmServiceError,
    findUserByIdentifier,
    getBinaryTree,
    getDirectReferrals,
    registerUserUnderSponsor,
    validateSponsorId
} = require("../services/mlmService");

const isAdminOrSelf = async (requestUser, targetUserId) => {
    if (!requestUser) return false;
    if (requestUser.role === "admin") return true;

    const targetUser = await findUserByIdentifier(targetUserId, {
        select: "_id memberId",
        lean: true
    });

    if (!targetUser) {
        throw new MlmServiceError(404, "User not found.");
    }

    return String(targetUser._id) === String(requestUser._id);
};

const handleError = (res, error, fallbackMessage) => {
    if (error instanceof MlmServiceError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            details: error.details
        });
    }

    console.error(fallbackMessage, error);
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

exports.register = async (req, res) => {
    try {
        const { user, sponsor, placement, otp } = await registerUserUnderSponsor(req.body);

        try {
            await sendEmail(user.email, "Registration OTP", `Your OTP is ${otp}`);
        } catch (emailError) {
            console.error("[MLM] Registration OTP email failed:", emailError.message);
            return res.status(502).json({
                success: false,
                message: `User registered and placed successfully, but OTP email could not be sent: ${emailError.message}`,
                data: {
                    userId: String(user._id),
                    memberId: user.memberId,
                    sponsorId: sponsor.memberId,
                    parentId: placement.parentId ? String(placement.parentId) : null,
                    position: placement.position
                }
            });
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful. OTP sent to email.",
            data: {
                userId: String(user._id),
                memberId: user.memberId,
                sponsorId: sponsor.memberId,
                sponsorName: sponsor.userName || "",
                parentId: placement.parentId ? String(placement.parentId) : null,
                position: placement.position
            }
        });
    } catch (error) {
        return handleError(res, error, "[MLM] Registration failed");
    }
};

exports.validateSponsor = async (req, res) => {
    try {
        const sponsor = await validateSponsorId(req.params.sponsorId);

        return res.json({
            success: true,
            valid: true,
            sponsor: {
                userId: String(sponsor._id),
                memberId: sponsor.memberId,
                name: sponsor.userName || ""
            }
        });
    } catch (error) {
        if (error instanceof MlmServiceError && error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                valid: false,
                message: error.message
            });
        }

        return handleError(res, error, "[MLM] Sponsor validation failed");
    }
};

exports.getTree = async (req, res) => {
    try {
        const allowed = await isAdminOrSelf(req.user, req.params.userId);
        if (!allowed) {
            return res.status(403).json({
                success: false,
                message: "You can only view your own tree."
            });
        }

        const tree = await getBinaryTree(req.params.userId);
        return res.json(tree);
    } catch (error) {
        return handleError(res, error, "[MLM] Tree fetch failed");
    }
};

exports.getDirects = async (req, res) => {
    try {
        const allowed = await isAdminOrSelf(req.user, req.params.userId);
        if (!allowed) {
            return res.status(403).json({
                success: false,
                message: "You can only view your own direct referrals."
            });
        }

        const directs = await getDirectReferrals(req.params.userId);
        return res.json({
            success: true,
            count: directs.length,
            directs
        });
    } catch (error) {
        return handleError(res, error, "[MLM] Direct referral fetch failed");
    }
};
