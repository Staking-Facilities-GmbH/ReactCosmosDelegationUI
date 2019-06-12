import React, { Component } from 'react';
import DelegateModal from './DelegateModal';
//import RedelegateModal from './RedelegateModal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class DelegateNow extends Component {
  constructor(props) {
    super(props);
  }
  render(){
  return (
    <div className="show-stage_sub" id="delegatenow">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Tabs style={{marginTop: "30px"}}>
              <TabList>
                <Tab>Delegate Now</Tab>
                <Tab>Redelegate your rewards</Tab>
              </TabList>
              <TabPanel>
                <DelegateModal validator_addr={this.props.validator_addr} api_url={this.props.api_url} fee={this.props.fee}/>
              </TabPanel>
              <TabPanel>
                <h2>Test</h2>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
}

export default DelegateNow
