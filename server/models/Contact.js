const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        enquiryType: { type: String, default: "Product Enquiry" },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);