-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'DOCTOR', 'RECEPTIONIST', 'PATIENT');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('en', 'tr', 'ar');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('PHONE', 'GOOGLE', 'PASSWORD');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('WHATSAPP', 'PHONE', 'EMAIL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',
    "provider" "AuthProvider" NOT NULL DEFAULT 'PHONE',
    "googleId" TEXT,
    "passwordHash" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "art" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priceFrom" INTEGER NOT NULL,
    "priceUnit" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "facts" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_translations" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "benefits" JSONB NOT NULL,
    "candidates" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,

    CONSTRAINT "service_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_cases" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "art" TEXT NOT NULL,
    "grafts" INTEGER NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "country" TEXT,
    "monthsAfter" INTEGER NOT NULL,
    "severity" INTEGER NOT NULL DEFAULT 3,
    "seed" INTEGER NOT NULL DEFAULT 1,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_case_translations" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "highlight" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "gallery_case_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "years" INTEGER NOT NULL,
    "languages" TEXT[],
    "hue" INTEGER NOT NULL DEFAULT 180,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_member_translations" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "specialties" TEXT[],

    CONSTRAINT "team_member_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'turquoise',
    "icon" TEXT NOT NULL DEFAULT 'sparkle',
    "readTime" INTEGER NOT NULL DEFAULT 5,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_translations" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "faqs" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,

    CONSTRAINT "blog_post_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "priceFrom" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "technique" TEXT NOT NULL,
    "includes" TEXT[],
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_translations" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,

    CONSTRAINT "package_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "patientName" TEXT NOT NULL,
    "country" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "serviceSlug" TEXT,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT,
    "serviceId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "country" TEXT,
    "contactChannel" "ContactChannel" NOT NULL DEFAULT 'WHATSAPP',
    "preferredDate" TIMESTAMP(3),
    "companions" INTEGER,
    "airport" TEXT,
    "concern" TEXT,
    "hairLossDuration" TEXT,
    "previousTransplant" BOOLEAN,
    "note" TEXT,
    "source" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'en',
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'en',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "alt" TEXT,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "otp_codes_phone_createdAt_idx" ON "otp_codes"("phone", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_category_isActive_idx" ON "services"("category", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "service_translations_serviceId_locale_key" ON "service_translations"("serviceId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_cases_slug_key" ON "gallery_cases"("slug");

-- CreateIndex
CREATE INDEX "gallery_cases_serviceId_isPublished_idx" ON "gallery_cases"("serviceId", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_case_translations_caseId_locale_key" ON "gallery_case_translations"("caseId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_slug_key" ON "team_members"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "team_member_translations_memberId_locale_key" ON "team_member_translations"("memberId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_category_isPublished_publishedAt_idx" ON "blog_posts"("category", "isPublished", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_translations_postId_locale_key" ON "blog_post_translations"("postId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "packages_slug_key" ON "packages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "package_translations_packageId_locale_key" ON "package_translations"("packageId", "locale");

-- CreateIndex
CREATE INDEX "faqs_locale_category_isActive_idx" ON "faqs"("locale", "category", "isActive");

-- CreateIndex
CREATE INDEX "testimonials_locale_isPublished_idx" ON "testimonials"("locale", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_reference_key" ON "appointments"("reference");

-- CreateIndex
CREATE INDEX "appointments_status_createdAt_idx" ON "appointments"("status", "createdAt");

-- CreateIndex
CREATE INDEX "appointments_phone_idx" ON "appointments"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "leads_reference_key" ON "leads"("reference");

-- CreateIndex
CREATE INDEX "leads_status_createdAt_idx" ON "leads"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_translations" ADD CONSTRAINT "service_translations_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_cases" ADD CONSTRAINT "gallery_cases_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_case_translations" ADD CONSTRAINT "gallery_case_translations_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "gallery_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_translations" ADD CONSTRAINT "team_member_translations_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_translations" ADD CONSTRAINT "blog_post_translations_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_translations" ADD CONSTRAINT "package_translations_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

