/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, Children, cloneElement } from "react";
import { classnames } from "../utils";

const Page = ({ pageNo, isCurrent, onClick }) => {
  const pageClass = classnames({
    "page-item": true,
    active: isCurrent,
  });

  return (
    <li className={pageClass} onClick={onClick}>
      <a className="page-link" aria-label={`Goto page ${pageNo}`}>
        {pageNo + 1}
      </a>
    </li>
  );
};

const createPage = (currentPage, setPage, number) => (
  <Page
    key={`page-${number}`}
    pageNo={number}
    isCurrent={currentPage === number}
    onClick={() => setPage(number)}
  />
);

const Ellipsis = () => (
  <li className="page-item">
    <span className="page-link">…</span>
  </li>
);

const determinePagesToShow = (pages, currentPage, setPage) => {
  const ret = [];
  if (pages.length > 6) {
    if (currentPage === 0) {
      return [createPage(currentPage, setPage, 1), createPage(currentPage, setPage, 2), <Ellipsis key='ellipsis-0' />];
    }
    if (currentPage === pages.length - 1) {
      return [<Ellipsis key='ellipsis-1' />, createPage(currentPage, setPage, currentPage - 2), createPage(currentPage, setPage, currentPage - 1)];
    }
    if (currentPage > 2) ret.push(<Ellipsis key='ellipsis-2' />);

    for (let i = -1; i < 2; i++) {
      if (currentPage + i > 0 && currentPage + i < pages.length - 1)
        ret.push(createPage(currentPage, setPage, currentPage + i));
    }

    if (currentPage < pages.length - 3) ret.push(<Ellipsis  key='ellipsis-3' />);
    return ret;
  } else if (pages.length >= 3) {
    return pages.slice(1, pages.length - 1).map((_page, i) => createPage(currentPage, setPage, i + i));
  }

  return null;
}

const Pagination = ({ items, pageSize, children, itemsKey = 'items' }) => {
  const [currentPage, setPage] = useState(0);
  const [currentPageSize, setPageSize] = useState(pageSize || 10);

  if (items.length < currentPageSize) {
    return (
      <>
        {Children.map(children, (C, i) => {
          return cloneElement(C, { key: i, [itemsKey]: items });
        })}
      </>
    );
  }

  const pages = [];
  for (let i = 0; i < Math.ceil(items.length / currentPageSize); i++) {
    pages.push(
      items.slice(currentPageSize * i, currentPageSize * i + currentPageSize)
    );
  }
  const pageDown = () => {
    if (currentPage > 0) setPage(currentPage - 1);
  };
  const pageUp = () => {
    if (currentPage < pages.length - 1) setPage(currentPage + 1);
  };
  const props = { [itemsKey]: pages[currentPage] };
  return (
    <div style={{ width: "100%" }}>
      {Children.map(children, (C, i) => {
        return cloneElement(C, { key: i, ...props });
      })}
      <div className="d-flex justify-content-between noselect pointer">
        <div>
          <select
            title="Page Size"
            className="form-control"
            value={currentPageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
        <ul className="pagination">
          <li className="page-item" onClick={pageDown}>
            <a className="page-link" aria-label={`Go to previous page`}>
              «
            </a>
          </li>

          {/* Always show Page 1 (index 0) */}
          {createPage(currentPage, setPage, 0)}

          {/* Determine middle pages to show */}
          {determinePagesToShow(pages, currentPage, setPage)}

          {/* Show Last Page if more than 1 page (index pages.length - 1) */}
          {pages.length > 1 && (
            createPage(currentPage, setPage, pages.length - 1)
          )}

          <li className="page-item" onClick={pageUp}>
            <a className="page-link" aria-label={`Go to next page`}>
              »
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
