import React from 'react';

import Page from './page';
import Ellipsis from './ellipsis';

export const handlePageChange = ({
  newPage,
  pageSize,
  setUpperLimit,
  setLowerLimit,
}) => {
  const lowerLimit = newPage * pageSize;
  const upperLimit = (newPage + 1) * pageSize;
  setUpperLimit(upperLimit);
  setLowerLimit(lowerLimit);
};

export const createPage = (currentPage, setPage, number) => (
  <Page
    key={`page-${number}`}
    pageNo={number}
    isCurrent={currentPage === number}
    onClick={() => setPage(number)}
  />
);

export const determinePagesToShow = (pageCount, currentPage, setPage) => {
  const ret = [];

  if (pageCount > 6) {
    if (currentPage === 0) {
      return [createPage(currentPage, setPage, 1), createPage(currentPage, setPage, 2), <Ellipsis key='ellipsis-0' />];
    }
    if (currentPage === pageCount - 1) {
      return [<Ellipsis key='ellipsis-1' />, createPage(currentPage, setPage, currentPage - 2), createPage(currentPage, setPage, currentPage - 1)];
    }
    if (currentPage > 2) ret.push(<Ellipsis key='ellipsis-2' />);

    for (let i = -1; i < 2; i++) {
      if (currentPage + i > 0 && currentPage + i < pageCount - 1)
        ret.push(createPage(currentPage, setPage, currentPage + i));
    }

    if (currentPage < pageCount - 3) ret.push(<Ellipsis  key='ellipsis-3' />);
    return ret;
  } else if (pageCount >= 3) {
    return new Array(pageCount).fill(null).slice(1, pageCount - 1).map((_page, i) => createPage(currentPage, setPage, i + 1));
  }

  return null;
};