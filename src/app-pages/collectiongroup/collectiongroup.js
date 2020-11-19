import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import RoleFilter from "../../app-components/role-filter";
import LoginMessage from "../../app-components/login-message";
import collectionGroupForm from "../manager/collection-group-form";
import collectionGroupTimeseriesPicker from "./collectiongroup-timeseries-picker";
import { parseISO, formatDistanceToNow } from "date-fns";
import DatePicker from "react-datepicker";

export default connect(
  "doModalOpen",
  "selectProjectsByRoute",
  "selectCollectionGroupByRoute",
  "selectCollectionGroupDetailByRoute",
  "doCollectionGroupRemoveTimeseries",
  ({
    doModalOpen,
    projectsByRoute: project,
    collectionGroupByRoute: collectionGroup,
    collectionGroupDetailByRoute: collectionGroupDetail,
    doCollectionGroupRemoveTimeseries,
  }) => {
    const [configIsShown, setConfigIsShown] = useState(true);

    const CollectionGroupConfig = (props) => (
      <div
        className="card-body"
        style={{ maxHeight: "600px", overflow: "auto" }}
      >
        <TimeseriesList />
      </div>
    );

    const CollectionGroupDataEntry = (props) => {
      const TimeseriesSection = ({ timeseries: t }) => {
        const [date, setDate] = useState(new Date());
        const [value, setValue] = useState(null);
        const longAgo = formatDistanceToNow(parseISO(t.latest_time), {
          includeSeconds: true,
          addSuffix: true,
        });

        return (
          <div>
            <div className="d-flex flex-row justify-content-between">
              <div className="d-flex flex-column">
                <div className="h4">{t.instrument}</div>
                <div className="h6">{t.name}</div>
              </div>
              <div className="d-flex flex-column justify-content-around">
                <div className="h4">
                  {t.latest_value}
                  <small className="ml-2 text-uppercase text-secondary">
                    {t.unit}
                  </small>
                </div>
                <div className="text-secondary">{longAgo}</div>
              </div>
              <div style={{ width: 120 }}>
                <input
                  type="number"
                  class="form-control"
                  id=""
                  aria-describedby="emailHelp"
                  placeholder="value"
                  onChange={(e) => {
                    setValue(e.target.value);
                    console.log(value);
                  }}
                />
              </div>
              <div>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="MMMM d, yyyy h:mm aa zzzz"
                  showTimeInput
                />
              </div>
            </div>
            <hr />
          </div>
        );
      };

      return (
        collectionGroupDetail &&
        collectionGroupDetail.timeseries &&
        !!collectionGroupDetail.timeseries.length && (
          <div>
            <div className="d-flex flex-row-reverse mb-3">
              <button className="btn btn-primary w-100">Save</button>
            </div>
            {collectionGroupDetail.timeseries.map((t, idx) => (
              <TimeseriesSection timeseries={t} />
            ))}
          </div>
        )
      );
    };

    const TimeseriesList = (props) =>
      collectionGroupDetail &&
      collectionGroupDetail.timeseries && (
        <div className="w-100 list-group">
          {collectionGroupDetail.timeseries.map((t, idx) => (
            <div className="d-flex flex-row list-group-item border-0 bg-light my-1 justify-content-between">
              {/* Column 1 */}
              <div className="d-flex flex-column align-items-start">
                <div className="d-flex flex-row my-2">
                  <div className="h5 mb-1">{t.instrument}</div>
                  <div className="text-secondary"></div>
                </div>
                <div className="h6">
                  {t.name}
                  <small className="ml-2 text-uppercase text-secondary">
                    | {t.unit}
                  </small>
                </div>
              </div>
              {/* Column 2 */}
              <div>
                <button
                  className="btn btn-link h-100"
                  onClick={(e) => {
                    doCollectionGroupRemoveTimeseries({
                      projectId: collectionGroup.project_id,
                      collectionGroupId: collectionGroup.id,
                      timeseriesId: t.id,
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      );

    return (
      collectionGroup && (
        <div style={{ marginBottom: "200px" }}>
          <Navbar theme="primary" fixed />
          <section className="container" style={{ marginTop: "6rem" }}>
            {/* CONFIGURATION DETAILS */}
            <div className="row">
              <div className="col">
                <div className="card" style={{ maxHeight: "600px" }}>
                  <div
                    className="card-header"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                    onClick={(e) => setConfigIsShown(!configIsShown)}
                  >
                    <div className="d-flex flex-row align-items-center">
                      <i
                        className={`mdi mdi-24px mr-2 ${
                          configIsShown ? "mdi-chevron-up" : "mdi-chevron-down"
                        }`}
                      />
                      <strong>{collectionGroup.name}</strong>
                    </div>
                    <RoleFilter
                      allowRoles={[`${project.slug.toUpperCase()}.*`]}
                      alt={LoginMessage}
                    >
                      <div>
                        <button
                          onClick={(e) => {
                            doModalOpen(collectionGroupForm, {
                              item: collectionGroup,
                            });
                            e.stopPropagation();
                          }}
                          className="btn btn-sm btn-outline-info"
                        >
                          <i className="mdi mdi-pencil pr-2"></i> Edit
                        </button>
                        <button
                          onClick={(e) => {
                            doModalOpen(collectionGroupTimeseriesPicker);
                            e.stopPropagation();
                          }}
                          className="btn btn-sm btn-outline-info ml-2"
                        >
                          <i className="mdi mdi-plus pr-2"></i> Add Field
                        </button>
                      </div>
                    </RoleFilter>
                  </div>
                  {configIsShown ? <CollectionGroupConfig /> : null}
                </div>
              </div>
            </div>
            {/* DATA ENTRY SECTION */}
            <div className="row mt-5">
              <div className="col">
                <CollectionGroupDataEntry />
              </div>
            </div>
          </section>
        </div>
      )
    );
  }
);
