import React from "react";
import { connect } from "redux-bundler-react";
import TimelineList from "./timeline-list";

export default connect(
  "selectInstrumentStatusItems",
  "selectInstrumentZItems",
  "selectInstrumentGroupsItemsObjectById",
  "selectProjectsByRoute",
  ({
    instrumentStatusItems: status,
    instrumentZItems: zs,
    instrumentGroupsItemsObjectById: groups,
    projectsByRoute: project,
    item,
  }) => {
    const statusItems = status
      .map((s) => {
        return {
          status: s.status,
          text: s.status
            ? s.status.charAt(0).toUpperCase() + s.status.slice(1)
            : "Saving...",
          date: new Date(s.time),
        };
      })
      .sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      });

    const zItems = zs
      .map((z) => {
        return {
          text: z.zreference ? z.zreference : "Saving...",
          date: new Date(z.time),
        };
      })
      .sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      });

    return (
      <div className="p-3">
        <div className="row mb-2">
          <div className="col-4 text-right font-weight-light">
            Instrument Type
          </div>
          <div className="col">{item.type}</div>
        </div>

        <div className="row mb-2">
          <div className="col-4 text-right font-weight-light">Status</div>
          <div className="col">
            <TimelineList items={statusItems} />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-4 text-right font-weight-light">Station</div>
          <div className="col">{item.station || "N/A"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-4 text-right font-weight-light">Offset</div>
          <div className="col">{item.offset || "N/A"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-4 text-right font-weight-light">
            Z-Reference Elevation
          </div>
          <div className="col">
            <TimelineList items={zItems} />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-4 text-right font-weight-light">
            Z-Reference Datum
          </div>
          <div className="col">{item.zreference_datum}</div>
        </div>

        <div className="row mb-2">
          <div className="col-4 text-right font-weight-light">Created On</div>
          <div className="col">
            {item.create_date
              ? new Date(item.create_date).toLocaleDateString()
              : "N/A"}
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-4 text-right font-weight-light">
            Last Modified On
          </div>
          <div className="col">
            {item.update_date
              ? new Date(item.update_date).toLocaleDateString()
              : "N/A"}
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-4 text-right font-weight-light">Belongs to</div>
          <div className="col">
            {!item.groups || !item.groups.length
              ? "Not a member of any group yet."
              : null}
            {item.groups.map((groupId, i) => {
              const group = groups[groupId];
              if (!group) return null;
              return (
                <a href={`/${project.slug}/groups/${group.slug}`}>
                  {group.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);
