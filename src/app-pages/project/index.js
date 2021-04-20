import React from 'react';

import Icon from '../../app-components/icon';
import SecondaryNavBar from '../../app-components/navigation/secondaryNavBar';

const Project = () => (
  <div>
    <SecondaryNavBar
      headingNode={<h4>Huntington District</h4>}
      navLinks={[
        {
          title: <span><Icon icon='view-dashboard' />&nbsp;Dashboard</span>,
          content: (
            <div>
              Dashboard Page
            </div>
          ),
        }, {
          title: <span><Icon icon='format-list-bulleted' />&nbsp;Instrument Groups</span>,
          content: (
            <div>
              To hold Instrument Group Page
            </div>
          ),
        }, {
          title: <span><Icon icon='speedometer' />&nbsp;All Instruments</span>,
          content: (
            <div>
              To hold All Instruments Page
            </div>
          ),
        }, {
          title: <span><Icon icon='alert-outline' />&nbsp;Alerts</span>,
          content: (
            <div>
              To hold Alerts Page
            </div>
          ),
        },
      ]}
    />
  </div>
);

export default Project;
