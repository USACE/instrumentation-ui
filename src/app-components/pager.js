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

export default ({ items, pageSize, children, itemsKey }) => {
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
          {pages.map((_page, i) => (
            <Page
              key={`page-${i}`}
              pageNo={i}
              isCurrent={currentPage === i}
              onClick={() => setPage(i)}
            />
          ))}
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
