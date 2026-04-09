const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// ================= SEND MESSAGE =================
exports.sendMessage = async (req, res) => {
    try {
        const { name, email, phone, enquiryType, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({ message: "Name and message are required" });
        }

        const contact = new Contact({
            name,
            email,
            phone,
            enquiryType,
            message,
        });

        await contact.save();

        // Send Email Notification
        const subject = `New Contact Inquiry from ${name}`;
        const text = `
            New inquiry received:
            Name: ${name}
            Email: ${email || 'N/A'}
            Phone: ${phone || 'N/A'}
            Enquiry Type: ${enquiryType || 'N/A'}
            Message: ${message}
        `;
        
        // Notify admin
        await sendEmail(process.env.EMAIL_USER, subject, text).catch(err => console.error("Admin Contact Email Error:", err));

        // Notify User (Thank You Email)
        const userSubject = "We Received Your Message - Sanyukt Parivaar";
        const userText = `Dear ${name},\n\nThank you for reaching out to Sanyukt Parivaar. We have received your inquiry regarding "${enquiryType || 'General Inquiry'}" and our team will get back to you shortly.\n\nYour Message:\n"${message}"\n\nThank you for being with us!\nSanyukt Parivaar Team`;
        
        if (email) {
            sendEmail(email, userSubject, userText).catch(err => console.error("User Contact Email Error:", err));
        }

        res.status(201).json({ success: true, message: "Message sent successfully!" });

    } catch (error) {
        console.error("Contact Form Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// ================= GET ALL MESSAGES (Admin) =================
exports.getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};