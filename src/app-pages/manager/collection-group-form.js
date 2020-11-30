import React, { useState } from "react";
import { connect } from "redux-bundler-react";

const DeleteButton = connect(
  "doModalClose",
  "doCollectionGroupDelete",
  "doUpdateUrlWithHomepage",
  "selectRouteParams",
  ({
    doModalClose,
    doCollectionGroupDelete: doDelete,
    doUpdateUrlWithHomepage,
    routeParams,
    item,
  }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    if (!item || !item.id) return null;

    const handleDelete = () => {
      setIsConfirming(false);
      doDelete(
        item,
        () => {
          doModalClose();
          if (routeParams.hasOwnProperty("projectSlug"))
            doUpdateUrlWithHomepage(`/${routeParams.projectSlug}/manager`);
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
  "doCollectionGroupSave",
  "selectProjectsByRoute",
  ({ doModalClose, doCollectionGroupSave, item, projectsByRoute: project }) => {
    const [name, setName] = useState((item && item.name) || "");
    const [project_id] = useState((item && item.project_id) || project.id);

    const handleSave = (e) => {
      e.preventDefault();
      doCollectionGroupSave(
        Object.assign({}, item, {
          name,
          project_id,
        }),
        doModalClose,
        true
      );
    };

    return (
      <div className="modal-content" style={{ overflowY: "auto" }}>
        <form id="collection-group-form" onSubmit={handleSave}>
          <header className="modal-header">
            <h5 className="modal-title">Edit Collection Group</h5>
            <span className="pointer" onClick={doModalClose}>
              <i className="mdi mdi-close-circle-outline"></i>
            </span>
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
          </section>
          <footer
            className="modal-footer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <button type="submit" className="btn btn-primary mr-2">
                Save
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  doModalClose();
                }}
                className="btn btn-secondary"
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
