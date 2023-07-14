import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import { ModalFooter, ModalHeader } from '../../app-components/modal';
import MultiSelect from '../../app-components/multi-select';

export default connect(
  'doInstrumentGroupInstrumentsSave',
  'selectInstrumentsItemsObject',
  'selectInstrumentGroupInstrumentsItemsObject',
  ({
    doInstrumentGroupInstrumentsSave,
    instrumentsItemsObject: instruments,
    instrumentGroupInstrumentsItemsObject: groupInstruments,
  }) => {
    const [instrumentSlugs, setInstrumentSlugs] = useState([]);

    const handleSave = (_e) => {
      instrumentSlugs.forEach(instrumentSlug => {
        const instrument = instruments[instrumentSlug];
        doInstrumentGroupInstrumentsSave(instrument, null, true, true);
      });
    };

    const currentMembers = Object.keys(groupInstruments);
    const options = Object.values(instruments)
      .filter((inst) => currentMembers.indexOf(inst.id) === -1)
      .sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });

    return (
      <div className='modal-content overflow-visible'>
        <ModalHeader title='Choose Instruments' />
        <section className='modal-body overflow-visible'>
          <MultiSelect
            text={`Select Instruments (${instrumentSlugs.length} selected)`}
            isFilterable
            withSelectAllOption
            onChange={val => setInstrumentSlugs(val)}
            options={options.map(opt => ({
              text: opt.name,
              value: opt.slug,
            }))}
          />
        </section>
        <ModalFooter
          showCancelButton
          saveText='Add'
          onSave={() => handleSave()}
        />
      </div>
    );
  }
);
