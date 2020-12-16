import React, { useState } from "react";
import { connect } from "redux-bundler-react";

import Button from '../../app-components/button';

const DeleteButton = connect(
  "doModalClose",
  "doInstrumentGroupsDelete",
  "doUpdateUrlWithHomepage",
  "selectRouteParams",
  ({
    doModalClose,
    doInstrumentGroupsDelete,
    doUpdateUrlWithHomepage,
    routeParams,
    item,
  }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    if (!item || !item.id) return null;

    const handleDelete = () => {
      setIsConfirming(false);
      doInstrumentGroupsDelete(
        item,
        () => {
          doModalClose();
          if (routeParams.hasOwnProperty("groupSlug"))
            doUpdateUrlWithHomepage("/manager");
        },
        true
      );
    };

    return (
      <>
        {isConfirming ? (
          <div className="btn-group">
            <button
              title="Confirm"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Confirm
            </button>
            <button
              title="Cancel"
              className="btn btn-secondary"
              onClick={() => {
                setIsConfirming(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            title="Remove from Group"
            onClick={() => {
              setIsConfirming(true);
            }}
            className="btn btn-danger"
          >
            Delete
          </button>
        )}
      </>
    );
  }
);

export default connect(
  "doModalClose",
  "doInstrumentGroupsSave",
  "selectProjectsByRoute",
  ({
    doModalClose,
    doInstrumentGroupsSave,
    projectsByRoute: project,
    item,
  }) => {
    const [name, setName] = useState((item && item.name) || "");
    const [description, setDesc] = useState((item && item.description) || "");
    const [project_id] = useState((item && item.project_id) || project.id);
    const handleSave = (e) => {
      e.preventDefault();
      doInstrumentGroupsSave(
        Object.assign({}, item, {
          name,
          project_id,
          description,
        }),
        doModalClose,
        true
      );
    };

    return (
      <div className="modal-content" style={{ overflowY: "auto" }}>
        <form id="instrument-group-form" onSubmit={handleSave}>
          <header className="modal-header">
            <h5 className="modal-title">Edit Instrument Group</h5>
            <span className='close pointer text-primary' onClick={doModalClose}>&times;</span>
          </header>
          <section className="modal-body">
            <div className="form-group">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="form-control"
                type="text"
                placeholder="Text input"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                value={description}
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                className="form-control"
                type="text"
                placeholder="Text input"
              />
            </div>
          </section>
          <footer className="modal-footer">
            <div>
              <Button
                type='submit'
                className='mr-2'
                text='Save changes'
              />
              <Button
                variant='secondary'
                handleClick={(e) => {
                  e.preventDefault();
                  doModalClose();
                }}
                text='Cancel'
              />
            </div>
            <DeleteButton item={item} />
          </footer>
        </form>
      </div>
    );
  }
);
