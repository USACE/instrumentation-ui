import React, { useState } from "react";
import { connect } from "redux-bundler-react";

const csvSampleProjects = [
    ["Project Name"],
    ["My Sample Project Name 1"],
    ["My Sample Project Name 2"],
];

const csvSampleInstruments = [
    [
        "Project",
        "Name",
        "Status",
        "Type",
        "Longitude",
        "Latitude",
        "ZReference",
        "Station",
        "Offset",
    ],
    [
        "My Sample Project Name 1",
        "My Example Piezometer 1A",
        "active",
        "Piezometer",
        -80.77,
        26.7,
        10.5,
        "100",
        "50",
    ],
    [
        "My Sample Project Name 1",
        "Piezometer at North Spillway Pool Side",
        "active",
        "Piezometer",
        -82.15,
        27.0,
        300.25,
        "100",
        "50",
    ],
];

const csvSampleTimeseries = [["Coming Soon..."]];

const csvSampleTimeseriesMeasurements = [["Coming Soon..."]];

const DownloadCSVButton = ({ csvContent, filename }) => {
    // Used as a reference:
    // https://code-maven.com/create-and-download-csv-with-javascript
    const handleClick = (e) => {
        var csv = "";
        csvContent.forEach((row) => {
            csv += `${row.join(",")}\n`;
        });
        const blob = new Blob([csv], { type: "application/text" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <button onClick={handleClick} className="button is-small is-info is-light">
            Download Template .CSV
        </button>
    );
};

export default connect(
    "selectDomainsItemsByGroup",
    ({ domainsItemsByGroup }) => {
        // NotesXYZ are additional information to be included with each tab
        const NotesInstruments = ({ props }) => (
            <div className="content">
                <p className="has-text-primary">Optional Fields:</p>
                <ul>
                    <li key={1}>Station</li>
                    <li key={2}>Offset</li>
                </ul>
                <p className="has-text-primary">Type can be one of the following:</p>
                <ul>
                    {domainsItemsByGroup.instrument_type.map((t, idx) => (
                        <li key={idx}>{t.value}</li>
                    ))}
                </ul>
                <p className="has-text-primary">Status can be one of the following:</p>
                <ul>
                    {domainsItemsByGroup.status.map((t, idx) => (
                        <li key={idx}>{t.value}</li>
                    ))}
                </ul>
            </div>
        );
        const NotesProjects = ({ props }) => <></>;
        const NotesTimeseries = ({ props }) => <></>;
        const NotesTimeseriesMeasurements = ({ props }) => <></>;

        const tabs = {
            Projects: {
                csvdata: csvSampleProjects,
                notes: <NotesProjects />,
            },
            Instruments: {
                csvdata: csvSampleInstruments,
                notes: <NotesInstruments />,
            },
            Timeseries: {
                csvdata: csvSampleTimeseries,
                notes: <NotesTimeseries />,
            },
            "Timeseries Measurements": {
                csvdata: csvSampleTimeseriesMeasurements,
                notes: <NotesTimeseriesMeasurements />,
            },
        };

        const [tabActive, setTabActive] = useState(Object.keys(tabs)[0]);
        const [tabData, setTabData] = useState(Object.values(tabs)[0]);

        const handleTabClick = (e, name) => {
            setTabActive(name);
            setTabData(tabs[name]);
        };

        const Tab = ({ name }) => (
            <li className={tabActive === `${name}` && "is-active"}>
                <a href={`/help#onboard-${name}`} onClick={(e) => handleTabClick(e, name)}>{name}</a>
            </li>
        );

        const CSV = ({ arr }) => (
            <pre>
                {arr.map((row, idx) => (
                    <p className="m-0" key={idx}>
                        {row.join(",")}
                    </p>
                ))}
            </pre>
        );

        return (
            <div className="box content">
                <p className="is-size-3">
                    <strong className="pr-3">Q:</strong>I want to try the site with my own projects. How should I organize my dataset for upload?
        </p>
                <p className="is-size-5 has-text-weight-light">
                    Glad you asked! The site supports .csv uploads of Instruments at this
                    time. Uploaders for Projects, Timeseries, and Timeseries measurements
          are coming in the next few weeks. To get organized, start with{" "}
                    <span className="has-text-weight-bold">projects</span> and{" "}
                    <span className="has-text-weight-bold">instruments</span>. Create a
          separate .csv file for each. You can download the template .csv files below and modify them with your own data.
        </p>
                <p></p>
                <div className="tabs is-centered">
                    <ul>
                        {Object.keys(tabs).map((t, idx) => (
                            <Tab key={idx} name={t} />
                        ))}
                    </ul>
                </div>
                <section className="section p-2 has-background-light">
                    <div className="is-pulled-right">
                        <DownloadCSVButton
                            csvContent={tabData.csvdata}
                            filename={`${tabActive}.csv`}
                        />
                    </div>
                    <CSV arr={tabData.csvdata} />
                </section>
                <section className="section has-background-">{tabData.notes}</section>
            </div>
        );
    }
);
