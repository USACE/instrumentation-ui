import React from 'react';

import ApiHelp from './apiHelp';
import Hero from '../../app-components/hero';
import Onboarding from './onboarding';

const HelpPage = () => (
  <>
    <Hero />
    <section className='mb-4'>
      <div className='container'>
        <h3 className='mt-3 mb-6'>Frequently Asked Questions</h3>
        <hr className='mb-6' />
        <Onboarding />
        <ApiHelp />
      </div>
    </section>
  </>
);

export default HelpPage;
