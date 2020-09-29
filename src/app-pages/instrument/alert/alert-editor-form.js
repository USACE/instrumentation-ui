import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doAlertsSave",
  ({ alert, doAlertsSave }) => {
    const [formula, setFormula] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
      if (alert) {
        setFormula(alert.formula);
        setBody(alert.body);
      }
    }, [alert]);

    return (
      <div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="formula">Formula</label>
              <textarea
                id="formula"
                className="form-control"
                value={formula}
                onChange={(e) => {
                  setFormula(e.target.value);
                }}
                rows={6}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="body">Body</label>
              <textarea
                id="body"
                className="form-control"
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                }}
                rows={6}
              />
            </div>
          </div>
        </form>
        <div className="d-flex justify-content-end mt-2">
          <button
            onClick={() => {
              console.log("Clicked the cancel button");
            }}
            className="btn btn-sm btn-secondary mr-1"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const updatedAlert = { ...alert, formula, body };
              doAlertsSave(updatedAlert);
              console.log("Clicked the save button", updatedAlert);
            }}
            className="btn btn-sm btn-success"
          >
            Save
          </button>
        </div>
        <div className="text-right mt-5">
          <small>{`Last Updated at ${alert.update_date}`}</small>
        </div>
      </div>
    );
  }
);
