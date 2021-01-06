import React, { useState } from "react";
import { connect } from "redux-bundler-react";

import { ModalFooter, ModalHeader } from "../../app-components/modal";

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
          <ModalHeader title='Edit Collection Group' />
          <section className="modal-body">
            <div className="form-group">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Group name..."
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
