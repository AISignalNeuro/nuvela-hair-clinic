import bcrypt from "bcryptjs";
import { prisma } from "../../../config/db.js";
import { env } from "../../../config/env.js";
import { HttpException } from "../../../core/httpException.js";
import { hmac, randomDigits, randomToken, safeEqual } from "../../../utils/crypto.js";
import { signAccessToken } from "../../../utils/jwt.js";
import { normalizePhone } from "../../../utils/phone.js";
import { sendSms } from "../../../utils/smsProvider.js";
import { verifyGoogleIdToken } from "../../../utils/googleOAuth.js";

const OTP_WINDOW_MS = 10 * 60 * 1000;
const OTP_MAX_PER_WINDOW = 3;

export const publicUser = (user) => ({
  id: user.id,
  phone: user.phone,
  email: user.email,
  fullName: user.fullName,
  avatarUrl: user.avatarUrl,
  role: user.role,
  locale: user.locale,
  createdAt: user.createdAt,
});

async function issueTokens(user) {
  const refreshToken = randomToken();
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hmac(refreshToken, env.jwt.accessSecret),
      expiresAt: new Date(Date.now() + env.jwt.refreshTtlDays * 24 * 60 * 60 * 1000),
    },
  });
  return { user: publicUser(user), accessToken: signAccessToken(user), refreshToken };
}

function requirePhone(input) {
  const phone = normalizePhone(input);
  if (!phone) throw HttpException.badRequest("Please enter a valid phone number");
  return phone;
}

export async function requestOtp(rawPhone) {
  const phone = requirePhone(rawPhone);
  const recent = await prisma.otpCode.count({ where: { phone, createdAt: { gt: new Date(Date.now() - OTP_WINDOW_MS) } } });
  if (recent >= OTP_MAX_PER_WINDOW) throw HttpException.tooMany("Too many codes requested. Please wait a few minutes.");

  const code = randomDigits(6);
  await prisma.otpCode.create({
    data: { phone, codeHash: hmac(`${phone}:${code}`, env.otp.secret), expiresAt: new Date(Date.now() + env.otp.ttlMinutes * 60 * 1000) },
  });
  await sendSms(phone, `Nuvela verification code: ${code}. It expires in ${env.otp.ttlMinutes} minutes.`);

  return { sent: true, expiresIn: env.otp.ttlMinutes * 60, ...(env.otp.exposeInResponse ? { devCode: code } : {}) };
}

export async function verifyOtp(rawPhone, code) {
  const phone = requirePhone(rawPhone);
  const otp = await prisma.otpCode.findFirst({
    where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp || otp.attempts >= env.otp.maxAttempts) throw HttpException.unauthorized("The code is incorrect or has expired");

  const valid = safeEqual(otp.codeHash, hmac(`${phone}:${code}`, env.otp.secret));
  await prisma.otpCode.update({
    where: { id: otp.id },
    data: valid ? { consumedAt: new Date(), attempts: { increment: 1 } } : { attempts: { increment: 1 } },
  });
  if (!valid) throw HttpException.unauthorized("The code is incorrect or has expired");

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone, provider: "PHONE" },
  });
  if (!user.isActive) throw HttpException.forbidden("This account has been disabled");
  return issueTokens(user);
}

export async function loginWithGoogle(idToken) {
  const profile = await verifyGoogleIdToken(idToken);
  const existing = await prisma.user.findFirst({ where: { OR: [{ googleId: profile.googleId }, { email: profile.email }] } });
  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { googleId: profile.googleId, fullName: existing.fullName ?? profile.fullName, avatarUrl: existing.avatarUrl ?? profile.avatarUrl },
      })
    : await prisma.user.create({ data: { ...profile, provider: "GOOGLE" } });
  if (!user.isActive) throw HttpException.forbidden("This account has been disabled");
  return issueTokens(user);
}

// Email + password sign-in for clinic staff accounts.
export async function loginWithPassword(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user?.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !valid) throw HttpException.unauthorized("Invalid email or password");
  if (!user.isActive) throw HttpException.forbidden("This account has been disabled");
  return issueTokens(user);
}

// Refresh tokens are single-use: each refresh revokes the old token and issues a new pair.
export async function refreshSession(refreshToken) {
  const tokenHash = hmac(refreshToken, env.jwt.accessSecret);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date() || !stored.user.isActive) {
    throw HttpException.unauthorized("Session expired, please sign in again");
  }
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
  const { accessToken, refreshToken: next } = await issueTokens(stored.user);
  return { accessToken, refreshToken: next };
}

export async function logout(refreshToken) {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hmac(refreshToken, env.jwt.accessSecret), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function updateProfile(userId, data) {
  const user = await prisma.user.update({ where: { id: userId }, data });
  return publicUser(user);
}
