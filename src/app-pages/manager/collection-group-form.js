import React, { useState } from "react";
import { connect } from "redux-bundler-react";

import { ModalFooter } from "../../app-components/modal";

export default connect(
  "doModalClose",
  "doCollectionGroupSave",
  "doUpdateUrlWithHomepage",
  "doCollectionGroupDelete",
  "selectRouteParams",
  "selectProjectsByRoute",
  ({
    doModalClose,
    doCollectionGroupSave,
    doUpdateUrlWithHomepage,
    doCollectionGroupDelete,
    routeParams,
    projectsByRoute: project,
    item,
  }) => {
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

    const handleDelete = (e) => {
      e.preventDefault();

      if (item && item.id) {
        doCollectionGroupDelete(
          item,
          () => {
            doModalClose();
            if (routeParams.hasOwnProperty("projectSlug")) {
              doUpdateUrlWithHomepage(`/${routeParams.projectSlug}/manager`);
            }
          },
          true,
        );
      }
    }

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
          <ModalFooter
            saveIsSubmit
            customClosingLogic
            onCancel={() => doModalClose()}
            onDelete={handleDelete}
          />
        </form>
      </div>
    );
  }
);
