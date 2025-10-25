// get-gmail-refresh-token.js
import readline from "node:readline/promises";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your shell before running.");
  process.exit(1);
}

// Set any redirect; for installed apps the library handles it internally
const oAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost" // not used in this CLI prompt flow
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

async function main() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",         // <-- ensures refresh_token is returned
    prompt: "consent",              // <-- forces refresh_token even if previously granted
    scope: SCOPES,
  });

  console.log("\n1) Open this URL in your browser and authorize:");
  console.log(authUrl);
  console.log("\n2) Paste the full redirect URL or the 'code' param here.");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const redirect = await rl.question("\nPaste the full redirected URL (or just ?code=... value): ");
  rl.close();

  // Extract the code whether they pasted full URL or only code
  const codeMatch = redirect.match(/[?&]code=([^&]+)/);
  const code = codeMatch ? codeMatch[1] : redirect.trim();

  const { tokens } = await oAuth2Client.getToken(code);
  console.log("\nTokens:", tokens);
  if (!tokens.refresh_token) {
    console.error("\nNo refresh_token received. Re-run with prompt=consent and access_type=offline.");
    process.exit(1);
  }

  console.log("\n✅ Save this as GOOGLE_REFRESH_TOKEN:");
  console.log(tokens.refresh_token);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
