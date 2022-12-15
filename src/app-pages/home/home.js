import React from 'react';
import { connect } from 'redux-bundler-react';

import Footer from '../../app-components/footer';
import Hero from '../../app-components/hero';
import ProjectList from './project-list';

export default connect(
  'selectHomeData',
  'doNotificationFire',
  ({ homeData, doNotificationFire }) => (
    <div className='container-fluid px-0'>
      <section>
        <Hero />
      </section>
      <section>
        <div className='d-flex justify-content-around'>
          {homeData
            ? Object.keys(homeData).map((key, i) => (
              <div className='text-center pt-5 pb-4' key={i}>
                <div>
                  <p className='text-muted text-uppercase'>{key}</p>
                  <h4 className='font-weight-bold'>{homeData[key]}</h4>
                </div>
              </div>
            ))
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
  )
);
