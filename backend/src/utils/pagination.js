/**
 * Parses common list query parameters.
 * @param {Object} query - req.query
 * @returns {{ limit, offset, sortBy, sortOrder, search }}
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
 * Builds a standard paginated response.
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
