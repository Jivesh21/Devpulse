const getPagination = (page = 1, limit = 10) => {
  const currentPage = Math.max(1, Number(page));

  const perPage = Math.min(
    Math.max(1, Number(limit)),
    20 // Maximum items per page
  );

  return {
    currentPage,
    perPage,
    skip: (currentPage - 1) * perPage,
  };
};

export default getPagination;