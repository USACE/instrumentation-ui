import React from "react";
import { connect } from "redux-bundler-react";
import Hero from "../../app-components/hero";
import ProjectCard from "../../app-components/project-card";
import SearchBar from "./search-bar";
import Footer from "../../app-components/footer";

export default connect(
  "selectHomeData",
  "selectProjectsItemsWithLinks",
  ({ homeData, projectsItemsWithLinks: projects }) => {
    return (
      <div>
        <Hero />

        <section className="section">
          <nav className="level">
            {homeData
              ? Object.keys(homeData).map((key, i) => {
                  return (
                    <div className="level-item has-text-centered" key={i}>
                      <div>
                        <p className="heading">{key}</p>
                        <p className="title">{homeData[key]}</p>
                      </div>
                    </div>
                  );
                })
              : null}
          </nav>
        </section>
        <hr />
        <section className="section">
          <div className="level">
            <h4 className="subtitle is-4 level-item has-text-centered">
              Active Projects
            </h4>
          </div>
          <div
            className="tile is-parent"
            style={{ flexWrap: "wrap", justifyContent: "center" }}
          >
            {projects.map((p, i) => {
              return (
                <div
                  key={i}
                  className="tile is-child"
                  style={{
                    minWidth: "400px",
                    maxWidth: "450px",
                    padding: "20px",
                  }}
                >
                  <ProjectCard
                    img={p.img}
                    title={p.title}
                    href={p.href}
                    subtitle={p.subtitle}
                    content={p.content}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="is-hidden container pl-5 pr-5">
            <SearchBar />
          </div>
        </section>
        <Footer />
      </div>
    );
  }
);
