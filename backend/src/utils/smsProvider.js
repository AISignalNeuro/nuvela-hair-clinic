import { env } from "../config/env.js";
import { logger } from "./logger.js";

// SMS gateway adapter. "console" just logs the message; plug a real provider
// (e.g. Netgsm, Twilio) into `providers` and select it with SMS_PROVIDER.
const providers = {
  async console({ to, text }) {
    logger.info(`[sms] to ${to}: ${text}`);
    return { delivered: true };
  },
};

export async function sendSms(to, text) {
  const send = providers[env.sms.provider];
  if (!send) throw new Error(`Unknown SMS provider "${env.sms.provider}"`);
  return send({ to, text });
}
