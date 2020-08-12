/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
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
  "selectKeyValState",
  "doModalOpen",
  "doKeyValSet",
  ({
    projectsByRoute: project,
    instrumentGroupsItems: groups,
    instrumentsItems: instruments,
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
      tab === "grp"
        ? doModalOpen(InstrumentGroupForm)
        : doModalOpen(InstrumentForm);
    };
    return (
      <div>
        <Navbar theme="primary" />
        <section className="container mt-3">
          <div className="card">
            <div className="card-header pb-0">
              <ul className="nav nav-tabs">
                <li
                  onClick={() => {
                    setTab("grp");
                  }}
                  className="nav-item pointer"
                >
                  <span className={`nav-link ${tab === "grp" ? "active" : ""}`}>
                    Instrument Groups
                  </span>
                </li>
                <li
                  onClick={() => {
                    setTab("all");
                  }}
                  className="nav-item pointer"
                >
                  <span className={`nav-link ${tab === "all" ? "active" : ""}`}>
                    All Instruments
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
              {tab === "grp" ? (
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
              ) : (
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
            </div>
          </div>
        </section>
      </div>
    );
  }
);
