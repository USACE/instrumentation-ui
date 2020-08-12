import React from "react";
import { connect } from "redux-bundler-react";
import Hero from "../../app-components/hero";
import Navbar from "../../app-components/navbar";
import ProjectList from "./project-list";
import Footer from "../../app-components/footer";

export default connect(
  "selectHomeData",

  ({ homeData }) => {
    return (
      <div
        className="container-fluid"
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <section>
          <Navbar theme="transparent" hideBrand={true} />
          <Hero />
        </section>
        <section>
          <div className="d-flex justify-content-around">
            {homeData
              ? Object.keys(homeData).map((key, i) => {
                  return (
                    <div className="text-center pt-5 pb-4" key={i}>
                      <div>
                        <p className="text-muted text-uppercase">{key}</p>
                        <h4 className="font-weight-bold">{homeData[key]}</h4>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </section>
        <hr />
        <section>
          <ProjectList />
        </section>
        <hr />
        <Footer />
      </div>
    );
  }
);
