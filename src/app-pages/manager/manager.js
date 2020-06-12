/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import InstrumentGroupTable from "./instrument-group-table";
import InstrumentTable from "./instrument-table";
import InstrumentForm from "./instrument-form";
import InstrumentGroupForm from "./instrument-group-form";
import Pager from "../../app-components/pager";

export default connect(
  "selectInstrumentGroupsItems",
  "selectInstrumentsItems",
  "selectKeyValState",
  "doModalOpen",
  "doKeyValSet",
  ({
    instrumentGroupsItems: groups,
    instrumentsItems: instruments,
    keyValState,
    doModalOpen,
    doKeyValSet,
  }) => {
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
          <div className="panel">
            <div className="panel-heading">
              <div className="tabs">
                <ul>
                  <li
                    className={tab === "grp" ? "is-active" : ""}
                    onClick={() => {
                      setTab("grp");
                    }}
                  >
                    <a>Instrument Groups</a>
                  </li>
                  <li
                    className={tab === "all" ? "is-active" : ""}
                    onClick={() => {
                      setTab("all");
                    }}
                  >
                    <a>All Instruments</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="panel-block">
              <div style={{ width: "100%" }}>
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <div className="field">
                        <p className="control has-icons-left">
                          <input
                            value={filter}
                            onChange={(e) => {
                              setFilter(e.target.value);
                            }}
                            className="input"
                            type="text"
                            placeholder="Search"
                          />
                          <span className="icon is-small is-left">
                            <i className="mdi mdi-magnify"></i>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item">
                      <button onClick={handleAdd} className="button is-primary">
                        Add New
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-block">
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
        <section className="container mt-3"></section>
      </div>
    );
  }
);
