const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/sendEmail");
const { distributeLevelIncome, distributeDirectIncome, updateTeamPV } = require("../utils/mlmUtils");
const {
    MlmServiceError,
    ensureUserPlacementConsistency,
    findUserByIdentifier,
    registerUserUnderSponsor,
    validateSponsorId
} = require("../services/mlmService");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const handleServiceError = (res, error, fallbackMessage) => {
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
        message: "Server Error"
    });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
    try {
        const { user, otp } = await registerUserUnderSponsor(req.body);

        console.log(`[AUTH] User saved, sending OTP to ${user.email}`);

        try {
            await sendEmail(user.email, "Registration OTP", `Your OTP is ${otp}`);
        } catch (err) {
            console.error("[AUTH] Registration OTP Email Failed:", err.message);
            return res.status(502).json({
                success: false,
                message: `OTP could not be sent: ${err.message}`
            });
        }

        return res.json({
            success: true,
            message: "OTP Sent to Email. Please check your inbox (and spam folder)."
        });
    } catch (error) {
        return handleServiceError(res, error, "Registration error:");
    }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        user.activeStatus = true;
        await user.save();

        if (user.parentId) {
            await ensureUserPlacementConsistency(user._id);
            await distributeDirectIncome(user);
            await distributeLevelIncome(user);
            await updateTeamPV(user);
        } else {
            await ensureUserPlacementConsistency(user._id);
        }

        const refreshedUser = await User.findById(user._id);

        const welcomeSubject = "Welcome to Sanyukt Parivaar";
        const welcomeText = `Dear ${refreshedUser.userName || "Member"},\n\nCongratulations! Your account has been successfully verified.\n\nYour Member ID: ${refreshedUser.memberId}\nRegistered Phone: ${refreshedUser.mobile}\n\nYou can now log in to your dashboard and explore our services.\n\nThank you for joining Sanyukt Parivaar!`;
        sendEmail(refreshedUser.email, welcomeSubject, welcomeText).catch((err) => {
            console.error("Welcome Email Error:", err);
        });

        return res.json({ message: "Account Verified Successfully" });
    } catch (error) {
        return handleServiceError(res, error, "verifyOtp error:");
    }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user;
        if (email.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findOne({ $or: [{ email }, { _id: email }] });
        } else if (email.toUpperCase().startsWith("SPRL") || email.toUpperCase().startsWith("SP")) {
            user = await User.findOne({ memberId: email.toUpperCase() });
        } else {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Verify Email First" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Wrong Password" });
        }

        const secret = process.env.JWT_SECRET || "your-secret-key";
        console.log("Signing token with secret (prefix):", secret.substring(0, 5));

        const token = jwt.sign(
            { id: user._id, role: user.role },
            secret,
            { expiresIn: "24h" }
        );

        console.log("Login SUCCESS for user:", user._id);

        const loginSubject = "Login Notification - Sanyukt Parivaar";
        const loginText = `Dear ${user.userName || "Member"},\n\nYou have successfully logged into your Sanyukt Parivaar account on ${new Date().toLocaleString()}.\n\nIf this was not you, please contact support immediately.\n\nThank you for being part of our family!`;
        sendEmail(user.email, loginSubject, loginText).catch((err) => {
            console.error("[AUTH] Login notification scan failure:", err.message);
            console.error("[AUTH] User Email intended:", user.email);
        });

        return res.json({
            message: "Login Success",
            token,
            user
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;

        await user.save();

        console.log(`[AUTH] Password reset OTP generated for ${normalizedEmail}`);
        try {
            await sendEmail(normalizedEmail, "Reset Password OTP", `Your OTP is ${otp}`);
        } catch (err) {
            console.error("[AUTH] Forgot Password OTP Email Failed:", err.message);
            return res.status(502).json({
                success: false,
                message: `OTP could not be sent: ${err.message}`
            });
        }

        return res.json({
            success: true,
            message: "OTP Sent for Reset. Please check your email."
        });
    } catch (error) {
        console.error(`[AUTH ERROR] Forgot password: ${error.message}`, error.stack);

        if (error.message.includes("login") || error.message.includes("auth")) {
            return res.status(500).json({ message: "Email service authentication failed. Please check server configuration." });
        }

        return res.status(500).json({ message: "Server Error. Please try again later." });
    }
};

// ================= PUBLIC PROFILE =================
exports.publicProfile = async (req, res) => {
    try {
        const user = await findUserByIdentifier(req.params.id, {
            select: "userName memberId",
            lean: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user });
    } catch (error) {
        return handleServiceError(res, error, "publicProfile error:");
    }
};

// ================= RESEND OTP =================
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        const otp = generateOTP();

        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;

        await user.save();
        await sendEmail(normalizedEmail, "Resend OTP", `Your new OTP is ${otp}`);

        return res.json({ message: "New OTP Sent Successfully" });
    } catch (error) {
        console.error("[AUTH] Resend OTP Failed:", error.message);
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        console.log(`Attempting password reset for: ${email}`);

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: "Password must be at least 8 characters and contain at least one letter, one number, and one special symbol" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();
        console.log(`[AUTH DEBUG] Password reset successful for ${normalizedEmail}. New hash starts with: ${hashedPassword.substring(0, 10)}`);

        return res.json({ message: "Password Reset Successful" });
    } catch (error) {
        console.error(`[AUTH ERROR] Password reset for ${req.body.email}: ${error.message}`);
        console.error("Error in resetPassword:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// ================= CREATE ADMIN =================
exports.createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new User({
            email,
            password: hashedPassword,
            role: "admin",
            isVerified: true
        });

        await admin.save();

        return res.json({ message: "Admin Created Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

// ================= PROFILE =================
exports.profile = async (req, res) => {
    try {
        const user = req.user;

        if (!user.memberId) {
            let newMemberId = `SPRL${Math.floor(100000 + Math.random() * 900000)}`;
            while (await User.findOne({ memberId: newMemberId })) {
                newMemberId = `SPRL${Math.floor(100000 + Math.random() * 900000)}`;
            }
            user.memberId = newMemberId;
            await user.save();
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "userName", "fatherName", "mobile", "gender", "position", "dob", "qualification",
            "shippingAddress", "state", "district", "assemblyArea",
            "block", "villageCouncil", "village", "profileImage", "bankDetails"
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: false }
        ).select("-password -otp -otpExpire");

        return res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ================= SUBMIT KYC =================
exports.submitKyc = async (req, res) => {
    try {
        const { aadharNumber, panNumber, nominee, bankDetails, kycDocuments } = req.body;

        if (
            !aadharNumber ||
            !panNumber ||
            !bankDetails?.accountNumber ||
            !bankDetails?.ifscCode ||
            !bankDetails?.bankName ||
            !bankDetails?.accountType ||
            !(bankDetails?.panNumber || bankDetails?.apnNumber) ||
            !nominee?.name ||
            !nominee?.relation ||
            !nominee?.dob ||
            !nominee?.address ||
            !nominee?.state ||
            !nominee?.city
        ) {
            return res.status(400).json({
                message: "Aadhar, PAN, nominee details, and complete bank information are required"
            });
        }

        const updates = {
            kycStatus: "Submitted",
            aadharNumber,
            panNumber,
            nominee,
            bankDetails,
            kycDocuments
        };

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: false }
        ).select("-password -otp -otpExpire");

        return res.json({ message: "KYC submitted successfully", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ================= GET SPONSOR NAME =================
exports.getSponsorName = async (req, res) => {
    try {
        const sponsor = await validateSponsorId(req.params.id);
        return res.json({ name: sponsor.userName || "" });
    } catch (error) {
        return handleServiceError(res, error, "getSponsorName error:");
    }
};
