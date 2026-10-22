import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { HttpException } from "../core/httpException.js";

const client = env.google.clientId ? new OAuth2Client(env.google.clientId) : null;

// Verifies a Google Identity Services ID token and returns the profile we need.
export async function verifyGoogleIdToken(idToken) {
  if (!client) throw new HttpException(501, "Google sign-in is not configured on this server");
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: env.google.clientId });
    const payload = ticket.getPayload();
    if (!payload?.email_verified) throw new Error("unverified email");
    return { googleId: payload.sub, email: payload.email.toLowerCase(), fullName: payload.name ?? null, avatarUrl: payload.picture ?? null };
  } catch {
    throw HttpException.unauthorized("Invalid Google credential");
  }
}
