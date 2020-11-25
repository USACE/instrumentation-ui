/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import CollectionGroupTable from "./collection-group-table";
import CollectionGroupForm from "./collection-group-form";
import InstrumentGroupTable from "./instrument-group-table";
import InstrumentTable from "./instrument-table";
import InstrumentForm from "./instrument-form";
import InstrumentGroupForm from "./instrument-group-form";
import Pager from "../../app-components/pager";
import RoleFilter from "../../app-components/role-filter";
import LoginMessage from "../../app-components/login-message";

export default connect(
  "selectProjectsByRoute",
  "selectInstrumentGroupsItems",
  "selectInstrumentsItems",
  "selectCollectionGroupItems",
  "selectKeyValState",
  "doModalOpen",
  "doKeyValSet",
  ({
    projectsByRoute: project,
    instrumentGroupsItems: groups,
    instrumentsItems: instruments,
    collectionGroupItems: collectionGroups,
    keyValState,
    doModalOpen,
    doKeyValSet,
  }) => {
    if (!project) return null;
    let { tab, filter } = keyValState;
    if (!tab) tab = "grp";
    if (!filter) filter = "";

    const setTab = (newTab) => {
      doKeyValSet({ tab: newTab });
    };

    const setFilter = (newFitler) => {
      doKeyValSet({ filter: newFitler });
    };

    const handleAdd = () => {
      const obj = {
        grp: InstrumentGroupForm,
        all: InstrumentForm,
        cgrp: CollectionGroupForm,
      };
      doModalOpen(obj[tab]);
    };

    return (
      <div>
        <Navbar theme="primary" />
        <section className="container mt-3">
          <div className="card">
            <div className="card-header pb-0" style={{ borderBottom: "none" }}>
              <ul className="nav nav-tabs">
                <li
                  onClick={() => {
                    setTab("grp");
                  }}
                  className="nav-item pointer"
                >
                  <span className={`nav-link ${tab === "grp" ? "active" : ""}`}>
                    <strong>Instrument Groups</strong>
                  </span>
                </li>
                <li
                  onClick={() => {
                    setTab("all");
                  }}
                  className="nav-item pointer"
                >
                  <span className={`nav-link ${tab === "all" ? "active" : ""}`}>
                    <strong>All Instruments</strong>
                  </span>
                </li>
                <li
                  onClick={() => {
                    setTab("cgrp");
                  }}
                  className="nav-item pointer"
                >
                  <span
                    className={`nav-link ${tab === "cgrp" ? "active" : ""}`}
                  >
                    <strong>Collection Groups</strong>
                  </span>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-10">
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filter list..."
                        value={filter}
                        onChange={(e) => {
                          setFilter(e.target.value);
                        }}
                      />
                      <div className="input-group-append">
                        <span
                          title="Clear Filter"
                          className="input-group-text pointer"
                          onClick={() => {
                            setFilter("");
                          }}
                        >
                          <i className="mdi mdi-close"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-2">
                  <div className="float-right">
                    <RoleFilter
                      allowRoles={[`${project.slug.toUpperCase()}.*`]}
                      alt={LoginMessage}
                    >
                      <button onClick={handleAdd} className="btn btn-primary">
                        Add New
                      </button>
                    </RoleFilter>
                  </div>
                </div>
              </div>
              {tab === "grp" && (
                <Pager
                  itemsKey="groups"
                  items={groups.filter((item) => {
                    if (!filter) return true;
                    return (
                      Object.values(item)
                        .join(" ")
                        .toUpperCase()
                        .indexOf(filter.toUpperCase()) !== -1
                    );
                  })}
                >
                  <InstrumentGroupTable />
                </Pager>
              )}
              {tab === "all" && (
                <Pager
                  itemsKey="instruments"
                  items={instruments.filter((item) => {
                    if (!filter) return true;
                    return (
                      Object.values(item)
                        .join(" ")
                        .toUpperCase()
                        .indexOf(filter.toUpperCase()) !== -1
                    );
                  })}
                >
                  <InstrumentTable />
                </Pager>
              )}
              {tab === "cgrp" && (
                <Pager
                  itemsKey="collectionGroups"
                  items={collectionGroups.filter((item) => {
                    if (!filter) return true;
                    return (
                      Object.values(item)
                        .join(" ")
                        .toUpperCase()
                        .indexOf(filter.toUpperCase()) !== -1
                    );
                  })}
                >
                  <CollectionGroupTable />
                </Pager>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }
);
