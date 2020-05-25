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
        className="pagination is-rounded level"
        role="navigation"
        aria-label="pagination"
      >
        <div className="level-left">
          <div className="field level-item" title="Page Size">
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
        </div>

        <div className="level-item">
          <ul className="pagination-list" style={{ justifyContent: "center" }}>
            <Page
              pageNo={1}
              isCurrent={currentPage === 0}
              onClick={() => {
                setPage(0);
              }}
            />

            {currentPage > 2 && pages.length > 5 ? (
              <li>
                <span className="pagination-ellipsis">…</span>
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
              <li>
                <span className="pagination-ellipsis">…</span>
              </li>
            ) : null}

            <Page
              pageNo={pages.length}
              isCurrent={currentPage === pages.length - 1}
              onClick={() => {
                setPage(pages.length - 1);
              }}
            />
          </ul>
        </div>

        <div className="level-right">
          <div className="level-item">
            <a onClick={pageDown} className="pagination-previous">
              Previous
            </a>
            <a onClick={pageUp} className="pagination-next">
              Next page
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};
