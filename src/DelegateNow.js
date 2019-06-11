import React from 'react';
//import ReactLedgerComponent from './ReactLedgerComponent';
import DelegateModal from './DelegateModal';
//import RedelegateModal from './RedelegateModal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

const DelegateNow = () => {
  return (
    <div className="show-stage_sub" id="delegatenow">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h3>Delegate securely with your ledger<span /></h3>
            <hr />
            <div className="row">
              <div className="col-lg-6">
                  <p>Delegate to our validator from your browser - no need to touch a command line interface. Watch the video tutorial <a href="https://t.me/stakingfacilities" target="_blank">here. </a></p>
              </div>
              <div className="col-lg-6">
                  <p>Maximize compounding interest by claiming and redelegating your rewards in just two clicks.</p>
              </div>
            </div>
            <Tabs>
              <TabList>
                <Tab>Delegate Now</Tab>
                <Tab>Redelegate Now</Tab>
              </TabList>
              <TabPanel>
                <DelegateModal/>
              </TabPanel>
              <TabPanel>
                <h2>This is the second panel </h2>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DelegateNow
