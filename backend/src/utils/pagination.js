// Parses ?page & ?limit into Prisma skip/take and builds the meta block.
export function paginate(query, { defaultLimit = 12, maxLimit = 50 } = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export const pageMeta = ({ page, limit }, total) => ({ page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) });
