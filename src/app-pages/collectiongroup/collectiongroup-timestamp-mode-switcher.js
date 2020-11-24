import { formatDistanceToNow } from "date-fns";
import React from "react";
import DatePicker from "react-datepicker";
import "./collectiongroup-timestamp-mode-switcher.css";

export default ({ timestampMode, setTimestampMode, date, setDate }) => {
  return (
    <div className="d-flex flex-row-reverse align-items-center bg-light px-3 py-2">
      <div className="d-flex flex-column">
        <div style={{ width: 240 }} className="text-right">
          <DatePicker
            style={{ width: "100%" }}
            selected={date}
            onChange={(date) => {
              setTimestampMode("choose");
              setDate(date);
            }}
            dateFormat="yyyy-MM-d hh:mm 'GMT'XXXXX"
            showTimeInput
          />
        </div>
        <div className="d-flex flex-row-reverse justify-content-between">
          <div className="text-secondary">
            <small>
              {timestampMode === "choose"
                ? formatDistanceToNow(date, { addSuffix: true })
                : "now"}
            </small>
          </div>
          {timestampMode !== "now" && (
            <button
              style={{ width: 120 }}
              className={`btn btn-link btn-sm p-0 text-left ${
                timestampMode === "now" ? "text-secondary" : ""
              }`}
              onClick={(e) => {
                setTimestampMode("now");
              }}
            >
              reset to now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
