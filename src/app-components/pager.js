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

          <Page
            pageNo={1}
            isCurrent={currentPage === 0}
            onClick={() => {
              setPage(0);
            }}
          />

          {currentPage > 2 && pages.length > 5 ? (
            <li className="page-item">
              <span className="page-link">…</span>
            </li>
          ) : null}

          {[1, 2, 3].map((_, i) => {
            let p1 = currentPage - 1;
            // if current page is 0, or 1 we start the count at idx = 1
            if (currentPage <= 1) p1 = 1;
            // if current page is greater than length - 2 we start the idx at length - 4
            if (currentPage >= pages.length - 2) p1 = pages.length - 4;
            return (
              <Page
                key={`${i}-${p1}`}
                pageNo={p1 + i + 1}
                isCurrent={currentPage === p1 + i}
                onClick={() => {
                  setPage(p1 + i);
                }}
              />
            );
          })}

          {currentPage < pages.length - 2 && pages.length > 5 ? (
            <li className="page-item">
              <span className="page-link">…</span>
            </li>
          ) : null}

          <Page
            pageNo={pages.length}
            isCurrent={currentPage === pages.length - 1}
            onClick={() => {
              setPage(pages.length - 1);
            }}
          />

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
