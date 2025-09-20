import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// get env variables
const { 
    GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET, 
    GOOGLE_REFRESH_TOKEN, 
    SMUNCH_EMAIL,
    SMUNCH_NAME 
} = process.env;

// sending address for other files to use
export const SMUNCH_FROM_ADDRESS = `"${SMUNCH_NAME}" <${SMUNCH_EMAIL}>`;

// configure gmail client
const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// create a transporter object (so that migration from nodemailer is easier)
export const transporter = {
  async sendMail({ from = SMUNCH_FROM_ADDRESS, to, subject, html }) {
    const encodedSubject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;

    const headers = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: base64`
    ].join("\r\n");

    const body = Buffer.from(html, "utf8").toString("base64");
    const raw = Buffer.from(`${headers}\r\n\r\n${body}`)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
  }
};

// verify transporter works
if (process.env.NODE_ENV === "development") {
    (async () => {
    try {
        await transporter.sendMail({
        to: SMUNCH_EMAIL,
        subject: "[SMUNCH] Transporter ready check",
        html: "<p>Transporter is working 🎉</p>",
        });
        console.log("[MAILER] Gmail API transporter is ready.");
    } catch (err) {
        console.error("[MAILER VERIFY FAILED]", err);
    }
    })();
}