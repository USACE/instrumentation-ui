import { formatDistanceToNow, parseISO } from "date-fns";
import React, { useState } from "react";

import Button from "../../app-components/button";
import RoleFilter from "../../app-components/role-filter";

const TimeseriesListEntry = ({
  handleItemSaveValue,
  handleItemDelete,
  item,
}) => {
  const [value, setValue] = useState("");

  return (
    // Flex Wrapper
    <div
      className="d-flex flex-row list-group-item border-0 bg-light my-1"
      style={{ cursor: "pointer" }}
    >
      {/* Column 1 */}
      <div className="d-flex flex-row" style={{ minWidth: "420px" }}>
        <div className="d-flex flex-column my-2">
          <div className="h5 mb-1">
            <a
              href={`/${item.project_slug}/instruments/${item.instrument_slug}`}
            >
              {item.instrument}
            </a>
            <RoleFilter allowRoles={[`${item.project_slug.toUpperCase()}.*`]}>
              <Button
                variant='link'
                className='text-secondary h-100'
                handleClick={() => handleItemDelete(item)}
                icon={<i className="mdi mdi-delete" />}
              />
            </RoleFilter>
          </div>
          <div className="h6">
            {item.name}
            <small className="ml-2 text-uppercase text-secondary">
              | {item.unit}
            </small>
          </div>
        </div>
      </div>
      {/* Column 2 (Latest Value) */}
      <div className="d-flex flex-row w-100 justify-content-between align-items-center">
        <div className="d-flex flex-column justify-content-center align-items-left">
          <div className="h5 mb-0">
            {item.latest_value}
            <small className="ml-2 text-uppercase text-secondary">
              {item.unit}
            </small>
          </div>
          <div className="text-secondary font-weight-light font-italic">
            {formatDistanceToNow(parseISO(item.latest_time)) + " ago"}
          </div>
        </div>
        {/* Column 3 */}
        <div className="d-flex flex-row">
          <div>
            <input
              style={{ width: 200, textAlign: "center" }}
              type="number"
              value={value}
              className="form-control"
              placeholder="enter value"
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </div>
          <div
            className="btn btn-secondary btn-small ml-1 text-uppercase"
            onClick={(e) => {
              handleItemSaveValue(item, value);
              setValue("");
            }}
          >
            <i className="mdi mdi-plus mdi-16px" />
            add
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionGroupTimeseriesList = ({
  items,
  handleItemDelete,
  handleItemSaveValue,
}) => {
  return (
    <div className="w-100 list-group">
      {items.map((item, idx) => (
        <TimeseriesListEntry
          key={idx}
          item={item}
          handleItemDelete={handleItemDelete}
          handleItemSaveValue={handleItemSaveValue}
        />
      ))}
    </div>
  );
};

export default CollectionGroupTimeseriesList;
