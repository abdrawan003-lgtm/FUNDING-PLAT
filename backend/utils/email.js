import nodemailer from "nodemailer";

export const sendVerificationEmail = async ({ to, token, username }) => {
  if (!to) {
    throw new Error("No recipient email provided");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verifyUrl = `http://localhost:5005/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"GetChance" <${process.env.EMAIL_USER}>`,
    to: to, // ✅ هون المهم
    subject: "Verify your email",
    html: `
      <h2>Hello ${username}</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};
