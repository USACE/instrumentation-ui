import React from "react";

import Hero from "../../app-components/hero";
import Onboarding from "./onboarding";

export default () => (
    <div>
        <Hero />
        <section className="section">
            <div className="container">
                <h1 className="title mb-6">Frequently Asked Questions</h1>
                <hr className="mb-6" />
                <section className="section">
                    <Onboarding />
                </section>
            </div>
        </section>
    </div>
);
