const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      text,
      html,
    });

    if (error) {
      throw new Error(error.message || "Resend returned an error");
    }

    console.log("Email sent:", data);
    return data;

  } catch (error) {
    console.error("Email error:", error?.message || error);
    throw error;
  }
};

module.exports = sendEmail;
