import dns from "node:dns";
import nodemailer from "nodemailer";

// ====================================
// Force IPv4 DNS Resolution
// ====================================
//
// Render is unable to reach Gmail SMTP
// over IPv6, so make Node prefer IPv4.
//

dns.setDefaultResultOrder("ipv4first");

// ====================================
// Gmail SMTP Transporter
// ====================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(
    process.env.SMTP_PORT
  ),

  secure:
    process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,

    pass: process.env.SMTP_PASS,
  },
});

// ====================================
// Verify SMTP Configuration
// ====================================

transporter.verify((error) => {
  if (error) {
    console.error(
      "❌ SMTP configuration error:",
      error
    );
  } else {
    console.log(
      "✅ Gmail SMTP server is ready"
    );
  }
});

// ====================================
// Send Email Helper
// ====================================

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const info =
      await transporter.sendMail({
        from: `"DevPulse" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

    console.log(
      "📧 Email sent:",
      info.messageId
    );

    return info;
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error
    );

    throw error;
  }
};

// ====================================
// Send Email Verification Email
// ====================================

export const sendVerificationEmail =
  async ({
    email,
    fullName,
    verificationToken,
  }) => {
    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    return sendEmail({
      to: email,

      subject:
        "Verify your DevPulse email",

      html: `
        <!DOCTYPE html>
        <html>
          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                padding: 32px;
                background: #ffffff;
                border-radius: 12px;
              "
            >
              <h1 style="color: #111827;">
                Welcome to DevPulse 👋
              </h1>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                "
              >
                Hi ${fullName},
              </p>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Thanks for creating your DevPulse
                account. Please verify your email
                address to activate your account.
              </p>

              <div style="margin: 32px 0;">
                <a
                  href="${verificationUrl}"
                  style="
                    display: inline-block;
                    padding: 12px 24px;
                    background: #7c3aed;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                "
              >
                This verification link will expire
                in 24 hours.
              </p>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                "
              >
                If you did not create a DevPulse
                account, you can safely ignore this
                email.
              </p>

              <hr
                style="
                  margin: 32px 0;
                  border: none;
                  border-top: 1px solid #e5e7eb;
                "
              />

              <p
                style="
                  color: #9ca3af;
                  font-size: 12px;
                "
              >
                © ${new Date().getFullYear()}
                DevPulse. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  };

// ====================================
// Send Password Reset Email
// ====================================

export const sendPasswordResetEmail =
  async ({
    email,
    fullName,
    resetToken,
  }) => {
    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    return sendEmail({
      to: email,

      subject:
        "Reset your DevPulse password",

      html: `
        <!DOCTYPE html>
        <html>
          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                padding: 32px;
                background: #ffffff;
                border-radius: 12px;
              "
            >
              <h1 style="color: #111827;">
                Reset your DevPulse password
              </h1>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                "
              >
                Hi ${fullName},
              </p>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                We received a request to reset your
                DevPulse password.
              </p>

              <div style="margin: 32px 0;">
                <a
                  href="${resetUrl}"
                  style="
                    display: inline-block;
                    padding: 12px 24px;
                    background: #7c3aed;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                  "
                >
                  Reset Password
                </a>
              </div>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                "
              >
                This password reset link will expire
                in 15 minutes.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  };

// ====================================
// Send Password Changed Email
// ====================================

export const sendPasswordChangedEmail =
  async ({
    email,
    fullName,
  }) => {
    return sendEmail({
      to: email,

      subject:
        "Your DevPulse password was changed",

      html: `
        <!DOCTYPE html>
        <html>
          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                padding: 32px;
                background: #ffffff;
                border-radius: 12px;
              "
            >
              <h1 style="color: #111827;">
                Password Changed Successfully
              </h1>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                "
              >
                Hi ${fullName},
              </p>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Your DevPulse account password was
                successfully changed.
              </p>

              <p
                style="
                  color: #b91c1c;
                  font-size: 14px;
                "
              >
                If you did not make this change,
                please secure your account immediately.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  };

// ====================================
// Send Two-Factor Authentication Code
// ====================================

export const sendTwoFactorCodeEmail =
  async ({
    email,
    fullName,
    code,
  }) => {
    return sendEmail({
      to: email,

      subject:
        "Your DevPulse verification code",

      html: `
        <!DOCTYPE html>
        <html>
          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                padding: 32px;
                background: #ffffff;
                border-radius: 12px;
              "
            >
              <h1 style="color: #111827;">
                Verify your DevPulse login
              </h1>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                "
              >
                Hi ${fullName},
              </p>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                "
              >
                Use the verification code below to
                complete your login.
              </p>

              <div
                style="
                  margin: 32px 0;
                  padding: 20px;
                  text-align: center;
                  background: #f3e8ff;
                  border-radius: 12px;
                "
              >
                <span
                  style="
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: 8px;
                    color: #7c3aed;
                  "
                >
                  ${code}
                </span>
              </div>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                "
              >
                This verification code will expire
                in 10 minutes.
              </p>

              <p
                style="
                  color: #b91c1c;
                  font-size: 14px;
                "
              >
                Never share this code with anyone.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  };