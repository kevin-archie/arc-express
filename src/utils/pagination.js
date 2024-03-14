function pagination(page, limit, datas) {
  const currentPage = page ? Number(page) : 1;
  const pageSize = limit || 10;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const result = datas.slice(startIndex, endIndex);

  const obj = {
    totalData: datas.length,
    totalPages: Math.ceil(datas.length / pageSize),
    pageSize: Number(pageSize),
    currentPage: Number(currentPage),
    currentTotalData: result.length,
    data: result,
  };

  return obj;
}

module.exports = pagination;
