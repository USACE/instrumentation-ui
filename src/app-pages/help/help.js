import React from 'react';

import Hero from '../../app-components/hero';
import Navbar from '../../app-components/navbar';
import Onboarding from './onboarding';

const HelpPage = () => (
  <div>
    <Navbar theme='transparent' hideBrand={true} />
    <Hero />
    <section>
      <div className='container'>
        <h3 className='mt-3 mb-6'>Frequently Asked Questions</h3>
        <hr className='mb-6' />
        <section>
          <Onboarding />
        </section>
      </div>
    </section>
  </div>
);

export default HelpPage;
