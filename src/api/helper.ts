import { jwtVerify, SignJWT } from "jose";
import { type Env } from "../index"
import { localDb, type CartItems } from "./indexedDB";
import type { CartItem } from "../components/CartContext";

// 1. Define the interface matching your custom SignJWT payload structure
interface CustomJWTPayload {
  id: number;    // This holds the user.id you embedded
  email: string;
  role: string;
}

/**
 * Validates the incoming Authorization bearer token and extracts the authenticated User ID.
 */
export async function getUserIdFromSession(request: Request, env: Env): Promise<number | null> {
  try {
    // 2. Fetch the Authorization Header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    // 3. Extract the clean token string
    const token = authHeader.split(' ')[1];

    // 4. Decode and verify the cryptographic signature using your JWT_SECRET
    const secretKey = new TextEncoder().encode(env.JWT_SECRET);

    // jwtVerify automatically checks if the token is expired ('24h') 
    // and verifies that the signature matches HS256 perfectly
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    const typedPayload = payload as unknown as CustomJWTPayload;

    // 5. Return the validated user ID integer straight to your sync transaction block
    if (typedPayload && typeof typedPayload.id === 'number') {
      return typedPayload.id;
    }

    return null;
  } catch (error) {
    // If the token is expired, has an invalid signature, or is malformed, 
    // jwtVerify throws an error, and we gracefully deny access.
    console.error("JWT Verification failed at edge boundary:", error);
    return null;
  }
}

export async function sendVerificationEmail(email: string, password_hash: string, salt: string, display_name: string, username: string, env: any, token_id: string) {
  // 1. Create a temporary token that expires in 1 hour
  // We include the hash and salt so we don't have to store them in the DB yet
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const verifyToken = await new SignJWT({
    email,
    password_hash,
    salt,
    display_name,
    username,
    token_id,
    type: 'account_linking'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);

  const verificationLink = `${env.API_URL}/api/auth/verify?token=${verifyToken}`;

  // 2. Call Resend API
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Confirm your account password',
      html: `
        <div style="font-family: 'Roboto', Helvetica, Arial, sans-serif; background-color: #f4f7f9; padding: 40px 20px; color: #334155;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <tr>
              <td style="background-color: #1976d2; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">TLP HRM SYSTEM</h1>
              </td>
            </tr>
            
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #1e293b; margin-top: 0;">Confirm Password Setup</h2>
                <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${display_name}</strong>,</p>
                <p style="font-size: 16px; line-height: 1.6;">
                  We received a request to add a password to your account. For your security, please confirm this change by clicking the button below.
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${verificationLink}" style="background-color: #1976d2; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 16px; display: inline-block;">
                    Verify My Account
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
                  This link is valid for <strong>1 hour</strong>. If you did not request this change, you can safely ignore this email.
                </p>
              </td>
            </tr>
            
            <tr>
              <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                  &copy; 2026 TLP-Site. Built for Information Technology HRM.
                </p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 5px;">
                  This is an automated security message, please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Resend API Error:", error);
    throw new Error("Failed to send email");
  }
}

export const generateRandomName = () => {
  const adjectives = ["Digital", "Cyber", "Logic", "Binary", "System", "Cloud"];
  const nouns = ["Ninja", "Architect", "Voyager", "Sentry", "Pilot", "Analyst"];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(1000 + Math.random() * 9000); // 4-digit suffix

  return `${adj}${noun}${num}`;
};

export const singleHyphenFormat = (value: string) => {

  const formattedValue = value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return formattedValue;
}

export const fetchLocalCartForUser = async (): Promise<{userCartRows: CartItems[], currentUserId: number} | {}> => {
  // 1. Get the profile string out of localStorage
  const profileString = localStorage.getItem('user_profile');

  // 🚪 Safety Guard: If no profile exists, they are a guest (return empty)
  if (!profileString) {
    console.log("👤 No user profile found. Returning empty cart.");
    return [];
  }

  try {
    // 2. Parse the JSON string back into a usable JavaScript object
    const profile = JSON.parse(profileString);
    const currentUserId = profile.id; // 🔑 Here is your User ID!

    // 3. Query Dexie using your composite index [user_id+product_id]
    // .where('user_id').equals(currentUserId) isolates this user's rows perfectly
    const userCartRows = await localDb.cart_items
      .where('user_id')
      .equals(currentUserId)
      .toArray();

    console.log(`📂 Retrieved ${userCartRows.length} offline cart items for User #${currentUserId}`);
    return {userCartRows: userCartRows, currentUserId: currentUserId};

  } catch (error) {
    console.error("❌ Failed to read user_profile or query Dexie:", error);
    return {};
  }
};