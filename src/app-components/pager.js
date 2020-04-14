/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, Children, cloneElement } from "react";
import { classnames } from "../utils";

const Page = ({ pageNo, isCurrent, onClick }) => {
  const pageClass = classnames({
    "pagination-link": true,
    "is-current": isCurrent,
  });
  return (
    <li onClick={onClick}>
      <a className={pageClass} aria-label={`Goto page ${pageNo}`}>
        {pageNo}
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
      <nav
        className="pagination is-rounded"
        role="navigation"
        aria-label="pagination"
      >
        <a onClick={pageDown} className="pagination-previous">
          Previous
        </a>
        <a onClick={pageUp} className="pagination-next">
          Next page
        </a>
        <ul className="pagination-list">
          {pages.map((p, i) => {
            return (
              <Page
                key={i}
                pageNo={i + 1}
                isCurrent={currentPage === i}
                onClick={() => {
                  setPage(i);
                }}
              />
            );
          })}
        </ul>
        <div className="field" title="Page Size">
          <p className="control">
            <span className="select">
              <select
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
            </span>
          </p>
        </div>
      </nav>
    </div>
  );
};
