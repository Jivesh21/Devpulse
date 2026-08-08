import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

// ====================================
// Send Email Verification Email
// ====================================
export const sendVerificationEmail = async ({
  email,
  fullName,
  verificationToken,
}) => {
  const verificationUrl =
    `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const { data, error } =
    await resend.emails.send({
      from: "DevPulse <onboarding@resend.dev>",

      to: [email],

      subject: "Verify your DevPulse email",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Verify your DevPulse email</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              font-family: Arial, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                padding: 32px;
                background-color: #ffffff;
                border-radius: 12px;
              "
            >
              <h1
                style="
                  margin-bottom: 16px;
                  color: #111827;
                "
              >
                Welcome to DevPulse 👋
              </h1>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
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
                    background-color: #7c3aed;
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
                  line-height: 1.6;
                "
              >
                This verification link will expire
                in 24 hours.
              </p>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
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

  if (error) {
    console.error(
      "Resend verification email error:",
      error
    );

    throw new Error(
      "Failed to send verification email"
    );
  }

  return data;
};

// ====================================
// Send Password Reset Email
// ====================================
export const sendPasswordResetEmail = async ({
  email,
  fullName,
  resetToken,
}) => {
  const resetUrl =
    `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const { data, error } =
    await resend.emails.send({
      from: "DevPulse <onboarding@resend.dev>",

      to: [email],

      subject: "Reset your DevPulse password",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Reset your DevPulse password</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              font-family: Arial, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                padding: 32px;
                background-color: #ffffff;
                border-radius: 12px;
              "
            >
              <h1
                style="
                  margin-bottom: 16px;
                  color: #111827;
                "
              >
                Reset your DevPulse password
              </h1>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
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
                    background-color: #7c3aed;
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
                  line-height: 1.6;
                "
              >
                This password reset link will expire
                in 15 minutes.
              </p>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                If you did not request a password
                reset, you can safely ignore this
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

  if (error) {
    console.error(
      "Resend password reset email error:",
      error
    );

    throw new Error(
      "Failed to send password reset email"
    );
  }

  return data;
};
// ====================================
// Send Password Changed Confirmation
// ====================================
export const sendPasswordChangedEmail = async ({
  email,
  fullName,
}) => {
  const { data, error } =
    await resend.emails.send({
      from: "DevPulse <onboarding@resend.dev>",

      to: [email],

      subject:
        "Your DevPulse password was changed",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>
              Your DevPulse password was changed
            </title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              font-family: Arial, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                padding: 32px;
                background-color: #ffffff;
                border-radius: 12px;
              "
            >
              <h1
                style="
                  margin-bottom: 16px;
                  color: #111827;
                "
              >
                Password Changed Successfully
              </h1>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
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
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                If you made this change, no further
                action is required.
              </p>

              <p
                style="
                  color: #b91c1c;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                If you did not make this change,
                please secure your account immediately
                and contact support.
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

  if (error) {
    console.error(
      "Resend password changed email error:",
      error
    );

    throw new Error(
      "Failed to send password changed email"
    );
  }

  return data;
};

