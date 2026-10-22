// API tests using Node's built-in test runner.
//   npm test                    → checks that need no database
//   TEST_DATABASE_URL=… npm test → also runs the full flow against a seeded database
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
process.env.OTP_DEV_ECHO = "true";
if (process.env.TEST_DATABASE_URL) process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

const { createApp } = await import("../src/app.js");
const { prisma } = await import("../src/config/db.js");

let server;
let base;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});

after(async () => {
  server.close();
  await prisma.$disconnect();
});

const call = async (path, { method = "GET", body, token } = {}) => {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json().catch(() => null), headers: res.headers };
};

describe("without a database", () => {
  it("returns 404 JSON for unknown routes", async () => {
    const res = await call("/does-not-exist");
    assert.equal(res.status, 404);
    assert.equal(res.body.status, "error");
  });

  it("rejects invalid booking payloads with 422 and field errors", async () => {
    const res = await call("/appointments", { method: "POST", body: { fullName: "A", phone: "1" } });
    assert.equal(res.status, 422);
    assert.ok(res.body.errors.some((e) => e.field === "fullName"));
  });

  it("protects account and admin routes", async () => {
    assert.equal((await call("/auth/me")).status, 401);
    assert.equal((await call("/admin/stats")).status, 401);
    assert.equal((await call("/auth/me", { token: "not-a-jwt" })).status, 401);
  });

  it("rejects malformed JSON bodies", async () => {
    const res = await fetch(`${base}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{oops" });
    assert.equal(res.status, 400);
  });
});

describe("with a seeded database", { skip: !process.env.TEST_DATABASE_URL }, () => {
  it("reports a healthy database", async () => {
    const res = await call("/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.database, "ok");
  });

  it("serves localized services with English fallback", async () => {
    const en = await call("/services?lang=en");
    const tr = await call("/services?lang=tr");
    assert.equal(en.status, 200);
    assert.ok(en.body.data.length >= 7);
    const sapphireTr = tr.body.data.find((s) => s.slug === "sapphire-fue");
    assert.equal(sapphireTr.locale, "tr");
    assert.match(sapphireTr.title, /Safir/);
    assert.equal(tr.headers.get("content-language"), "tr");
  });

  it("returns a service detail page with cases", async () => {
    const res = await call("/services/sapphire-fue?lang=ar");
    assert.equal(res.status, 200);
    assert.equal(res.body.data.locale, "ar");
    assert.ok(res.body.data.sections.length > 0);
    assert.ok(Array.isArray(res.body.data.cases));
    assert.equal((await call("/services/nope")).status, 404);
  });

  it("filters gallery cases and paginates", async () => {
    const res = await call("/gallery/cases?category=facial&limit=2");
    assert.equal(res.status, 200);
    assert.ok(res.body.data.every((c) => c.service.category === "facial"));
    assert.equal(res.body.meta.limit, 2);
  });

  it("lists journal posts, FAQs, team, packages and settings", async () => {
    const posts = await call("/blog/posts?lang=tr");
    assert.ok(posts.body.data.length > 0 && !("sections" in posts.body.data[0]));
    const post = await call(`/blog/posts/${posts.body.data[0].slug}?lang=tr`);
    assert.ok(post.body.data.sections.length > 0);
    assert.ok((await call("/faqs?lang=ar&category=pricing")).body.data.every((f) => f.locale === "ar" && f.category === "pricing"));
    assert.ok((await call("/team")).body.data.length >= 4);
    assert.equal((await call("/packages?lang=tr")).body.data.length, 3);
    assert.equal((await call("/settings/public")).body.data.name, "Nuvela Hair Clinic");
  });

  it("creates a consultation request and a contact lead", async () => {
    const booking = await call("/appointments", {
      method: "POST",
      body: { fullName: "Test Patient", phone: "+44 7700 900123", serviceSlug: "dhi-hair-transplant", contactChannel: "whatsapp", locale: "en" },
    });
    assert.equal(booking.status, 201);
    assert.match(booking.body.data.reference, /^NV-/);

    const lead = await call("/contact", { method: "POST", body: { fullName: "Test Patient", email: "test@example.com", subject: "pricing", message: "How much is DHI?" } });
    assert.equal(lead.status, 201);
    assert.match(lead.body.data.reference, /^MSG-/);
  });

  it("signs in with a phone OTP, refreshes and lists own requests", async () => {
    const phone = "+44 7700 900123";
    const otp = await call("/auth/request-otp", { method: "POST", body: { phone } });
    assert.equal(otp.status, 200);
    assert.match(otp.body.data.devCode, /^\d{6}$/);

    const wrong = await call("/auth/verify-otp", { method: "POST", body: { phone, code: otp.body.data.devCode === "000000" ? "111111" : "000000" } });
    assert.equal(wrong.status, 401);

    const session = await call("/auth/verify-otp", { method: "POST", body: { phone, code: otp.body.data.devCode } });
    assert.equal(session.status, 200);
    const { accessToken, refreshToken, user } = session.body.data;
    assert.equal(user.phone, "+447700900123");

    const me = await call("/auth/me", { token: accessToken });
    assert.equal(me.body.data.id, user.id);

    const mine = await call("/appointments/my", { token: accessToken });
    assert.ok(mine.body.data.some((a) => a.serviceSlug === "dhi-hair-transplant"));

    const refreshed = await call("/auth/refresh", { method: "POST", body: { refreshToken } });
    assert.equal(refreshed.status, 200);
    // Refresh tokens are single-use.
    assert.equal((await call("/auth/refresh", { method: "POST", body: { refreshToken } })).status, 401);

    assert.equal((await call("/admin/stats", { token: accessToken })).status, 403);
  });

  it("lets staff sign in with a password and manage bookings", async () => {
    const bcrypt = (await import("bcryptjs")).default;
    const email = "staff.test@nuvela-clinic.example";
    await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN", isActive: true, passwordHash: await bcrypt.hash("staff-pass-1234", 4) },
      create: { email, role: "ADMIN", provider: "PASSWORD", passwordHash: await bcrypt.hash("staff-pass-1234", 4) },
    });

    assert.equal((await call("/auth/login", { method: "POST", body: { email, password: "wrong-pass-0000" } })).status, 401);
    const login = await call("/auth/login", { method: "POST", body: { email, password: "staff-pass-1234" } });
    assert.equal(login.status, 200);
    const token = login.body.data.accessToken;

    const stats = await call("/admin/stats", { token });
    assert.equal(stats.status, 200);
    assert.ok(stats.body.data.appointments.PENDING >= 1);

    const list = await call("/admin/appointments?status=pending&limit=5", { token });
    assert.ok(list.body.data.length >= 1);
    const updated = await call(`/admin/appointments/${list.body.data[0].id}`, { method: "PATCH", token, body: { status: "CONFIRMED", adminNote: "Called back" } });
    assert.equal(updated.body.data.status, "CONFIRMED");

    const faq = await call("/admin/faqs", { method: "POST", token, body: { locale: "en", category: "general", question: "Is parking available?", answer: "Yes, valet parking is free." } });
    assert.equal(faq.status, 201);
    assert.equal((await call(`/admin/faqs/${faq.body.data.id}`, { method: "DELETE", token })).status, 204);
  });
});
