export const LOCALES = ["en", "tr", "ar"];
export const DEFAULT_LOCALE = "en";

// Prisma `include` for translations in the requested locale plus the English fallback.
export const translationsFor = (locale) => ({
  where: { locale: { in: [...new Set([locale, DEFAULT_LOCALE])] } },
});

const OWNER_KEYS = new Set(["id", "locale", "serviceId", "caseId", "memberId", "postId", "packageId"]);

// Merges the best matching translation into the entity and drops the raw list.
export function localize(entity, locale) {
  if (!entity) return entity;
  const { translations = [], ...rest } = entity;
  const match = translations.find((t) => t.locale === locale) ?? translations.find((t) => t.locale === DEFAULT_LOCALE) ?? {};
  const copy = Object.fromEntries(Object.entries(match).filter(([key]) => !OWNER_KEYS.has(key)));
  return { ...rest, ...copy, locale: match.locale ?? DEFAULT_LOCALE };
}
