import React, { useState } from "react";
import { connect } from "redux-bundler-react";

const DeleteButton = connect(
  "doInstrumentGroupsDelete",
  "doModalClose",
  "doUpdateUrlWithHomepage",
  "selectRouteParams",

  ({
    doInstrumentGroupsDelete,
    doModalClose,
    doUpdateUrlWithHomepage,
    routeParams,
    item,
  }) => {
    const [isConfirming, setIsConfirming] = useState(false);

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
          <>
            <button
              title="Confirm"
              className="button is-danger"
              onClick={handleDelete}
            >
              Confirm
            </button>
            <button
              title="Cancel"
              className="button is-secondary"
              onClick={() => {
                setIsConfirming(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            title="Remove from Group"
            onClick={() => {
              setIsConfirming(true);
            }}
            className="button is-danger"
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
    item,
    projectsByRoute: project,
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
      <div className="modal-card" style={{ overflowY: "auto" }}>
        <form id="instrument-form" onSubmit={handleSave}>
          <header className="modal-card-head">
            <p className="modal-card-title">Edit Instrument Group</p>
            <button
              type="button"
              onClick={doModalClose}
              className="delete"
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Name</label>
              <p className="control">
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="input"
                  type="text"
                  placeholder="Text input"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <p className="control">
                <input
                  value={description}
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  className="input"
                  type="text"
                  placeholder="Text input"
                />
              </p>
            </div>
          </section>
          <footer
            className="modal-card-foot"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <button type="submit" className="button is-primary">
                Save changes
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  doModalClose();
                }}
                className="button"
              >
                Cancel
              </button>
            </div>
            <div>
              <DeleteButton item={item} />
            </div>
          </footer>
        </form>
      </div>
    );
  }
);
