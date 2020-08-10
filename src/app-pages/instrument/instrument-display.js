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
        <div className="columns">
          <div className="column is-4 has-text-right has-text-weight-semibold">
            Instrument Type
          </div>
          <div className="column">{item.type}</div>
        </div>

        <div className="columns">
          <div className="column is-4 has-text-right has-text-weight-semibold">
            Status
          </div>
          <div className="column">
            <TimelineList items={statusItems} />
          </div>
        </div>

        <div className="columns">
          <div className="column is-4 has-text-right has-text-weight-semibold">
            Station
          </div>
          <div className="column">{item.station || "N/A"}</div>
        </div>

        <div className="columns">
          <div className="column is-4 has-text-right has-text-weight-semibold">
            Offset
          </div>
          <div className="column">{item.offset || "N/A"}</div>
        </div>

        <div className="columns">
          <div className="column is-4 has-text-right has-text-weight-semibold">
            Z-Reference Elevation
          </div>
          <div className="column">
            <TimelineList items={zItems} />
          </div>
        </div>

        <div className="columns">
          <div className="column is-4 has-text-right has-text-weight-semibold">
            Z-Reference Datum
          </div>
          <div className="column">{item.zreference_datum}</div>
        </div>

        <div className="columns">
          <div className="column is-4 has-text-right has-text-weight-semibold">
            Created On
          </div>
          <div className="column">
            {item.create_date
              ? new Date(item.create_date).toLocaleDateString()
              : "N/A"}
          </div>
        </div>

        <div className="columns">
          <div className="column is-4 has-text-right has-text-weight-semibold">
            Last Modified On
          </div>
          <div className="column">
            {item.update_date
              ? new Date(item.update_date).toLocaleDateString()
              : "N/A"}
          </div>
        </div>

        <div className="columns">
          <div className="column is-4 has-text-right has-text-weight-semibold">
            Belongs to
          </div>
          <div className="column">
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
