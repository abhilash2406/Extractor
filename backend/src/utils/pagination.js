const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Parses common list query parameters.
 * @param {Object} query - req.query
 * @returns {{ page, limit, offset, sortBy, sortOrder, search }}
 */
export const parsePagination = (query, defaultSortBy = 'created_at') => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  const sortBy = query.sortBy || defaultSortBy;
  const sortOrder = (query.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const search = query.search?.trim() || null;

  return { page, limit, offset, sortBy, sortOrder, search };
};

/**
 * Builds a standard offset-paginated response.
 */
export const paginatedResponse = (rows, count, page, limit) => ({
  data: rows,
  meta: {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  },
});

/**
 * Encodes a keyset cursor ({ created_at, id }) into an opaque base64url token.
 */
export const encodeCursor = (payload) => {
  if (!payload || !payload.created_at || !payload.id) return null;
  return Buffer.from(
    JSON.stringify({
      created_at: new Date(payload.created_at).toISOString(),
      id: payload.id,
    }),
    'utf8'
  ).toString('base64url');
};

/**
 * Decodes and validates an opaque base64url keyset cursor.
 * Returns null if missing or invalid.
 */
export const decodeCursor = (cursor) => {
  if (!cursor || typeof cursor !== 'string') return null;
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    if (!parsed || !parsed.created_at || !parsed.id) return null;
    if (!UUID_REGEX.test(String(parsed.id))) return null;
    const date = new Date(parsed.created_at);
    if (isNaN(date.getTime())) return null;
    return { created_at: date, id: parsed.id };
  } catch {
    return null;
  }
};

/**
 * Builds a standard cursor-paginated response.
 */
export const cursorPaginatedResponse = (rows, limit, extraMeta = {}) => {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const lastItem = items.length > 0 ? items[items.length - 1] : null;
  const nextCursor =
    hasMore && lastItem
      ? encodeCursor({
          created_at: lastItem.created_at || lastItem.createdAt,
          id: lastItem.id,
        })
      : null;

  return {
    data: items,
    meta: {
      limit,
      hasMore,
      nextCursor,
      ...extraMeta,
    },
  };
};
