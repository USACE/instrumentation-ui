import React from "react";
import Hero from "../../app-components/hero";
import SearchBar from "./search-bar";
import Footer from "../../app-components/footer";

export default () => {
  return (
    <div>
      <Hero />
      <section className="section">
        <nav className="level">
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Piezometers</p>
              <p className="title">234</p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Staffgages</p>
              <p className="title">123</p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Groups</p>
              <p className="title">34</p>
            </div>
          </div>
        </nav>
      </section>
      <section className="section">
        <div className="container pl-5 pr-5">
          <SearchBar />
        </div>
      </section>
      <Footer />
    </div>
  );
};
