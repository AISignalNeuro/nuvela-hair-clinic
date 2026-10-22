import { ok } from "../../../core/apiResponse.js";
import * as auth from "../services/auth.service.js";

export const requestOtp = async (req, res) => ok(res, await auth.requestOtp(req.body.phone));
export const verifyOtp = async (req, res) => ok(res, await auth.verifyOtp(req.body.phone, req.body.code));
export const google = async (req, res) => ok(res, await auth.loginWithGoogle(req.body.idToken));
export const login = async (req, res) => ok(res, await auth.loginWithPassword(req.body.email, req.body.password));
export const refresh = async (req, res) => ok(res, await auth.refreshSession(req.body.refreshToken));

export const logout = async (req, res) => {
  if (req.body?.refreshToken) await auth.logout(req.body.refreshToken);
  ok(res, { signedOut: true });
};

export const me = (req, res) => ok(res, auth.publicUser(req.user));
export const updateMe = async (req, res) => ok(res, await auth.updateProfile(req.user.id, req.body));
