import React, { useEffect, useState } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import RoleFilter from "../../app-components/role-filter";
import LoginMessage from "../../app-components/login-message";
import collectionGroupForm from "../manager/collection-group-form";
import collectionGroupTimeseriesPicker from "./collectiongroup-timeseries-picker";
import TimeseriesList from "./collectiongroup-timeseries-list";
import { roundToNearestMinutes } from "date-fns";
import TimestampModeSwitcher from "./collectiongroup-timestamp-mode-switcher";
import Notifications from "../../app-components/notifications";

export default connect(
  "doModalOpen",
  "selectProjectsByRoute",
  "selectCollectionGroupDetailByRoute",
  "selectAppTime",
  "doCollectionGroupRemoveTimeseries",
  "doTimeseriesMeasurementsSave",
  "doNotificationFire",
  ({
    doModalOpen,
    projectsByRoute: project,
    collectionGroupDetailByRoute: detail,
    appTime,
    doCollectionGroupRemoveTimeseries,
    doTimeseriesMeasurementsSave,
    doNotificationFire,
  }) => {
    const [isShown, setIsShown] = useState(true);
    // Valid timestampMode: "now", "choose"
    const [timestampMode, setTimestampMode] = useState("now");
    const [date, setDate] = useState(new Date());

    useEffect(
      (appTime) => {
        if (timestampMode === "now") {
          const d = roundToNearestMinutes(new Date());
          setDate(d);
        }
      },
      [timestampMode, appTime]
    );

    const handleTimeseriesSaveValue = (
      { id, instrument, name, unit },
      value
    ) => {
      const success = {
        level: "success",
        title: `Saved ${instrument} | ${name} `,
        message: `${value} ${unit}  @  ${date.toISOString()}
        `,
      };
      const fail = {
        level: "error",
        title: "value is missing",
        message: "Enter a value before double-clicking to submit",
      };
      if (!value) {
        doNotificationFire(fail);
        return;
      }
      doTimeseriesMeasurementsSave(
        {
          timeseries_id: id,
          items: [
            {
              time: date.toISOString(),
              value: parseFloat(value),
            },
          ],
        },
        false,
        false,
        true
      );
      doNotificationFire(success);
    };

    return (
      detail && (
        <>
          <div style={{ marginBottom: "200px" }}>
            <Navbar theme="primary" fixed />
            <section className="container" style={{ marginTop: "6rem" }}>
              <div className="d-flex flex-row">
                <h4 className="py-4">{detail.name}</h4>
                <button
                  onClick={(e) => {
                    doModalOpen(collectionGroupForm, {
                      item: detail,
                    });
                    e.stopPropagation();
                  }}
                  className="btn btn-sm btn-link"
                >
                  <span>edit</span>
                </button>
              </div>
              {/* CONFIGURATION DETAILS */}
              <div className="row">
                <div className="col">
                  <div className="card">
                    <div
                      className="card-header bg-light p-2"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <div className="d-flex flex-row align-items-center">
                        <i
                          onClick={(e) => setIsShown(!isShown)}
                          className={`mdi mdi-24px mr-2 ${
                            isShown ? "mdi-chevron-up" : "mdi-chevron-down"
                          }`}
                        />
                        <div>
                          <strong className="h5 p-0 m-0">Timeseries</strong>
                          <RoleFilter
                            allowRoles={[`${project.slug.toUpperCase()}.*`]}
                            alt={LoginMessage}
                          >
                            <button
                              onClick={(e) => {
                                doModalOpen(collectionGroupTimeseriesPicker);
                                e.stopPropagation();
                              }}
                              className="btn btn-sm btn-link"
                            >
                              <i className="mdi mdi-plus"></i>Add
                            </button>
                          </RoleFilter>
                        </div>
                      </div>
                      <div>
                        <TimestampModeSwitcher
                          timestampMode={timestampMode}
                          setTimestampMode={setTimestampMode}
                          date={date}
                          setDate={setDate}
                        />
                      </div>
                    </div>

                    {isShown ? (
                      <div className="card-body">
                        <div style={{ maxHeight: "600px", overflow: "auto" }}>
                          <TimeseriesList
                            items={detail.timeseries}
                            date={date}
                            handleItemDelete={(item) => {
                              doCollectionGroupRemoveTimeseries({
                                projectId: detail.project_id,
                                collectionGroupId: detail.id,
                                timeseriesId: item.id,
                              });
                            }}
                            handleItemSaveValue={handleTimeseriesSaveValue}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
            <Notifications />
          </div>
        </>
      )
    );
  }
);
